/**
 * publish-instagram-queue.ts
 *
 * Publishes due items from instagram-release/QUEUE.json via Instagram Graph API.
 * SAFE DEFAULT: --dry-run (prints what would post, posts nothing).
 *
 * Requirements:
 *  - INSTAGRAM_BUSINESS_ACCOUNT_ID
 *  - META_PAGE_ACCESS_TOKEN (long-lived, instagram_content_publish)
 *  - PUBLIC_AD_VIDEO_BASE_URL where `{slug}.mp4` is publicly downloadable
 *    (Meta cannot pull files from your local disk)
 *
 * Usage:
 *   npm run ig:publish -- --dry-run
 *   npm run ig:publish -- --limit 1
 *   npm run ig:publish                 # posts due items only, respects gap
 */
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv();

type QueueItem = {
  day: number;
  slot: number;
  scheduledLocal: string;
  /** Unique queue id (used for posted-slugs dedupe). */
  slug: string;
  title: string;
  videoPath: string;
  /** Optional: public MP4 filename without .mp4. Defaults to basename(videoPath) or slug. */
  videoSlug?: string;
  caption: string;
  instagramUrl: string;
  status: "queued" | "posted" | "skipped" | "failed" | "cancelled";
  containerId?: string;
  mediaId?: string;
  error?: string;
};

type QueueFile = {
  items: QueueItem[];
  rules: { minGapMinutes: number; maxPerDay: number };
};

const ROOT = __dirname;
const OUT_DIR = path.join(ROOT, "instagram-release");
const QUEUE_FILE = path.join(OUT_DIR, "QUEUE.json");
const STATE_FILE = path.join(OUT_DIR, "posted-slugs.json");

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { dryRun: args.includes("--dry-run"), limit: 1, forceDue: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit") opts.limit = parseInt(args[++i], 10);
    if (args[i] === "--force-due") opts.forceDue = true;
  }
  return opts;
}

function loadPosted(): Set<string> {
  if (!fs.existsSync(STATE_FILE)) return new Set();
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as string[]);
  } catch {
    return new Set();
  }
}

function savePosted(set: Set<string>) {
  fs.writeFileSync(STATE_FILE, JSON.stringify([...set].sort(), null, 2));
}

async function igFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `IG API ${res.status}: ${typeof data === "object" ? JSON.stringify(data) : String(data)}`,
    );
  }
  return data as Record<string, unknown>;
}

async function createReelContainer(opts: {
  igUserId: string;
  token: string;
  videoUrl: string;
  caption: string;
}) {
  const body = new URLSearchParams({
    media_type: "REELS",
    video_url: opts.videoUrl,
    caption: opts.caption.slice(0, 2200),
    share_to_feed: "true",
    access_token: opts.token,
  });
  return igFetch(`https://graph.facebook.com/v21.0/${opts.igUserId}/media`, {
    method: "POST",
    body,
  });
}

async function waitForContainer(opts: {
  containerId: string;
  token: string;
  attempts?: number;
}) {
  const attempts = opts.attempts ?? 30;
  for (let i = 0; i < attempts; i++) {
    const status = await igFetch(
      `https://graph.facebook.com/v21.0/${opts.containerId}?fields=status_code,status&access_token=${opts.token}`,
    );
    const code = String(status.status_code || "");
    if (code === "FINISHED") return;
    if (code === "ERROR") {
      throw new Error(`Container failed: ${JSON.stringify(status)}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("Timed out waiting for IG media container");
}

async function publishContainer(opts: {
  igUserId: string;
  token: string;
  containerId: string;
}) {
  const body = new URLSearchParams({
    creation_id: opts.containerId,
    access_token: opts.token,
  });
  return igFetch(`https://graph.facebook.com/v21.0/${opts.igUserId}/media_publish`, {
    method: "POST",
    body,
  });
}

async function main() {
  const args = parseArgs();
  if (!fs.existsSync(QUEUE_FILE)) {
    throw new Error("No QUEUE.json — run npm run ig:queue first");
  }

  const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "";
  const token = process.env.META_PAGE_ACCESS_TOKEN || "";
  const publicBase = (process.env.PUBLIC_AD_VIDEO_BASE_URL || "").replace(/\/$/, "");

  const queue = JSON.parse(fs.readFileSync(QUEUE_FILE, "utf-8")) as QueueFile;
  const posted = loadPosted();
  const now = Date.now();
  const gapMs = (queue.rules?.minGapMinutes || 120) * 60 * 1000;

  // Heal drift: if a slug was posted outside the queue (or status was reset),
  // keep QUEUE + posted-slugs aligned so --force-due / retries cannot re-post.
  let healed = 0;
  for (const item of queue.items) {
    const alreadyPosted =
      posted.has(item.slug) ||
      item.status === "posted" ||
      Boolean(item.mediaId);
    if (!alreadyPosted) continue;
    if (!posted.has(item.slug)) {
      posted.add(item.slug);
      healed++;
    }
    if (item.status !== "posted") {
      item.status = "posted";
      healed++;
    }
  }
  if (healed > 0) {
    savePosted(posted);
    fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    console.log(`Healed ${healed} already-posted slug sync(s) before selecting due items.`);
  }

  const due = queue.items.filter((item) => {
    // Never re-post a slug that is already in posted-slugs, marked posted,
    // or already has a mediaId — even with --force-due.
    if (item.status === "posted" || posted.has(item.slug) || item.mediaId) {
      return false;
    }
    if (args.forceDue) return true;
    return new Date(item.scheduledLocal).getTime() <= now;
  });

  console.log(`Due posts: ${due.length}. Dry-run: ${args.dryRun}`);

  if (!args.dryRun) {
    if (!igUserId || !token) {
      throw new Error(
        "Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or META_PAGE_ACCESS_TOKEN in .env",
      );
    }
    if (!publicBase) {
      throw new Error(
        "Missing PUBLIC_AD_VIDEO_BASE_URL — Meta must fetch MP4s from a public HTTPS URL",
      );
    }
  }

  let published = 0;
  let lastPostAt = 0;

  for (const item of due) {
    if (published >= args.limit) break;
    if (lastPostAt && Date.now() - lastPostAt < gapMs) {
      console.log(`Gap not satisfied yet for ${item.slug} — stop this run (anti-spam).`);
      break;
    }

    const fileSlug =
      item.videoSlug ||
      (item.videoPath
        ? path.basename(item.videoPath, path.extname(item.videoPath))
        : item.slug);
    const videoUrl = `${publicBase}/${fileSlug}.mp4`;
    console.log(
      `\n[${published + 1}] ${item.slug}\n  when: ${item.scheduledLocal}\n  video: ${videoUrl}`,
    );

    if (args.dryRun) {
      console.log("  DRY-RUN caption preview:\n" + item.caption.slice(0, 180) + "...");
      published++;
      continue;
    }

    try {
      const created = await createReelContainer({
        igUserId,
        token,
        videoUrl,
        caption: item.caption,
      });
      const containerId = String(created.id);
      item.containerId = containerId;
      await waitForContainer({ containerId, token });
      const publishedRes = await publishContainer({
        igUserId,
        token,
        containerId,
      });
      item.mediaId = String(publishedRes.id);
      item.status = "posted";
      posted.add(item.slug);
      savePosted(posted);
      lastPostAt = Date.now();
      published++;
      console.log(`  POSTED media_id=${item.mediaId}`);
    } catch (err) {
      item.status = "failed";
      item.error = err instanceof Error ? err.message : String(err);
      console.error(`  FAIL ${item.slug}:`, item.error);
      // Stop on first failure so we don't spam-retry into a ban.
      break;
    }
  }

  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
  console.log(`\nDone. Handled ${published} item(s).`);
}

main().catch((err) => {
  console.error("FATAL:", err.message || err);
  process.exit(1);
});
