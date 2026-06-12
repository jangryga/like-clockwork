import { useEffect, useState } from "react";
import { fetchChannels } from "./api";
import { Sidebar } from "./Sidebar";
import { MessageFeed } from "./MessageFeed";
import type { Channel } from "./types";

interface OpenThread {
  id: string;
  name: string;
  startedBy: string;
}

export function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openThread, setOpenThread] = useState<OpenThread | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChannels()
      .then((data) => {
        setChannels(data);
        if (data.length > 0 && data[0]) setSelectedId(data[0].id);
      })
      .catch((err: unknown) => {
        setError(
          err instanceof Error ? err.message : "Failed to load channels",
        );
      });
  }, []);

  const selectedChannel = channels.find((c) => c.id === selectedId) ?? null;

  // When the main channel changes, close any open thread panel
  const handleSelectChannel = (id: string) => {
    setSelectedId(id);
    setOpenThread(null);
  };

  const handleOpenThread = (id: string, name: string, startedBy: string) => {
    setOpenThread({ id, name, startedBy });
  };

  const threadChannel = openThread
    ? (channels.find((c) => c.id === openThread.id) ?? null)
    : null;

  return (
    <div className="flex h-full bg-[#313338] text-[#DCDDDE]">
      <Sidebar
        channels={channels}
        selectedId={selectedId}
        onSelect={handleSelectChannel}
      />

      <main className="flex-1 flex min-w-0 overflow-hidden">
        {error && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-red-400 text-sm mb-2">⚠ {error}</p>
              <p className="text-zinc-500 text-xs">
                Make sure the API server is running on port 3001.
              </p>
            </div>
          </div>
        )}

        {!error && !selectedChannel && (
          <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
            {channels.length === 0 ? "Loading…" : "Select a channel"}
          </div>
        )}

        {!error && selectedChannel && (
          <>
            {/* Main channel feed */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <MessageFeed
                key={selectedChannel.id}
                channel={selectedChannel}
                channels={channels}
                onOpenThread={handleOpenThread}
              />
            </div>

            {/* Thread panel — slides in on the right */}
            {openThread && (
              <div className="w-[50%] shrink-0 border-l border-black/40 overflow-hidden flex flex-col">
                <MessageFeed
                  key={openThread.id}
                  channel={
                    threadChannel ?? {
                      id: openThread.id,
                      name: openThread.name,
                      parentChannelId: selectedChannel.id,
                      messageCount: 0,
                      lastScrapedAt: null,
                    }
                  }
                  channels={channels}
                  isThreadPanel
                  startedBy={openThread.startedBy}
                  onClose={() => setOpenThread(null)}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
