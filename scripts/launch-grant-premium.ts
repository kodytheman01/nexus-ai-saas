/**
 * Launch Wave 1: Grant Mode flagships + premium creatives.
 *
 * Packages upload-ready folders (does NOT post to Meta/TikTok — needs your accounts).
 * Grant creatives land on /go/grant → narrative engine + sample intake.
 * Premium lands on their engine pages.
 *
 * Usage:
 *   npx tsx scripts/launch-grant-premium.ts
 *   npm run ads:wave1
 */
import fs from "fs";
import path from "path";
import { FLAGSHIP_ENGINES } from "../config/flagship";

type AdScript = {
  engineTitle: string;
  slug: string;
  targetUrl: string;
  socialCaption: string;
  screenOverlayText?: string[];
};

const ROOT = path.join(__dirname, "..");
const ADS_JSON = path.join(ROOT, "500_video_ads_export.json");
const PREMIUM_DIR = path.join(ROOT, "video-ads-premium");
const STANDARD_DIR = path.join(ROOT, "video-ads-output");
const KITS_DIR = path.join(ROOT, "ad-launch-kits");
const OUT_DIR = path.join(ROOT, "ad-launch-wave1");
const IG_DIR = path.join(ROOT, "instagram-release");
const SITE = "https://apexcapitaladmin.com";

const GRANT_SLUGS = FLAGSHIP_ENGINES.filter((f) => f.badge === "Grant Mode").map(
  (f) => f.slug,
);

function listMp4s(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mp4") && !f.includes(".tmp."))
    .map((f) => f.replace(/\.mp4$/i, ""));
}

function withUtm(
  baseUrl: string,
  slug: string,
  platform: string,
  campaign: string,
): string {
  const u = new URL(baseUrl);
  u.searchParams.set("utm_source", platform);
  u.searchParams.set("utm_medium", "video_ad");
  u.searchParams.set("utm_campaign", campaign);
  u.searchParams.set("utm_content", slug);
  return u.toString();
}

function videoFor(slug: string): { path: string; tier: "premium" | "standard" } {
  const premium = path.join(PREMIUM_DIR, `${slug}.mp4`);
  if (fs.existsSync(premium)) return { path: premium, tier: "premium" };
  const standard = path.join(STANDARD_DIR, `${slug}.mp4`);
  if (fs.existsSync(standard)) return { path: standard, tier: "standard" };
  throw new Error(`Missing MP4 for ${slug}`);
}

function grantCaption(title: string, url: string): string {
  return `Grant deadline? Get a funder-style narrative draft in ~60 seconds.

${title} — $24 · Stripe checkout · optional human review.

Tap → sample intake loads → swap your facts → pay.

👉 ${url}

#GrantWriting #Nonprofit #FOA #ApexCapital #GrantMode`;
}

function main() {
  if (!fs.existsSync(ADS_JSON)) {
    throw new Error("Missing 500_video_ads_export.json");
  }
  const ads: AdScript[] = JSON.parse(fs.readFileSync(ADS_JSON, "utf-8"));
  const bySlug = new Map(ads.map((a) => [a.slug, a]));

  const premium = listMp4s(PREMIUM_DIR);
  const ordered = [...GRANT_SLUGS, ...premium.filter((s) => !GRANT_SLUGS.includes(s))];

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // wipe previous wave pack folders but keep OUT_DIR
  for (const name of fs.readdirSync(OUT_DIR)) {
    fs.rmSync(path.join(OUT_DIR, name), { recursive: true, force: true });
  }

  const rows: string[] = [
    "tier,slug,title,video,landing,tiktok,instagram,youtube,meta,google",
  ];
  const igQueue: {
    day: number;
    slot: number;
    scheduledLocal: string;
    slug: string;
    title: string;
    videoPath: string;
    caption: string;
    instagramUrl: string;
    status: "queued";
    tier: string;
  }[] = [];

  const start = new Date();
  start.setHours(10, 0, 0, 0);
  if (start.getTime() < Date.now()) {
    start.setTime(Date.now() + 30 * 60 * 1000);
  }
  let cursor = new Date(start);
  const perDay = 4;
  const gapMinutes = 150;

  const todayDir = path.join(OUT_DIR, "TODAY");
  fs.mkdirSync(todayDir, { recursive: true });

  for (let i = 0; i < ordered.length; i++) {
    const slug = ordered[i];
    const isGrant = GRANT_SLUGS.includes(slug);
    const ad = bySlug.get(slug);
    const { path: videoPath, tier } = videoFor(slug);
    const title = ad?.engineTitle || slug;
    const campaign = isGrant ? "apex_wave1_grant" : "apex_wave1_premium";
    const landingBase = isGrant
      ? `${SITE}/go/grant`
      : ad?.targetUrl || `${SITE}/engine/${slug}`;

    const links = {
      tiktok: withUtm(landingBase, slug, "tiktok", campaign),
      instagram: withUtm(landingBase, slug, "instagram", campaign),
      youtube: withUtm(landingBase, slug, "youtube", campaign),
      meta: withUtm(landingBase, slug, "meta", campaign),
      google: withUtm(landingBase, slug, "google", campaign),
    };

    const caption = isGrant
      ? grantCaption(title, links.instagram)
      : `${(ad?.socialCaption || title).replace(/https?:\/\/\S+/g, "").trim()}

👉 ${links.instagram}

#ApexCapital #BusinessTools #Reels`;

    const kitDir = path.join(
      OUT_DIR,
      `${String(i + 1).padStart(2, "0")}-${isGrant ? "grant" : "premium"}-${slug}`,
    );
    fs.mkdirSync(kitDir, { recursive: true });
    fs.copyFileSync(videoPath, path.join(kitDir, `${slug}.mp4`));
    fs.writeFileSync(path.join(kitDir, "CAPTION.txt"), caption, "utf-8");
    fs.writeFileSync(
      path.join(kitDir, "LINKS.json"),
      JSON.stringify({ slug, tier, isGrant, landingBase, links }, null, 2),
      "utf-8",
    );
    fs.writeFileSync(
      path.join(kitDir, "README.md"),
      `# ${title}

- Tier: **${tier}** ${isGrant ? "(Grant Mode wave)" : "(Premium wave)"}
- Landing: ${landingBase}
- Upload MP4 + paste CAPTION.txt
- Platforms: TikTok · Instagram Reels · YouTube Shorts · Meta Ads · Google Ads
- Do not post more than ~4/day; wait 2+ hours between organic posts
`,
      "utf-8",
    );

    // Prefer existing polished kit assets when present
    const existingKit = path.join(KITS_DIR, slug);
    if (fs.existsSync(path.join(existingKit, "OVERLAYS.txt"))) {
      fs.copyFileSync(
        path.join(existingKit, "OVERLAYS.txt"),
        path.join(kitDir, "OVERLAYS.txt"),
      );
    }

    rows.push(
      [
        isGrant ? "grant" : "premium",
        slug,
        JSON.stringify(title),
        `${slug}.mp4`,
        landingBase,
        links.tiktok,
        links.instagram,
        links.youtube,
        links.meta,
        links.google,
      ].join(","),
    );

    const day = Math.floor(i / perDay) + 1;
    const slot = (i % perDay) + 1;
    if (i > 0 && slot === 1) {
      cursor = new Date(cursor);
      cursor.setDate(cursor.getDate() + 1);
      cursor.setHours(10, 0, 0, 0);
    } else if (i > 0) {
      cursor = new Date(cursor.getTime() + gapMinutes * 60 * 1000);
    }

    igQueue.push({
      day,
      slot,
      scheduledLocal: cursor.toISOString(),
      slug,
      title,
      videoPath: path.join(kitDir, `${slug}.mp4`),
      caption,
      instagramUrl: links.instagram,
      status: "queued",
      tier: isGrant ? "grant" : "premium",
    });

    if (day === 1) {
      const daySlot = path.join(
        todayDir,
        `${String(slot).padStart(2, "0")}-${slug}`,
      );
      fs.mkdirSync(daySlot, { recursive: true });
      fs.copyFileSync(videoPath, path.join(daySlot, `${slug}.mp4`));
      fs.writeFileSync(path.join(daySlot, "CAPTION_INSTAGRAM.txt"), caption);
      fs.writeFileSync(
        path.join(daySlot, "WHEN.txt"),
        `Day 1 slot ${slot}\nSuggested: ${cursor.toISOString()}\nGap: ${gapMinutes} minutes after previous.\n`,
      );
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, "MANIFEST.csv"), rows.join("\n"), "utf-8");

  fs.writeFileSync(
    path.join(OUT_DIR, "LAUNCH.md"),
    `# Wave 1 launch — Grant Mode + Premium

Generated: ${new Date().toISOString()}

## What's in this pack
- **${GRANT_SLUGS.length} Grant Mode** creatives → land on \`${SITE}/go/grant\` (narrative + sample intake)
- **${premium.length} Premium** creatives → land on engine pages
- **${ordered.length} total** upload kits in this folder
- **TODAY/** = first 4 posts ready to upload now

## Auto-post status
Instagram Graph API env vars are **not** configured locally:
\`INSTAGRAM_BUSINESS_ACCOUNT_ID\`, \`META_PAGE_ACCESS_TOKEN\`, \`PUBLIC_AD_VIDEO_BASE_URL\`

Until those exist + videos are on a public URL, launch = **manual upload** from each kit.

## Do this now (Day 1)
1. Open \`TODAY/\` — 4 folders, Grant Mode first
2. Instagram / TikTok / YouTube: upload MP4, paste \`CAPTION_INSTAGRAM.txt\`
3. Wait **2.5+ hours** between organic posts (anti-spam)
4. Prefer Grant Mode posts before generic premium

## Paid (optional, after organic smoke test)
- Meta Ads / Google Ads: use kit MP4 + \`LINKS.json\` → \`meta\` / \`google\` UTM URLs
- Start with Grant Mode only ($10–20/day) before scaling premium

## Tracking
- UTMs: \`utm_campaign=apex_wave1_grant\` or \`apex_wave1_premium\`
- Check Netlify/GA and \`/admin\` after first clicks
`,
    "utf-8",
  );

  // Sync IG queue for optional later publish
  fs.mkdirSync(IG_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(IG_DIR, "QUEUE.json"),
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        wave: "grant_mode_plus_premium",
        rules: {
          maxPerDay: perDay,
          minGapMinutes: gapMinutes,
          preferGrantThenPremium: true,
          note: "Manual upload until Meta tokens + public video hosting are set.",
        },
        total: igQueue.length,
        items: igQueue,
      },
      null,
      2,
    ),
    "utf-8",
  );

  const igCsv = [
    "day,slot,scheduledLocal,tier,slug,title,instagramUrl",
    ...igQueue.map((q) =>
      [q.day, q.slot, q.scheduledLocal, q.tier, q.slug, JSON.stringify(q.title), q.instagramUrl].join(
        ",",
      ),
    ),
  ].join("\n");
  fs.writeFileSync(path.join(IG_DIR, "QUEUE.csv"), igCsv, "utf-8");

  console.log("=== Wave 1 packaged ===");
  console.log(`Grant:   ${GRANT_SLUGS.length}`);
  console.log(`Premium: ${premium.length}`);
  console.log(`Total:   ${ordered.length}`);
  console.log(`Folder:  ${OUT_DIR}`);
  console.log(`Today:   ${todayDir}`);
  console.log(`IG queue:${path.join(IG_DIR, "QUEUE.json")}`);
  console.log("\nNext: open ad-launch-wave1/TODAY and upload the 4 Day-1 Reels.");
  console.log("Auto-post blocked until Meta IG tokens + public MP4 hosting are set.");
}

main();
