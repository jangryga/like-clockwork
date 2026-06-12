import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { listGuildChannels, fetchArchivedThreads, sleep } from "./src/api.js";
import { scrapeChannel } from "./src/scraper.js";
import { loadAllMessages, saveMessage } from "./src/storage.js";
import {
  downloadAttachments,
  downloadEmbeds,
  isDiscordCdnUrl,
} from "./src/media.js";
import { config } from "dotenv";

config();

// ── Config ────────────────────────────────────────────────────────────────────

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

/** How far back to scrape. Messages older than this date are ignored. */
const CUTOFF_DATE = new Date("2026-01-01");

/** Only scrape these channel types (0 = text, 5 = announcement). */
const SCRAPE_TYPES = new Set([0, 5]);

/**
 * When set, only scrape this specific channel ID (and its threads).
 * Set to null to scrape all eligible channels in the guild.
 */
const CHANNEL_ID: string | null = "1446259725858635968";

// ── Channel type labels (for --list display) ──────────────────────────────────

const CHANNEL_TYPE_LABELS: Record<number, string> = {
  0: "text",
  2: "voice",
  4: "category",
  5: "announcement",
  10: "announcement-thread",
  11: "public-thread",
  12: "private-thread",
  13: "stage",
  15: "forum",
  16: "media",
};

// ── Modes ─────────────────────────────────────────────────────────────────────

async function listMode(): Promise<void> {
  const channels = await listGuildChannels(GUILD_ID, DISCORD_TOKEN);

  console.log(`\nChannels in guild ${GUILD_ID}:\n`);
  console.log(`${"ID".padEnd(20)} ${"TYPE".padEnd(16)} NAME`);
  console.log("-".repeat(64));

  for (const ch of channels) {
    const type = CHANNEL_TYPE_LABELS[ch.type] ?? `type-${ch.type}`;
    const scrappable = SCRAPE_TYPES.has(ch.type) ? "" : "  (skipped)";
    console.log(
      `${ch.id.padEnd(20)} ${type.padEnd(16)} ${ch.name}${scrappable}`,
    );
  }

  console.log(`\nTotal: ${channels.length} channels`);
}

async function scrapeMode(): Promise<void> {
  const channels = await listGuildChannels(GUILD_ID, DISCORD_TOKEN);
  const eligible = channels.filter((ch) => SCRAPE_TYPES.has(ch.type));
  const targets = CHANNEL_ID
    ? eligible.filter((ch) => ch.id === CHANNEL_ID)
    : eligible;

  if (CHANNEL_ID && targets.length === 0) {
    console.error(
      `Channel ${CHANNEL_ID} not found in guild (or is not a scrapable type). Run --list to see available channels.`,
    );
    process.exit(1);
  }

  console.log(
    `\nScraping ${targets.length} channel(s) — cutoff: ${CUTOFF_DATE.toDateString()}\n`,
  );

  let totalSaved = 0;
  let totalSkipped = 0;
  let totalMedia = 0;

  for (const channel of targets) {
    const stats = await scrapeChannel(channel, DISCORD_TOKEN, CUTOFF_DATE);
    totalSaved += stats.saved;
    totalSkipped += stats.skipped;
    totalMedia += stats.mediaDownloaded;

    const reason = {
      cutoff: `reached cutoff date (${CUTOFF_DATE.toDateString()})`,
      exhausted: "no more messages",
      "caught-up": "caught up with previous run",
    }[stats.stoppedReason];

    console.log(
      `  [#${channel.name}] done — ${stats.saved} saved, ${stats.mediaDownloaded} files, ${stats.pages} pages, stopped: ${reason}`,
    );
  }

  // ── Threads ──────────────────────────────────────────────────────────────────

  console.log("\nDiscovering threads…");

  // Source 1: type-18 (THREAD_CREATED) messages we just scraped.
  // Each carries a `threadRef` with the thread's channel ID + name.
  const threadMap = new Map<
    string,
    { id: string; name: string; parentId: string }
  >();

  for (const channel of targets) {
    for (const msg of loadAllMessages(channel.id)) {
      if (msg.threadRef) {
        threadMap.set(msg.threadRef.id, {
          ...msg.threadRef,
          parentId: channel.id,
        });
      }
    }
  }

  // Source 2: archived threads per channel (works with user tokens).
  for (const channel of targets) {
    const archived = await fetchArchivedThreads(channel.id, DISCORD_TOKEN);
    for (const t of archived) {
      threadMap.set(t.id, { id: t.id, name: t.name, parentId: channel.id });
    }
    if (archived.length > 0) await sleep(500);
  }

  const allThreads = [...threadMap.values()].map((t) => ({
    id: t.id,
    name: t.name,
    type: 11 as const,
    position: 0,
    parent_id: t.parentId,
  }));

  if (allThreads.length === 0) {
    console.log("  No threads found.");
  } else {
    console.log(`  Found ${allThreads.length} thread(s)\n`);

    for (const thread of allThreads) {
      const parentId = thread.parent_id ?? undefined;
      const stats = await scrapeChannel(
        thread,
        DISCORD_TOKEN,
        CUTOFF_DATE,
        parentId,
      );
      totalSaved += stats.saved;
      totalSkipped += stats.skipped;
      totalMedia += stats.mediaDownloaded;

      const reason = {
        cutoff: `reached cutoff date (${CUTOFF_DATE.toDateString()})`,
        exhausted: "no more messages",
        "caught-up": "caught up with previous run",
      }[stats.stoppedReason];

      console.log(
        `  [thread: ${thread.name}] done — ${stats.saved} saved, ${stats.mediaDownloaded} files, stopped: ${reason}`,
      );
    }
  }

  console.log(
    `\nFinished. Messages saved: ${totalSaved}, media files downloaded: ${totalMedia}, skipped: ${totalSkipped}`,
  );
}

/**
 * Walks every stored channel directory and downloads attachments that are
 * missing a localPath — useful for backfilling messages scraped before
 * media support was added.
 */
async function syncMediaMode(): Promise<void> {
  const dataDir = join(process.cwd(), "data");
  if (!existsSync(dataDir)) {
    console.log("No data directory found — nothing to sync.");
    return;
  }

  const channelIds = readdirSync(dataDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  console.log(`\nSyncing media for ${channelIds.length} channel(s)…\n`);

  let totalDownloaded = 0;
  let totalSkipped = 0;

  for (const channelId of channelIds) {
    const messages = loadAllMessages(channelId);
    let channelDownloaded = 0;

    for (const message of messages) {
      const needsAttachments = message.attachments.some(
        (a) => isDiscordCdnUrl(a.url) && !a.localPath,
      );
      const needsEmbeds = message.embeds.some(
        (e) =>
          (e.type === "gifv" && e.video?.url && !e.localPath) ||
          (e.type === "image" && e.thumbnail?.url && !e.localPath),
      );

      if (!needsAttachments && !needsEmbeds) {
        totalSkipped++;
        continue;
      }

      const [
        { attachments, downloaded: attDl },
        { embeds, downloaded: gifDl },
      ] = await Promise.all([
        needsAttachments
          ? downloadAttachments(message)
          : Promise.resolve({
              attachments: message.attachments,
              downloaded: 0,
            }),
        needsEmbeds
          ? downloadEmbeds(message)
          : Promise.resolve({ embeds: message.embeds, downloaded: 0 }),
      ]);

      const totalDl = attDl + gifDl;
      if (totalDl > 0) {
        saveMessage({ ...message, attachments, embeds });
        channelDownloaded += totalDl;
        totalDownloaded += totalDl;
      }
    }

    if (channelDownloaded > 0) {
      console.log(`  [${channelId}] ${channelDownloaded} file(s) downloaded`);
    }
  }

  console.log(
    `\nSync complete. Downloaded: ${totalDownloaded}, messages with no pending media: ${totalSkipped}`,
  );
}

// ── Entry point ───────────────────────────────────────────────────────────────

const mode = process.argv[2];

if (mode === "--list") {
  listMode().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (mode === "--scrape" || mode === undefined) {
  scrapeMode().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else if (mode === "--sync-media") {
  syncMediaMode().catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
} else {
  console.error(`Unknown flag: ${mode}`);
  console.error("Usage: tsx index.ts [--list | --scrape | --sync-media]");
  process.exit(1);
}
