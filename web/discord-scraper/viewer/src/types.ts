export interface Channel {
  id: string;
  name: string;
  parentChannelId: string | null;
  messageCount: number;
  lastScrapedAt: string | null;
}

export interface Attachment {
  discordId: string;
  filename: string;
  url: string;
  size: number;
  contentType?: string;
  width?: number;
  height?: number;
  localPath?: string;
}

export interface EmbedMedia {
  url: string;
  proxy_url?: string;
  width?: number;
  height?: number;
}

export interface Embed {
  type?: string;
  url?: string;
  title?: string;
  description?: string;
  video?: EmbedMedia;
  thumbnail?: EmbedMedia;
  image?: EmbedMedia;
  localPath?: string;
}

export interface Message {
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
  attachments: Attachment[];
  embeds: Embed[];
  reactions: Array<{ emoji: string; count: number }>;
  replyToGuid: string | null;
  /** Present when this message is a THREAD_CREATED system message. */
  threadRef?: { id: string; name: string };
}

export interface MessagesResponse {
  messages: Message[];
  hasMore: boolean;
  oldestId: string | null;
}

export interface MessageGroup {
  key: string;
  author: Message["author"];
  firstTimestamp: string;
  messages: Message[];
}
