import type { Message, MessageGroup } from "./types";

// ── Avatar colours ────────────────────────────────────────────────────────────

const BG_COLORS = [
  "bg-indigo-500",
  "bg-sky-500",
  "bg-teal-500",
  "bg-emerald-500",
  "bg-fuchsia-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-violet-500",
];

const TEXT_COLORS = [
  "text-indigo-300",
  "text-sky-300",
  "text-teal-300",
  "text-emerald-300",
  "text-fuchsia-300",
  "text-rose-300",
  "text-amber-300",
  "text-violet-300",
];

function djb2(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  return h;
}

export function avatarBg(userId: string): string {
  return BG_COLORS[djb2(userId) % BG_COLORS.length]!;
}

export function authorColor(userId: string): string {
  return TEXT_COLORS[djb2(userId) % TEXT_COLORS.length]!;
}

export function avatarLetter(author: Message["author"]): string {
  return (author.globalName ?? author.username)[0]?.toUpperCase() ?? "?";
}

// ── Timestamps ────────────────────────────────────────────────────────────────

export function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffDays = Math.floor(
    (now.setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 86_400_000,
  );
  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 0) return `Today at ${time}`;
  if (diffDays === 1) return `Yesterday at ${time}`;
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    ` at ${time}`
  );
}

export function shortTime(ts: string): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ── Message grouping ──────────────────────────────────────────────────────────

const GROUP_THRESHOLD_MS = 5 * 60 * 1000;

export function groupMessages(messages: Message[]): MessageGroup[] {
  const groups: MessageGroup[] = [];
  let current: MessageGroup | null = null;

  for (const msg of messages) {
    const ts = new Date(msg.timestamp).getTime();
    const lastTs = current ? new Date(current.messages.at(-1)!.timestamp).getTime() : 0;
    const sameAuthor = current?.author.id === msg.author.id;

    if (current && sameAuthor && ts - lastTs < GROUP_THRESHOLD_MS) {
      current.messages.push(msg);
    } else {
      current = {
        key: msg.guid,
        author: msg.author,
        firstTimestamp: msg.timestamp,
        messages: [msg],
      };
      groups.push(current);
    }
  }

  return groups;
}

// ── Attachment helpers ────────────────────────────────────────────────────────

export function isImage(filename: string, contentType?: string): boolean {
  if (contentType?.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(filename);
}

export function isVideo(filename: string, contentType?: string): boolean {
  if (contentType?.startsWith("video/")) return true;
  return /\.(mp4|webm|mov|mkv)$/i.test(filename);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
