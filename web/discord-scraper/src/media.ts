import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import type { DiscordEmbed, ScrapedAttachment, ScrapedMessage } from "./types.js";

const ASSETS_ROOT = join(process.cwd(), "assets");

/**
 * Hostnames we treat as Discord-owned CDN and therefore download from.
 * Deliberately excludes images-ext-*.discordapp.net, which is Discord's
 * reverse-proxy for external images (YouTube thumbnails, etc.).
 */
const DISCORD_CDN_HOSTS = new Set([
  "cdn.discordapp.com",
  "media.discordapp.net",
]);

export function isDiscordCdnUrl(url: string): boolean {
  try {
    return DISCORD_CDN_HOSTS.has(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Discord CDN signed URLs carry an `ex` query param: a Unix timestamp in hex
 * indicating when the URL expires (e.g. ?ex=6a03cff0&is=…&hm=…).
 * Returns true if the URL has already expired, false if still valid or has no expiry.
 */
export function isUrlExpired(url: string): boolean {
  try {
    const ex = new URL(url).searchParams.get("ex");
    if (!ex) return false;
    const expiresAt = parseInt(ex, 16) * 1000; // convert to ms
    return Date.now() > expiresAt;
  } catch {
    return false;
  }
}

// ── Paths ─────────────────────────────────────────────────────────────────────

/** Absolute path to the asset directory for a message. */
export function assetDir(messageGuid: string): string {
  return join(ASSETS_ROOT, messageGuid.slice(0, 2), messageGuid.slice(2));
}

/** Workspace-relative path stored in localPath fields. */
function localPath(messageGuid: string, filename: string): string {
  return join("assets", messageGuid.slice(0, 2), messageGuid.slice(2), filename);
}

// ── Download ──────────────────────────────────────────────────────────────────

// ── GIF embeds ────────────────────────────────────────────────────────────────

/**
 * Downloads media for embeds that reference expiring Discord CDN URLs:
 *   - `gifv`  → video file from Tenor/Giphy (stable URL, no expiry)
 *   - `image` → thumbnail from Discord CDN (freshened by API on each fetch)
 *
 * Returns the updated embed list and count of newly downloaded files.
 */
export async function downloadEmbeds(
  message: ScrapedMessage,
): Promise<{ embeds: DiscordEmbed[]; downloaded: number }> {
  const relevant = message.embeds.filter(
    (e) => (e.type === "gifv" && e.video?.url) || (e.type === "image" && e.thumbnail?.url),
  );
  if (relevant.length === 0) return { embeds: message.embeds, downloaded: 0 };

  let downloaded = 0;

  const embeds = await Promise.all(
    message.embeds.map(async (embed): Promise<DiscordEmbed> => {
      if (embed.type === "gifv" && embed.video?.url) {
        return downloadGifvEmbed(embed, message.guid, () => downloaded++);
      }
      if (embed.type === "image" && embed.thumbnail?.url) {
        return downloadImageEmbed(embed, message.guid, () => downloaded++);
      }
      return embed;
    }),
  );

  return { embeds, downloaded };
}

async function downloadGifvEmbed(
  embed: DiscordEmbed,
  guid: string,
  onDownloaded: () => void,
): Promise<DiscordEmbed> {
  const sourceUrl = embed.video!.url;
  const filename = mediaFilename(sourceUrl, "gif.mp4");
  const dest = join(assetDir(guid), filename);
  const lp = localPath(guid, filename);

  if (embed.localPath && existsSync(dest)) return embed;

  if (isUrlExpired(sourceUrl)) {
    console.warn(`  [media] expired  ${filename} (${guid.slice(0, 8)}…) — re-scrape to refresh`);
    return embed;
  }

  return fetchAndSave(sourceUrl, dest, lp, embed, guid, filename, onDownloaded);
}

async function downloadImageEmbed(
  embed: DiscordEmbed,
  guid: string,
  onDownloaded: () => void,
): Promise<DiscordEmbed> {
  // Use thumbnail.url — Discord freshens this on every API call.
  // embed.url is the original user-pasted URL and keeps its original expiry.
  const sourceUrl = embed.thumbnail!.url;

  if (!isDiscordCdnUrl(sourceUrl)) return embed;

  const filename = mediaFilename(sourceUrl, "image.png");
  const dest = join(assetDir(guid), filename);
  const lp = localPath(guid, filename);

  if (embed.localPath && existsSync(dest)) return embed;

  if (isUrlExpired(sourceUrl)) {
    console.warn(`  [media] expired  ${filename} (${guid.slice(0, 8)}…) — re-scrape to refresh`);
    return embed;
  }

  return fetchAndSave(sourceUrl, dest, lp, embed, guid, filename, onDownloaded);
}

async function fetchAndSave(
  url: string,
  dest: string,
  lp: string,
  embed: DiscordEmbed,
  guid: string,
  filename: string,
  onDownloaded: () => void,
): Promise<DiscordEmbed> {
  try {
    if (!existsSync(dest)) {
      mkdirSync(assetDir(guid), { recursive: true });
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = await res.arrayBuffer();
      writeFileSync(dest, Buffer.from(buf));
    }
    onDownloaded();
    return { ...embed, localPath: lp };
  } catch (err) {
    console.warn(
      `  [media] failed   ${filename} (${guid.slice(0, 8)}…): ${(err as Error).message}`,
    );
    return embed;
  }
}

function mediaFilename(url: string, fallback: string): string {
  try {
    const name = basename(new URL(url).pathname);
    return name.length > 0 ? name : fallback;
  } catch {
    return fallback;
  }
}

// ── Attachments ───────────────────────────────────────────────────────────────

/**
 * Downloads all Discord CDN attachments for a message that haven't been
 * persisted yet. Returns the updated attachment list (with localPath set on
 * newly downloaded files) and the count of files downloaded this call.
 *
 * Safe to call multiple times — already-downloaded files are skipped.
 */
export async function downloadAttachments(
  message: ScrapedMessage,
): Promise<{ attachments: ScrapedAttachment[]; downloaded: number }> {
  if (message.attachments.length === 0) {
    return { attachments: message.attachments, downloaded: 0 };
  }

  let downloaded = 0;

  const attachments = await Promise.all(
    message.attachments.map(async (att): Promise<ScrapedAttachment> => {
      const dest = join(assetDir(message.guid), att.filename);

      // Already on disk — nothing to do
      if (att.localPath && existsSync(dest)) return att;

      // Not a Discord CDN URL — skip (external embeds, YouTube, etc.)
      if (!isDiscordCdnUrl(att.url)) return att;

      if (isUrlExpired(att.url)) {
        console.warn(`  [media] expired  ${att.filename} (${message.guid.slice(0, 8)}…) — re-scrape to refresh the URL`);
        return att;
      }

      try {
        if (!existsSync(dest)) {
          mkdirSync(assetDir(message.guid), { recursive: true });

          const res = await fetch(att.url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);

          const buf = await res.arrayBuffer();
          writeFileSync(dest, Buffer.from(buf));
        }

        downloaded++;
        return { ...att, localPath: localPath(message.guid, att.filename) };
      } catch (err) {
        console.warn(
          `  [media] failed ${att.filename} (${message.guid.slice(0, 8)}…): ${(err as Error).message}`,
        );
        return att;
      }
    }),
  );

  return { attachments, downloaded };
}
