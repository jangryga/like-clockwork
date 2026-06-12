import type { Channel, MessagesResponse } from "./types";

export async function fetchChannels(): Promise<Channel[]> {
  const res = await fetch("/api/channels");
  if (!res.ok) throw new Error(`Failed to fetch channels: ${res.status}`);
  return res.json() as Promise<Channel[]>;
}

export async function fetchMessages(
  channelId: string,
  before?: string,
  limit = 50,
): Promise<MessagesResponse> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (before) params.set("before", before);
  const res = await fetch(`/api/channels/${channelId}/messages?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch messages: ${res.status}`);
  return res.json() as Promise<MessagesResponse>;
}

/** Returns a URL for a locally stored asset given its localPath (e.g. "assets/ab/cd…/file.jpg"). */
export function assetUrl(localPath: string): string {
  return "/" + localPath.replace(/\\/g, "/");
}
