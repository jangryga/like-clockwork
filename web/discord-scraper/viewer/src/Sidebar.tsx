import type { Channel } from "./types";

interface Props {
  channels: Channel[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

interface ChannelButtonProps {
  channel: Channel;
  selectedId: string | null;
  onSelect: (id: string) => void;
  isThread?: boolean;
}

function ChannelButton({ channel, selectedId, onSelect, isThread = false }: ChannelButtonProps) {
  const isSelected = selectedId === channel.id;
  return (
    <button
      onClick={() => onSelect(channel.id)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm text-left transition-colors cursor-pointer ${
        isThread ? "pl-6" : ""
      } ${
        isSelected
          ? "bg-zinc-600/70 text-white"
          : "text-zinc-400 hover:bg-zinc-600/40 hover:text-zinc-200"
      }`}
    >
      {isThread ? (
        <svg
          className="shrink-0 text-zinc-500"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M0.5 0.5v4a2 2 0 002 2H11"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <span className="text-zinc-500 font-medium shrink-0">#</span>
      )}
      <span className="truncate flex-1">{channel.name}</span>
      <span className="text-[11px] text-zinc-500 shrink-0 tabular-nums">
        {formatCount(channel.messageCount)}
      </span>
    </button>
  );
}

export function Sidebar({ channels, selectedId, onSelect }: Props) {
  const parents = channels.filter((c) => !c.parentChannelId);
  const threadsByParent = channels
    .filter((c) => c.parentChannelId)
    .reduce<Record<string, Channel[]>>((acc, t) => {
      const pid = t.parentChannelId!;
      (acc[pid] ??= []).push(t);
      return acc;
    }, {});

  return (
    <div className="w-60 shrink-0 flex flex-col h-full bg-[#2B2D31]">
      {/* Header */}
      <div className="h-12 px-4 flex items-center shrink-0 border-b border-black/30 shadow-sm">
        <span className="font-bold text-white text-sm tracking-wide">Discord Archive</span>
      </div>

      {/* Channel list */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-2">
          Channels — {parents.length}
        </p>

        {parents.length === 0 && (
          <p className="text-zinc-500 text-xs px-2 py-4 text-center leading-relaxed">
            No channels found.
            <br />
            Run the scraper first.
          </p>
        )}

        {parents.map((ch) => (
          <div key={ch.id}>
            <ChannelButton channel={ch} selectedId={selectedId} onSelect={onSelect} />

            {/* Threads nested under this channel */}
            {(threadsByParent[ch.id] ?? []).map((thread) => (
              <ChannelButton
                key={thread.id}
                channel={thread}
                selectedId={selectedId}
                onSelect={onSelect}
                isThread
              />
            ))}
          </div>
        ))}

        {/* Orphaned threads (parent channel not scraped) */}
        {channels
          .filter((c) => c.parentChannelId && !parents.find((p) => p.id === c.parentChannelId))
          .map((thread) => (
            <ChannelButton
              key={thread.id}
              channel={thread}
              selectedId={selectedId}
              onSelect={onSelect}
              isThread
            />
          ))}
      </div>
    </div>
  );
}
