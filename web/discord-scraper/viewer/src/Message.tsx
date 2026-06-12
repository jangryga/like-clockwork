import { useState } from "react";
import type { Message, Attachment, Embed, Channel } from "./types";
import { assetUrl } from "./api";
import {
  avatarBg,
  avatarLetter,
  authorColor,
  formatTimestamp,
  shortTime,
  isImage,
  isVideo,
  formatSize,
} from "./utils";

// ── Icons ─────────────────────────────────────────────────────────────────────

function ThreadIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* Speech bubble with lines — thread icon */}
      <path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10H2l2.929-2.929A9.969 9.969 0 0 1 2 12zm4.828 8H12a8 8 0 1 0-8-8 7.972 7.972 0 0 0 2.172 5.517L4.829 20zM7 9h10v2H7V9zm0 4h7v2H7v-2z" />
    </svg>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────

interface LightboxProps {
  src: string;
  alt: string;
  onClose: () => void;
}

function Lightbox({ src, alt, onClose }: LightboxProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl leading-none"
      >
        ✕
      </button>
    </div>
  );
}

// ── Attachment ────────────────────────────────────────────────────────────────

interface AttachmentItemProps {
  att: Attachment;
  onLightbox: (src: string, alt: string) => void;
}

function AttachmentItem({ att, onLightbox }: AttachmentItemProps) {
  const src = att.localPath ? assetUrl(att.localPath) : att.url;

  if (isImage(att.filename, att.contentType)) {
    return (
      <div className="mt-2 inline-block max-w-sm">
        <img
          src={src}
          alt={att.filename}
          loading="lazy"
          className="rounded-md max-h-72 max-w-full object-contain cursor-zoom-in hover:brightness-90 transition-[filter]"
          style={{ maxWidth: att.width ? Math.min(att.width, 400) : 400 }}
          onClick={() => onLightbox(src, att.filename)}
        />
      </div>
    );
  }

  if (isVideo(att.filename, att.contentType)) {
    return (
      <div className="mt-2">
        <video
          src={src}
          controls
          className="rounded-md max-h-72 max-w-sm bg-black"
        />
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noreferrer"
      className="mt-2 flex items-center gap-2 bg-[#2B2D31] hover:bg-zinc-600/60 border border-white/5 rounded-md px-3 py-2 text-sm text-zinc-300 transition-colors w-fit"
    >
      <span className="text-lg">📄</span>
      <span className="truncate max-w-xs">{att.filename}</span>
      <span className="text-zinc-500 text-xs shrink-0">
        {formatSize(att.size)}
      </span>
    </a>
  );
}

// ── Embeds ────────────────────────────────────────────────────────────────────

function GifEmbed({ embed }: { embed: Embed }) {
  const src = embed.localPath ? assetUrl(embed.localPath) : embed.video?.url;
  if (!src) return null;
  return (
    <div className="mt-2">
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="rounded-md max-h-72 max-w-sm"
      />
    </div>
  );
}

function ImageEmbed({
  embed,
  onLightbox,
}: {
  embed: Embed;
  onLightbox: (src: string, alt: string) => void;
}) {
  const src = embed.localPath
    ? assetUrl(embed.localPath)
    : (embed.thumbnail?.url ?? embed.url);
  if (!src) return null;
  const alt = embed.title ?? "image";
  return (
    <div className="mt-2 inline-block max-w-sm">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="rounded-md max-h-72 max-w-full object-contain cursor-zoom-in hover:brightness-90 transition-[filter]"
        onClick={() => onLightbox(src, alt)}
      />
    </div>
  );
}

// ── Thread card ───────────────────────────────────────────────────────────────

function ThreadCard({
  threadRef,
  channel,
  onClick,
}: {
  threadRef: { id: string; name: string };
  channel?: Channel;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="mt-2 flex items-center gap-3 bg-[#2B2D31] hover:bg-[#35373C] border border-white/5 rounded-lg p-3 w-full max-w-sm text-left transition-colors group/thread"
    >
      <div className="w-8 h-8 rounded-full bg-[#404249] flex items-center justify-center shrink-0">
        <ThreadIcon className="w-4 h-4 text-zinc-300" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white group-hover/thread:underline truncate">
          {threadRef.name}
        </div>
        {channel && (
          <div className="text-xs text-zinc-400 mt-0.5">
            {channel.messageCount.toLocaleString()} message
            {channel.messageCount !== 1 ? "s" : ""}
          </div>
        )}
      </div>
      {/* Chevron */}
      <svg
        className="text-zinc-500 shrink-0 w-4 h-4"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
      </svg>
    </button>
  );
}

// ── MessageGroup ──────────────────────────────────────────────────────────────

interface MessageGroupProps {
  author: Message["author"];
  firstTimestamp: string;
  messages: Message[];
  channels?: Channel[];
  onOpenThread?: (id: string, name: string, startedBy: string) => void;
}

export function MessageGroup({
  author,
  firstTimestamp,
  messages,
  channels,
  onOpenThread,
}: MessageGroupProps) {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  );

  return (
    <div className="flex gap-3 px-4 pt-4 hover:bg-white/2 rounded group">
      {/* Avatar */}
      <div className="shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarBg(author.id)}`}
        >
          {avatarLetter(author)}
        </div>
      </div>

      {/* Content column */}
      <div className="flex-1 min-w-0">
        {/* Author header */}
        <div className="flex items-baseline gap-2 mb-0.5">
          <span className={`font-medium text-sm ${authorColor(author.id)}`}>
            {author.globalName ?? author.username}
          </span>
          <span className="text-[11px] text-zinc-500">
            {formatTimestamp(firstTimestamp)}
          </span>
        </div>

        {/* All messages in this group */}
        {messages.map((msg, i) => {
          let content = msg.content;
          for (const embed of msg.embeds) {
            if (embed.url === msg.content) {
              content = "";
            }
          }
          return (
            <div
              key={msg.guid}
              className={`relative ${i > 0 ? "mt-0.5 group/line" : ""}`}
            >
              {/* Hover timestamp for non-first messages */}
              {i > 0 && (
                <span className="absolute -left-12 top-0.5 text-[10px] text-zinc-600 opacity-0 group-hover/line:opacity-100 w-10 text-right select-none">
                  {shortTime(msg.timestamp)}
                </span>
              )}

              {content && (
                <p className="text-[#DCDDDE] text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {content}
                </p>
              )}

              {msg.editedTimestamp && (
                <span className="text-[10px] text-zinc-600 ml-1">(edited)</span>
              )}

              {/* Attachments */}
              {msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {msg.attachments.map((att) => (
                    <AttachmentItem
                      key={att.discordId}
                      att={att}
                      onLightbox={(src, alt) => setLightbox({ src, alt })}
                    />
                  ))}
                </div>
              )}

              {/* GIF and image embeds */}
              {msg.embeds
                .filter((e) => e.type === "gifv" || e.type === "image")
                .map((e, ei) =>
                  e.type === "gifv" ? (
                    <GifEmbed key={ei} embed={e} />
                  ) : (
                    <ImageEmbed
                      key={ei}
                      embed={e}
                      onLightbox={(src, alt) => setLightbox({ src, alt })}
                    />
                  ),
                )}

              {/* Other embeds (links, articles) */}
              {msg.embeds
                .filter(
                  (e) =>
                    e.type !== "gifv" &&
                    e.type !== "image" &&
                    (e.title || e.description),
                )
                .map((e, ei) => (
                  <div
                    key={ei}
                    className="mt-2 border-l-4 border-zinc-600 pl-3 py-1 max-w-sm"
                  >
                    {e.title && (
                      <a
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-sky-400 hover:underline line-clamp-2"
                      >
                        {e.title}
                      </a>
                    )}
                    {e.description && (
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-3">
                        {e.description}
                      </p>
                    )}
                  </div>
                ))}

              {/* Thread card */}
              {msg.threadRef && onOpenThread && (
                <ThreadCard
                  threadRef={msg.threadRef}
                  channel={channels?.find((c) => c.id === msg.threadRef!.id)}
                  onClick={() =>
                    onOpenThread(
                      msg.threadRef!.id,
                      msg.threadRef!.name,
                      author.globalName ?? author.username,
                    )
                  }
                />
              )}

              {/* Reactions */}
              {msg.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {msg.reactions.map((r, ri) => (
                    <span
                      key={ri}
                      className="inline-flex items-center gap-1 bg-zinc-700/60 hover:bg-zinc-600/60 border border-white/5 px-2 py-0.5 rounded-md text-sm text-zinc-200 transition-colors"
                    >
                      {r.emoji}{" "}
                      <span className="text-xs text-zinc-400">{r.count}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

// ── ThreadPanelHeader ─────────────────────────────────────────────────────────

export function ThreadPanelIntro({
  name,
  startedBy,
}: {
  name: string;
  startedBy?: string;
}) {
  return (
    <div className="flex flex-col pt-10 pb-4 px-6">
      <div className="w-16 h-16 rounded-full bg-[#404249] flex items-center justify-center mb-4 shrink-0">
        <ThreadIcon className="w-8 h-8 text-zinc-200" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-1">{name}</h2>
      {startedBy && (
        <p className="text-sm text-zinc-400">
          Started by{" "}
          <span className="text-zinc-300 font-medium">{startedBy}</span>
        </p>
      )}
    </div>
  );
}
