import { fetchMessagePage, sleep } from "./api.js";
import { readIndex, writeIndex, persistMessage, saveMessage } from "./storage.js";
import { downloadAttachments, downloadEmbeds, isDiscordCdnUrl } from "./media.js";
import type { DiscordChannel } from "./types.js";

const PAGE_DELAY_MS = 1_000;

export interface ScrapeStats {
  saved: number;
  skipped: number;
  pages: number;
  mediaDownloaded: number;
  stoppedReason: "cutoff" | "exhausted" | "caught-up";
}

/**
 * Scrapes all messages in a channel backwards in time until:
 *   - the oldest message on a page predates `cutoffDate`, OR
 *   - there are no more messages (< 100 returned), OR
 *   - an entire page consists only of already-stored messages with no pending media
 *
 * The channel index is written to disk after every page so progress survives
 * interruptions.
 */
export async function scrapeChannel(
  channel: DiscordChannel,
  token: string,
  cutoffDate: Date,
  parentChannelId?: string,
): Promise<ScrapeStats> {
  const index = readIndex(channel.id);
  const stats: ScrapeStats = {
    saved: 0,
    skipped: 0,
    pages: 0,
    mediaDownloaded: 0,
    stoppedReason: "exhausted",
  };

  index.channelName = channel.name;
  if (parentChannelId) index.parentChannelId = parentChannelId;

  let before: string | undefined = oldestStoredId(index.messages);

  console.log(`\n[#${channel.name}] starting scrape (cutoff: ${cutoffDate.toDateString()})`);
  if (before) {
    console.log(`  resuming from message ${before}`);
  }

  while (true) {
    const page = await fetchMessagePage(channel.id, token, before);
    stats.pages++;

    if (page.length === 0) {
      stats.stoppedReason = "exhausted";
      break;
    }

    let newOnPage = 0;
    let mediaOnPage = 0;
    let hitCutoff = false;

    for (const msg of page) {
      if (new Date(msg.timestamp) < cutoffDate) {
        hitCutoff = true;
        break;
      }

      const { isNew, message } = persistMessage(msg, index);

      if (isNew) {
        newOnPage++;
        stats.saved++;
      } else {
        stats.skipped++;
      }

      // Download attachments and GIF embeds not yet on disk
      const needsAttachments = message.attachments.some(
        (a) => isDiscordCdnUrl(a.url) && !a.localPath,
      );
      const needsEmbeds = message.embeds.some(
        (e) =>
          (e.type === "gifv" && e.video?.url && !e.localPath) ||
          (e.type === "image" && e.thumbnail?.url && !e.localPath),
      );

      if (needsAttachments || needsEmbeds) {
        const [{ attachments, downloaded: attDl }, { embeds, downloaded: gifDl }] =
          await Promise.all([
            needsAttachments ? downloadAttachments(message) : Promise.resolve({ attachments: message.attachments, downloaded: 0 }),
            needsEmbeds ? downloadEmbeds(message) : Promise.resolve({ embeds: message.embeds, downloaded: 0 }),
          ]);

        const totalDl = attDl + gifDl;
        if (totalDl > 0) {
          saveMessage({ ...message, attachments, embeds });
          mediaOnPage += totalDl;
          stats.mediaDownloaded += totalDl;
        }
      }
    }

    index.lastScrapedAt = new Date().toISOString();
    writeIndex(index);

    const oldest = page[page.length - 1];
    const oldestTs = oldest ? new Date(oldest.timestamp).toLocaleString() : "?";
    const mediaSuffix = mediaOnPage > 0 ? `, ${mediaOnPage} files downloaded` : "";

    console.log(
      `  page ${stats.pages}: +${newOnPage} new, ${stats.skipped} skipped total${mediaSuffix} | oldest: ${oldestTs}`,
    );

    if (hitCutoff) {
      stats.stoppedReason = "cutoff";
      break;
    }

    // A full page where everything is already stored AND has no pending media
    // means we have fully caught up — no need to go further back
    if (newOnPage === 0 && mediaOnPage === 0 && page.length === 100) {
      stats.stoppedReason = "caught-up";
      break;
    }

    if (page.length < 100) {
      stats.stoppedReason = "exhausted";
      break;
    }

    before = oldest.id;
    await sleep(PAGE_DELAY_MS);
  }

  return stats;
}

/** Returns the numerically smallest (oldest) Discord snowflake from the index. */
function oldestStoredId(messages: Record<string, string>): string | undefined {
  const ids = Object.keys(messages);
  if (ids.length === 0) return undefined;
  return ids.sort()[0];
}
