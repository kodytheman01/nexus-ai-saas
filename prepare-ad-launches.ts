/**
 * prepare-ad-launches.ts
 *
 * Watches / packages finished MP4s from video-ads-output/ into upload-ready
 * launch kits (caption + UTM landing URL + platform checklist). Does NOT spend
 * money or call Meta/TikTok/Google Ads APIs — those require your ad accounts.
 *
 * Usage:
 *   npm run prepare-ad-launches              # package all ready MP4s once
 *   npm run prepare-ad-launches -- --watch   # keep packaging as new MP4s finish
 *   npm run prepare-ad-launches -- --limit 20
 */
import fs from "fs";
import path from "path";

type AdScript = {
  engineTitle: string;
  slug: string;
  targetUrl: string;
  voiceoverScript: string;
  screenOverlayText: string[];
  socialCaption: string;
};

const ROOT = __dirname;
const INPUT_JSON = path.join(ROOT, "500_video_ads_export.json");
const VIDEO_DIR = path.join(ROOT, "video-ads-output");
const LAUNCH_DIR = path.join(ROOT, "ad-launch-kits");
const MANIFEST = path.join(LAUNCH_DIR, "LAUNCH_MANIFEST.csv");
const STATE_FILE = path.join(LAUNCH_DIR, ".packaged-slugs.json");

function withUtm(baseUrl: string, slug: string, platform: string): string {
  const u = new URL(baseUrl);
  u.searchParams.set("utm_source", platform);
  u.searchParams.set("utm_medium", "video_ad");
  u.searchParams.set("utm_campaign", "apex_500_engines");
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

function loadState(): Set<string> {
  if (!fs.existsSync(STATE_FILE)) return new Set();
  try {
    return new Set(JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as string[]);
  } catch {
    return new Set();
  }
}

function saveState(slugs: Set<string>) {
  fs.mkdirSync(LAUNCH_DIR, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify([...slugs].sort(), null, 2));
}

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function packageAd(ad: AdScript, videoPath: string): void {
  const kitDir = path.join(LAUNCH_DIR, ad.slug);
  fs.mkdirSync(kitDir, { recursive: true });

  const destVideo = path.join(kitDir, `${ad.slug}.mp4`);
  if (!fs.existsSync(destVideo)) {
    fs.copyFileSync(videoPath, destVideo);
  }

  const links = {
    tiktok: withUtm(ad.targetUrl, ad.slug, "tiktok"),
    instagram: withUtm(ad.targetUrl, ad.slug, "instagram"),
    youtube_shorts: withUtm(ad.targetUrl, ad.slug, "youtube"),
    meta_ads: withUtm(ad.targetUrl, ad.slug, "meta"),
    google_ads: withUtm(ad.targetUrl, ad.slug, "google"),
  };

  const caption = `${ad.socialCaption}

🔗 ${links.tiktok}`;

  const readme = `# Launch kit: ${ad.engineTitle}

## Video
- File: ${ad.slug}.mp4
- Source: ${videoPath}

## Captions
See CAPTION.txt (paste into TikTok / Reels / Shorts / Meta).

## Tracked landing URLs (use the matching platform)
- TikTok: ${links.tiktok}
- Instagram: ${links.instagram}
- YouTube Shorts: ${links.youtube_shorts}
- Meta Ads: ${links.meta_ads}
- Google Ads: ${links.google_ads}

## Post / launch checklist
- [ ] Organic TikTok
- [ ] Organic Instagram Reels
- [ ] Organic YouTube Shorts
- [ ] Meta Advantage+ (paid) — requires Meta Ads account + daily budget
- [ ] Google Demand Gen / YouTube (paid) — requires Google Ads account + budget
- [ ] TikTok Spark Ads (paid boost of organic) — optional after organic traction

## Notes
Paid platforms will NOT accept uploads from this script automatically until
API credentials + ad account IDs are configured. This kit is the upload pack.
`;

  fs.writeFileSync(path.join(kitDir, "CAPTION.txt"), caption, "utf-8");
  fs.writeFileSync(path.join(kitDir, "LINKS.json"), JSON.stringify(links, null, 2), "utf-8");
  fs.writeFileSync(path.join(kitDir, "README.md"), readme, "utf-8");
  fs.writeFileSync(
    path.join(kitDir, "OVERLAYS.txt"),
    ad.screenOverlayText.join("\n"),
    "utf-8",
  );
}

function rebuildManifest(adsBySlug: Map<string, AdScript>, packaged: Set<string>) {
  const header = [
    "slug",
    "title",
    "video_path",
    "caption_path",
    "tiktok_url",
    "instagram_url",
    "youtube_url",
    "meta_url",
    "google_url",
    "status",
  ];
  const rows = [header.join(",")];

  for (const slug of [...packaged].sort()) {
    const ad = adsBySlug.get(slug);
    if (!ad) continue;
    const kitDir = path.join(LAUNCH_DIR, slug);
    const links = {
      tiktok: withUtm(ad.targetUrl, slug, "tiktok"),
      instagram: withUtm(ad.targetUrl, slug, "instagram"),
      youtube: withUtm(ad.targetUrl, slug, "youtube"),
      meta: withUtm(ad.targetUrl, slug, "meta"),
      google: withUtm(ad.targetUrl, slug, "google"),
    };
    rows.push(
      [
        slug,
        ad.engineTitle,
        path.join(kitDir, `${slug}.mp4`),
        path.join(kitDir, "CAPTION.txt"),
        links.tiktok,
        links.instagram,
        links.youtube,
        links.meta,
        links.google,
        "READY_TO_UPLOAD",
      ]
        .map((v) => csvEscape(String(v)))
        .join(","),
    );
  }

  fs.writeFileSync(MANIFEST, rows.join("\n"), "utf-8");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { watch: false, limit: Infinity, pollMs: 30_000 };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--watch") opts.watch = true;
    else if (args[i] === "--limit") opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--poll-ms") opts.pollMs = parseInt(args[++i], 10);
  }
  return opts;
}

function packageReady(limit: number): number {
  if (!fs.existsSync(INPUT_JSON)) {
    throw new Error(`Missing ${INPUT_JSON}. Run npm run generate-ads first.`);
  }
  if (!fs.existsSync(VIDEO_DIR)) {
    throw new Error(`Missing ${VIDEO_DIR}. Run npm run generate-video-ads first.`);
  }

  const ads: AdScript[] = JSON.parse(fs.readFileSync(INPUT_JSON, "utf-8"));
  const adsBySlug = new Map(ads.map((a) => [a.slug, a]));
  const packaged = loadState();

  const readyVideos = fs
    .readdirSync(VIDEO_DIR)
    .filter((f) => f.endsWith(".mp4"))
    .map((f) => f.replace(/\.mp4$/, ""));

  let newly = 0;
  for (const slug of readyVideos) {
    if (packaged.has(slug)) continue;
    if (newly >= limit) break;
    const ad = adsBySlug.get(slug);
    if (!ad) continue;
    const videoPath = path.join(VIDEO_DIR, `${slug}.mp4`);
    packageAd(ad, videoPath);
    packaged.add(slug);
    newly++;
    console.log(`[packaged] ${slug}`);
  }

  saveState(packaged);
  rebuildManifest(adsBySlug, packaged);
  console.log(
    `Done. Newly packaged: ${newly}. Total launch-ready kits: ${packaged.size}. Manifest: ${MANIFEST}`,
  );
  return newly;
}

async function main() {
  const opts = parseArgs();
  fs.mkdirSync(LAUNCH_DIR, { recursive: true });

  const guide = `# Apex Capital — Ad Launch HQ

## What's here
- One folder per engine video with MP4 + CAPTION.txt + tracked UTM links
- LAUNCH_MANIFEST.csv — spreadsheet of every ready creative

## IMPORTANT
These kits are **upload-ready**, not auto-published.
Paid / organic publishing requires YOUR accounts:

1. Meta Business Suite / Ads Manager (Facebook + Instagram)
2. TikTok (organic app and/or TikTok Ads)
3. YouTube Studio (Shorts)
4. Google Ads (Demand Gen / YouTube)

## Fastest path to "eyes on site" today (organic, $0)
1. Open ad-launch-kits/<slug>/
2. Upload the MP4 to TikTok + Instagram Reels + YouTube Shorts
3. Paste CAPTION.txt
4. Post 5–15/day from the newest kits while rendering finishes

## Paid path (needs budget + accounts)
1. Meta Ads Manager → Create campaign → Advantage+ / Traffic or Sales
2. Upload creatives from kits (start with 10–20, NOT all 500 at once)
3. Daily budget tip: $5–20/ad set while learning, kill losers in 48h
4. Destination = the meta_url from LINKS.json (UTMs already attached)

## Auto-package as videos finish
\`npm run prepare-ad-launches -- --watch\`
`;
  fs.writeFileSync(path.join(LAUNCH_DIR, "HOW_TO_LAUNCH.md"), guide, "utf-8");

  packageReady(opts.limit);

  if (!opts.watch) return;

  console.log(`Watching ${VIDEO_DIR} every ${opts.pollMs}ms for new MP4s...`);
  setInterval(() => {
    try {
      packageReady(Infinity);
    } catch (err) {
      console.error("Watch cycle error:", (err as Error).message);
    }
  }, opts.pollMs);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
