import http from "node:http";
import express from "express";
import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readIndex, loadMessage } from "./storage.js";
import type { ScrapedMessage } from "./types.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);
const ROOT = process.cwd();

// ── Static files ──────────────────────────────────────────────────────────────

app.use("/assets", express.static(join(ROOT, "assets")));

// ── API ───────────────────────────────────────────────────────────────────────

app.get("/api/channels", (_req, res) => {
  const dataDir = join(ROOT, "data");
  if (!existsSync(dataDir)) {
    res.json([]);
    return;
  }

  const channels = readdirSync(dataDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => {
      const index = readIndex(d.name);
      return {
        id: d.name,
        name: index.channelName ?? d.name,
        parentChannelId: index.parentChannelId ?? null,
        messageCount: index.messageCount,
        lastScrapedAt: index.lastScrapedAt,
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  res.json(channels);
});

app.get("/api/channels/:id/messages", (req, res) => {
  const { id } = req.params;
  const before = req.query.before as string | undefined;
  const limit = Math.min(Number(req.query.limit ?? 50), 100);

  const index = readIndex(id);

  // All Discord IDs in chronological order (snowflakes sort lexicographically)
  let allIds = Object.keys(index.messages).sort();

  if (before) {
    allIds = allIds.filter((did) => did < before);
  }

  const hasMore = allIds.length > limit;
  const pageIds = allIds.slice(-limit); // most-recent `limit` of the filtered set

  const messages = pageIds
    .map((did) => loadMessage(id, index.messages[did]))
    .filter((m): m is ScrapedMessage => m !== null);

  res.json({
    messages,
    hasMore,
    oldestId: pageIds[0] ?? null,
  });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────

const distDir = join(ROOT, "viewer", "dist");

if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/{*splat}", (_req, res) => res.sendFile(join(distDir, "index.html")));
} else {
  app.get("/", (_req, res) =>
    res.send("Run <code>npm run build:viewer</code> first, then restart the server."),
  );
}

http.createServer(app).listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
