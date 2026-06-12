import type { DiscordChannel, DiscordMessage } from "./types.js";

const BASE = "https://discord.com/api/v10";

// ── Authenticated fetch with automatic 429 retry ──────────────────────────────

async function discordFetch(path: string, token: string): Promise<unknown> {
  const url = `${BASE}${path}`;

  while (true) {
    const res = await fetch(url, {
      headers: { Authorization: token },
    });

    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") ?? "5");
      console.warn(`  [rate-limit] waiting ${retryAfter}s…`);
      await sleep(retryAfter * 1000);
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Discord API ${res.status} on ${path}: ${body}`);
    }

    return res.json();
  }
}

// ── Public API helpers ────────────────────────────────────────────────────────

/** Returns all channels in the guild, sorted by position. */
export async function listGuildChannels(
  guildId: string,
  token: string,
): Promise<DiscordChannel[]> {
  const channels = (await discordFetch(
    `/guilds/${guildId}/channels`,
    token,
  )) as DiscordChannel[];

  return channels.sort((a, b) => a.position - b.position);
}

/**
 * Fetches one page of up to 100 messages from a channel.
 * Pass `before` (a Discord snowflake ID) to paginate backwards in time.
 * Discord returns messages in reverse-chronological order (newest first).
 */
export async function fetchMessagePage(
  channelId: string,
  token: string,
  before?: string,
): Promise<DiscordMessage[]> {
  const qs = before
    ? `?limit=100&before=${before}`
    : "?limit=100";

  return (await discordFetch(
    `/channels/${channelId}/messages${qs}`,
    token,
  )) as DiscordMessage[];
}

// ── Thread discovery ──────────────────────────────────────────────────────────

interface ThreadsResponse {
  threads: DiscordChannel[];
  has_more: boolean;
}

/**
 * Returns all archived public threads for a channel, paginating until exhausted.
 * NOTE: Active (non-archived) threads must be discovered via type-18 messages
 * in the parent channel — the guild-level active-threads endpoint requires a bot token.
 * Returns an empty array if the endpoint returns 403 (no permission).
 */
export async function fetchArchivedThreads(
  channelId: string,
  token: string,
): Promise<DiscordChannel[]> {
  const all: DiscordChannel[] = [];
  let before: string | undefined;

  while (true) {
    const qs = before ? `?limit=100&before=${before}` : "?limit=100";
    const url = `${BASE}/channels/${channelId}/threads/archived/public${qs}`;

    const res = await fetch(url, { headers: { Authorization: token } });
    if (res.status === 403 || res.status === 404) break; // no access or no threads
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after") ?? "5");
      await sleep(retryAfter * 1000);
      continue;
    }
    if (!res.ok) break;

    const data = (await res.json()) as ThreadsResponse;
    all.push(...data.threads);

    if (!data.has_more || data.threads.length === 0) break;
    before = data.threads.at(-1)?.id;
    await sleep(500);
  }

  return all;
}

// ── Util ──────────────────────────────────────────────────────────────────────

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
