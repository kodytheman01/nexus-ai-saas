/**
 * build-instagram-queue.ts
 *
 * Builds a spam-safe Instagram Reels release schedule from finished MP4s.
 * Prefers video-ads-premium/, then video-ads-output/.
 *
 * Cadence (anti-spam):
 *  - maxPostsPerDay (default 5)
 *  - minGapMinutes between posts (default 120)
 *  - unique Instagram UTM captions
 *  - never schedules incomplete .tmp.mp4 files
 *
 * Usage:
 *   npm run ig:queue                 # write schedule JSON + Day-1 TODAY folder
 *   npm run ig:queue -- --per-day 5 --days 14
 *   npm run ig:queue -- --start-hour 10
 */
import fs from "fs";
import path from "path";

type AdScript = {
  engineTitle: string;
  slug: string;
  targetUrl: string;
  socialCaption: string;
  screenOverlayText?: string[];
};

type QueueItem = {
  day: number;
  slot: number;
  scheduledLocal: string;
  slug: string;
  title: string;
  videoPath: string;
  caption: string;
  instagramUrl: string;
  status: "queued" | "posted" | "skipped" | "failed";
};

const ROOT = __dirname;
const ADS_JSON = path.join(ROOT, "500_video_ads_export.json");
const PREMIUM_DIR = path.join(ROOT, "video-ads-premium");
const STANDARD_DIR = path.join(ROOT, "video-ads-output");
const OUT_DIR = path.join(ROOT, "instagram-release");
const QUEUE_FILE = path.join(OUT_DIR, "QUEUE.json");
const CSV_FILE = path.join(OUT_DIR, "QUEUE.csv");
const TODAY_DIR = path.join(OUT_DIR, "TODAY");
const STATE_FILE = path.join(OUT_DIR, "posted-slugs.json");

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { perDay: 5, days: 14, startHour: 10, gapMinutes: 120 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--per-day") opts.perDay = parseInt(args[++i], 10);
    else if (args[i] === "--days") opts.days = parseInt(args[++i], 10);
    else if (args[i] === "--start-hour") opts.startHour = parseInt(args[++i], 10);
    else if (args[i] === "--gap-minutes") opts.gapMinutes = parseInt(args[++i], 10);
  }
  return opts;
}

function withIgUtm(targetUrl: string, slug: string): string {
  const u = new URL(targetUrl);
  // Grant Mode money path — never dump Reels onto the 500-engine wall
  if (slug.includes("grant") || slug.includes("nonprofit-budget")) {
    u.pathname = "/go/grant";
    u.search = "";
  }
  u.searchParams.set("utm_source", "instagram");
  u.searchParams.set("utm_medium", "reel");
  u.searchParams.set("utm_campaign", "apex_safe_release");
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

function buildCaption(ad: AdScript, igUrl: string): string {
  const base = (ad.socialCaption || ad.engineTitle)
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return `${base}

👉 ${igUrl}

#ApexCapital #BusinessTools #Reels`;
}

function listMp4s(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mp4") && !f.includes(".tmp."))
    .map((f) => f.replace(/\.mp4$/i, ""));
}

function loadPosted(): Set<string> {
  if (!fs.existsSync(STATE_FILE)) return new Set();
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as string[]);
  } catch {
    return new Set();
  }
}

function csvEscape(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

function main() {
  const opts = parseArgs();
  if (!fs.existsSync(ADS_JSON)) {
    throw new Error("Missing 500_video_ads_export.json — run npm run generate-ads first");
  }

  const ads: AdScript[] = JSON.parse(fs.readFileSync(ADS_JSON, "utf-8"));
  const bySlug = new Map(ads.map((a) => [a.slug, a]));
  const posted = loadPosted();

  const premium = listMp4s(PREMIUM_DIR);
  const standard = listMp4s(STANDARD_DIR).filter((s) => !premium.includes(s));
  const ordered = [...premium, ...standard].filter((slug) => !posted.has(slug) && bySlug.has(slug));

  const capacity = opts.perDay * opts.days;
  const selected = ordered.slice(0, capacity);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(TODAY_DIR, { recursive: true });

  // Clear previous TODAY pack (keep folder)
  for (const f of fs.readdirSync(TODAY_DIR)) {
    fs.rmSync(path.join(TODAY_DIR, f), { force: true, recursive: true });
  }

  const start = new Date();
  start.setHours(opts.startHour, 0, 0, 0);
  if (start.getTime() < Date.now()) {
    // If today's start hour already passed, begin next slot from now+30m rounded
    start.setTime(Date.now() + 30 * 60 * 1000);
  }

  const queue: QueueItem[] = [];
  let cursor = new Date(start);

  for (let i = 0; i < selected.length; i++) {
    const day = Math.floor(i / opts.perDay) + 1;
    const slot = (i % opts.perDay) + 1;
    if (i > 0 && slot === 1) {
      // jump to next calendar day at startHour
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(opts.startHour, 0, 0, 0);
    } else if (i > 0) {
      cursor = new Date(cursor.getTime() + opts.gapMinutes * 60 * 1000);
    }

    const slug = selected[i];
    const ad = bySlug.get(slug)!;
    const videoPath = fs.existsSync(path.join(PREMIUM_DIR, `${slug}.mp4`))
      ? path.join(PREMIUM_DIR, `${slug}.mp4`)
      : path.join(STANDARD_DIR, `${slug}.mp4`);
    const igUrl = withIgUtm(ad.targetUrl, slug);
    const caption = buildCaption(ad, igUrl);

    const item: QueueItem = {
      day,
      slot,
      scheduledLocal: cursor.toISOString(),
      slug,
      title: ad.engineTitle,
      videoPath,
      caption,
      instagramUrl: igUrl,
      status: "queued",
    };
    queue.push(item);

    if (day === 1) {
      const dayDir = path.join(TODAY_DIR, `${String(slot).padStart(2, "0")}-${slug}`);
      fs.mkdirSync(dayDir, { recursive: true });
      fs.copyFileSync(videoPath, path.join(dayDir, `${slug}.mp4`));
      fs.writeFileSync(path.join(dayDir, "CAPTION_INSTAGRAM.txt"), caption, "utf-8");
      fs.writeFileSync(
        path.join(dayDir, "WHEN.txt"),
        `Post slot ${slot} of Day 1\nSuggested time (local ISO): ${item.scheduledLocal}\nWait at least ${opts.gapMinutes} minutes after the previous Reel.\n`,
        "utf-8",
      );
    }
  }

  fs.writeFileSync(
    QUEUE_FILE,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        rules: {
          maxPerDay: opts.perDay,
          minGapMinutes: opts.gapMinutes,
          preferPremiumFirst: true,
          hashtagLimit: 5,
          note: "Do not dump the queue in one hour. Follow scheduledLocal times.",
        },
        total: queue.length,
        premiumAvailable: premium.length,
        standardAvailable: standard.length,
        items: queue,
      },
      null,
      2,
    ),
    "utf-8",
  );

  const csv = [
    "day,slot,scheduled_local,slug,title,video_path,instagram_url,status",
    ...queue.map((q) =>
      [q.day, q.slot, q.scheduledLocal, q.slug, q.title, q.videoPath, q.instagramUrl, q.status]
        .map((v) => csvEscape(String(v)))
        .join(","),
    ),
  ].join("\n");
  fs.writeFileSync(CSV_FILE, csv, "utf-8");

  const guide = `# Instagram Safe Release — Apex Capital

## Do this NOW (no API required)
1. Open folder: \`instagram-release/TODAY/\`
2. Each subfolder = one Reel (MP4 + CAPTION_INSTAGRAM.txt)
3. On your phone Instagram app:
   - + → Reel → upload the MP4
   - Paste CAPTION_INSTAGRAM.txt
   - Share
4. Wait **${opts.gapMinutes} minutes** before the next one
5. Max **${opts.perDay}/day**

## Full queue
- \`QUEUE.json\` / \`QUEUE.csv\` — ${queue.length} posts across ~${opts.days} days
- Premium videos scheduled first (${Math.min(premium.length, queue.length)} premium in pool)

## Connect Meta for later automation
Set these in \`.env\` (never commit tokens):
\`\`\`
INSTAGRAM_BUSINESS_ACCOUNT_ID=
META_PAGE_ACCESS_TOKEN=
# Videos must be publicly reachable for Graph API:
PUBLIC_AD_VIDEO_BASE_URL=https://your-cdn.example.com/ads
\`\`\`
Then: \`npm run ig:publish -- --dry-run\` then \`npm run ig:publish\`

## Anti-spam rules baked in
- ${opts.perDay}/day max
- ${opts.gapMinutes}+ minutes between posts
- Unique captions + Instagram UTMs
- No .tmp broken files
`;
  fs.writeFileSync(path.join(OUT_DIR, "HOW_TO_POST.md"), guide, "utf-8");
  fs.writeFileSync(
    path.join(TODAY_DIR, "START_HERE.txt"),
    `DAY 1 — post these ${Math.min(opts.perDay, queue.filter((q) => q.day === 1).length)} Reels only.\nOpen each numbered folder → upload MP4 → paste CAPTION_INSTAGRAM.txt → wait ${opts.gapMinutes} min → next.\n`,
    "utf-8",
  );

  console.log(`Queued ${queue.length} Reels (${opts.perDay}/day, ${opts.gapMinutes}m gap).`);
  console.log(`Day-1 pack: ${TODAY_DIR}`);
  console.log(`Schedule: ${QUEUE_FILE}`);
}

main();
