// ── Discord API shapes (subset of what the API returns) ──────────────────────

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
}

export interface DiscordAttachment {
  id: string;
  filename: string;
  size: number;
  url: string;
  proxy_url: string;
  content_type?: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbedMedia {
  url: string;
  proxy_url?: string;
  width?: number;
  height?: number;
}

export interface DiscordEmbed {
  type?: string;
  url?: string;
  title?: string;
  description?: string;
  timestamp?: string;
  color?: number;
  video?: DiscordEmbedMedia;
  thumbnail?: DiscordEmbedMedia;
  image?: DiscordEmbedMedia;
  /** Relative path to the locally downloaded GIF/video, set after download */
  localPath?: string;
}

export interface DiscordReaction {
  count: number;
  emoji: { id: string | null; name: string };
}

/** Raw message shape returned by GET /channels/{id}/messages */
export interface DiscordMessage {
  id: string;
  type?: number;
  channel_id: string;
  author: DiscordUser;
  content: string;
  timestamp: string;
  edited_timestamp: string | null;
  attachments: DiscordAttachment[];
  embeds: DiscordEmbed[];
  reactions?: DiscordReaction[];
  referenced_message?: DiscordMessage | null;
  /**
   * Present on type-18 (THREAD_CREATED) messages.
   * Contains the channel object for the thread that was just created.
   */
  thread?: DiscordChannel;
}

export interface DiscordChannel {
  id: string;
  name: string;
  type: number;
  position: number;
  parent_id: string | null;
}

// ── Internal / persisted shapes ───────────────────────────────────────────────

export interface ScrapedAttachment {
  discordId: string;
  filename: string;
  url: string;
  size: number;
  contentType?: string;
  width?: number;
  height?: number;
  /** Relative path to the locally downloaded file, set once the asset is persisted */
  localPath?: string;
}

/** The shape stored on disk for every message */
export interface ScrapedMessage {
  /** Internal SHA1-based GUID derived from the Discord message ID */
  guid: string;
  discordId: string;
  channelId: string;
  author: {
    id: string;
    username: string;
    globalName: string | null;
  };
  content: string;
  timestamp: string;
  editedTimestamp: string | null;
  attachments: ScrapedAttachment[];
  embeds: DiscordEmbed[];
  reactions: Array<{ emoji: string; count: number }>;
  replyToGuid: string | null;
  /**
   * Set when this message is a THREAD_CREATED (type 18) system message.
   * The ID here is the thread's channel ID — use it to navigate to the thread.
   */
  threadRef?: { id: string; name: string };
}

/**
 * Per-channel index stored at data/<channelId>/index.json.
 * Maps Discord message IDs to internal GUIDs for O(1) dedup checks
 * and lets us resume a scrape from the oldest stored message.
 */
export interface ChannelIndex {
  channelId: string;
  channelName?: string;
  /** Set for threads: the ID of the parent text channel */
  parentChannelId?: string;
  /** ISO-8601 timestamp of the last successful scrape */
  lastScrapedAt: string | null;
  messageCount: number;
  /** discordId → guid */
  messages: Record<string, string>;
}
