import { useEffect, useRef, useState, useLayoutEffect } from "react";
import { fetchMessages } from "./api";
import { groupMessages } from "./utils";
import { MessageGroup, ThreadPanelIntro } from "./Message";
import type { Channel, Message } from "./types";

interface Props {
  channel: Channel;
  /** All channels — passed to MessageGroup for thread-card lookups */
  channels?: Channel[];
  onOpenThread?: (id: string, name: string, startedBy: string) => void;
  /** Render as a side thread panel instead of the main channel feed */
  isThreadPanel?: boolean;
  startedBy?: string;
  onClose?: () => void;
}

export function MessageFeed({
  channel,
  channels,
  onOpenThread,
  isThreadPanel = false,
  startedBy,
  onClose,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [oldestId, setOldestId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevScrollHeightRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    setMessages([]);
    setHasMore(false);
    setOldestId(null);
    setLoading(true);
    setError(null);

    fetchMessages(channel.id)
      .then((data) => {
        if (cancelled) return;
        setMessages(data.messages);
        setHasMore(data.hasMore);
        setOldestId(data.oldestId);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Unknown error");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [channel.id]);

  useLayoutEffect(() => {
    if (!loading && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [loading, channel.id]);

  useLayoutEffect(() => {
    if (loadingMore || !scrollRef.current) return;
    const el = scrollRef.current;
    const diff = el.scrollHeight - prevScrollHeightRef.current;
    if (diff > 0) el.scrollTop = diff;
  }, [loadingMore]);

  const loadOlder = async () => {
    if (!hasMore || loadingMore || !oldestId) return;
    setLoadingMore(true);

    if (scrollRef.current) {
      prevScrollHeightRef.current = scrollRef.current.scrollHeight;
    }

    try {
      const data = await fetchMessages(channel.id, oldestId);
      setMessages((prev) => [...data.messages, ...prev]);
      setHasMore(data.hasMore);
      setOldestId(data.oldestId);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  const groups = groupMessages(messages);

  return (
    <div className="flex flex-col h-full bg-[#313338]">
      {/* Header */}
      {isThreadPanel ? (
        <div className="h-12 px-4 flex items-center gap-2 shrink-0 border-b border-black/30 shadow-sm">
          <svg
            className="text-zinc-400 shrink-0 w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10H2l2.929-2.929A9.969 9.969 0 0 1 2 12zm4.828 8H12a8 8 0 1 0-8-8 7.972 7.972 0 0 0 2.172 5.517L4.829 20zM7 9h10v2H7V9zm0 4h7v2H7v-2z" />
          </svg>
          <span className="font-semibold text-white text-sm flex-1 min-w-0 truncate">
            {channel.name}
          </span>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-zinc-400 hover:text-zinc-200 w-7 h-7 flex items-center justify-center rounded hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close thread"
            >
              ✕
            </button>
          )}
        </div>
      ) : (
        <div className="h-12 px-4 flex items-center gap-2 shrink-0 border-b border-black/30 shadow-sm">
          {channel.parentChannelId ? (
            <svg
              className="text-zinc-400 shrink-0"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M1 1v5a3 3 0 003 3h11"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <span className="text-zinc-400 font-medium">#</span>
          )}
          <span className="font-semibold text-white">{channel.name}</span>
          {channel.parentChannelId && (
            <span className="text-[11px] text-zinc-500 bg-zinc-700/50 px-1.5 py-0.5 rounded">
              thread
            </span>
          )}
          <span className="text-zinc-500 text-sm ml-2">
            {channel.messageCount.toLocaleString()} messages
          </span>
        </div>
      )}

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {hasMore && !loading && (
          <div className="flex justify-center py-4">
            <button
              onClick={loadOlder}
              disabled={loadingMore}
              className="text-xs text-zinc-400 hover:text-zinc-200 bg-zinc-700/50 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-default"
            >
              {loadingMore ? "Loading…" : "Load older messages"}
            </button>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center h-32">
            <div className="text-zinc-500 text-sm animate-pulse">
              Loading messages…
            </div>
          </div>
        )}

        {error && (
          <div className="p-8 text-center text-red-400 text-sm">{error}</div>
        )}

        {/* Thread panel: intro section above messages */}
        {isThreadPanel && !loading && !hasMore && (
          <ThreadPanelIntro name={channel.name} startedBy={startedBy} />
        )}

        {!loading && groups.length === 0 && (
          <div className="p-8 text-center text-zinc-500 text-sm">
            {isThreadPanel
              ? "No messages in this thread."
              : "No messages in this channel."}
          </div>
        )}

        {!loading &&
          groups.map((group) => (
            <MessageGroup
              key={group.key}
              author={group.author}
              firstTimestamp={group.firstTimestamp}
              messages={group.messages}
              channels={channels}
              onOpenThread={onOpenThread}
            />
          ))}

        <div className="h-4" />
      </div>
    </div>
  );
}
