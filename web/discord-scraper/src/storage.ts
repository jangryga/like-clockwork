import { createHash } from "node:crypto";
import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type {
  ScrapedMessage,
  ChannelIndex,
  DiscordMessage,
  DiscordAttachment,
} from "./types.js";

const DATA_ROOT = join(process.cwd(), "data");

// ── GUID ─────────────────────────────────────────────────────────────────────

/**
 * Derives a deterministic 40-char hex GUID from a Discord message ID.
 * Using SHA1 (same length as a git object hash) keeps the asset folder
 * structure consistent: assets/<guid[0:2]>/<guid[2:]>/
 */
export function messageGuid(discordMessageId: string): string {
  return createHash("sha1").update(discordMessageId).digest("hex");
}

// ── Paths ─────────────────────────────────────────────────────────────────────

function channelDir(channelId: string): string {
  return join(DATA_ROOT, channelId);
}

function objectPath(channelId: string, guid: string): string {
  return join(channelDir(channelId), "objects", guid.slice(0, 2), `${guid.slice(2)}.json`);
}

function indexPath(channelId: string): string {
  return join(channelDir(channelId), "index.json");
}

// ── Index R/W ─────────────────────────────────────────────────────────────────

export function readIndex(channelId: string): ChannelIndex {
  const path = indexPath(channelId);
  if (!existsSync(path)) {
    return { channelId, lastScrapedAt: null, messageCount: 0, messages: {} };
  }
  return JSON.parse(readFileSync(path, "utf8")) as ChannelIndex;
}

export function writeIndex(index: ChannelIndex): void {
  const path = indexPath(index.channelId);
  mkdirSync(join(channelDir(index.channelId)), { recursive: true });
  writeFileSync(path, JSON.stringify(index, null, 2));
}

// ── Object store ──────────────────────────────────────────────────────────────

export function hasMessage(channelId: string, guid: string): boolean {
  return existsSync(objectPath(channelId, guid));
}

export function saveMessage(message: ScrapedMessage): void {
  const path = objectPath(message.channelId, message.guid);
  mkdirSync(join(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(message, null, 2));
}

export function loadMessage(channelId: string, guid: string): ScrapedMessage | null {
  const path = objectPath(channelId, guid);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf8")) as ScrapedMessage;
}

/**
 * Loads every stored message for a channel using the index as the manifest.
 * Skips any GUIDs whose object files are missing.
 */
export function loadAllMessages(channelId: string): ScrapedMessage[] {
  const index = readIndex(channelId);
  const messages: ScrapedMessage[] = [];
  for (const guid of Object.values(index.messages)) {
    const msg = loadMessage(channelId, guid);
    if (msg) messages.push(msg);
  }
  return messages;
}

// ── Conversion ────────────────────────────────────────────────────────────────

function mapAttachment(a: DiscordAttachment) {
  return {
    discordId: a.id,
    filename: a.filename,
    url: a.url,
    size: a.size,
    contentType: a.content_type,
    width: a.width,
    height: a.height,
  };
}

/**
 * Converts a raw Discord API message into a ScrapedMessage and persists it.
 * If the message is already stored (dedup via index), the existing object is
 * loaded from disk and returned so the caller can check for un-downloaded media.
 *
 * Returns the message object alongside whether it was newly written.
 */
export function persistMessage(
  raw: DiscordMessage,
  index: ChannelIndex,
): { guid: string; isNew: boolean; message: ScrapedMessage } {
  const guid = messageGuid(raw.id);

  if (index.messages[raw.id]) {
    const existing = loadMessage(raw.channel_id, guid) ?? buildMessage(raw, guid);
    return { guid, isNew: false, message: existing };
  }

  const message = buildMessage(raw, guid);
  saveMessage(message);

  index.messages[raw.id] = guid;
  index.messageCount = Object.keys(index.messages).length;

  return { guid, isNew: true, message };
}

function buildMessage(raw: DiscordMessage, guid: string): ScrapedMessage {
  const replyDiscordId = raw.referenced_message?.id ?? null;
  return {
    guid,
    discordId: raw.id,
    channelId: raw.channel_id,
    author: {
      id: raw.author.id,
      username: raw.author.username,
      globalName: raw.author.global_name,
    },
    content: raw.content,
    timestamp: raw.timestamp,
    editedTimestamp: raw.edited_timestamp,
    attachments: raw.attachments.map(mapAttachment),
    embeds: raw.embeds,
    reactions: (raw.reactions ?? []).map((r) => ({
      emoji: r.emoji.name,
      count: r.count,
    })),
    replyToGuid: replyDiscordId ? messageGuid(replyDiscordId) : null,
    threadRef: raw.thread ? { id: raw.thread.id, name: raw.thread.name } : undefined,
  };
}
