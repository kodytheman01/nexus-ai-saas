/**
 * Export walkthrough MP4s + multi-platform captions into phone-ready folders.
 *
 *   npx tsx scripts/export-walkthrough-phone-packs.ts
 */
import fs from "fs";
import path from "path";
import os from "os";

const ROOT = path.join(__dirname, "..");
const PUBLIC_ADS = path.join(ROOT, "public", "ads");
const DESKTOP =
  process.env.APEX_OPS ||
  path.join(os.homedir(), "OneDrive", "Desktop", "Apex Ops");
const OUT = path.join(DESKTOP, "8 - God Mode Marketing", "WALKTHROUGHS-PHONE");

const SLUGS = [
  "apex-notice-walkthrough",
  "apex-bid-walkthrough",
  "apex-offer-walkthrough",
  "apex-grant-walkthrough",
  "apex-vision-walkthrough",
  "apex-site-walkthrough",
];

function withSource(url: string, source: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", source);
    return u.toString();
  } catch {
    return url;
  }
}

function writePack(
  folder: string,
  mp4: string,
  caption: string,
  landing: string,
) {
  fs.mkdirSync(folder, { recursive: true });
  const destMp4 = path.join(folder, path.basename(mp4));
  fs.copyFileSync(mp4, destMp4);

  const ig = caption;
  const fb = caption
    .replace(/utm_source=instagram/g, "utm_source=facebook")
    .replace(/#\w+/g, "")
    .trim();
  const tt = [
    caption.split("\n")[0],
    "",
    "Real site walkthrough — not a slideshow",
    "Sample intake → Stripe → draft ~60s",
    "",
    landing.replace("utm_source=instagram", "utm_source=tiktok").replace(/^https?:\/\//, ""),
    "",
    "#apexcapital #smallbusiness #adminautomation",
  ].join("\n");
  const ytTitle = `${path.basename(folder)} | Apex Capital Admin Services`;
  const ytDesc = `${caption.replace(/utm_source=instagram/g, "utm_source=youtube")}\n\n#Shorts`;

  fs.writeFileSync(path.join(folder, "CAPTION_INSTAGRAM.txt"), ig + "\n");
  fs.writeFileSync(path.join(folder, "CAPTION_FACEBOOK.txt"), fb + "\n");
  fs.writeFileSync(path.join(folder, "CAPTION_TIKTOK.txt"), tt + "\n");
  fs.writeFileSync(
    path.join(folder, "YOUTUBE_SHORTS.txt"),
    `TITLE:\n${ytTitle}\n\nDESCRIPTION:\n${ytDesc}\n`,
  );
  fs.writeFileSync(
    path.join(folder, "LINKS.txt"),
    [
      `instagram: ${withSource(landing, "instagram")}`,
      `facebook: ${withSource(landing, "facebook")}`,
      `tiktok: ${withSource(landing, "tiktok")}`,
      `youtube: ${withSource(landing, "youtube")}`,
      `linkedin: ${withSource(landing, "linkedin")}`,
    ].join("\n") + "\n",
  );
  fs.writeFileSync(
    path.join(folder, "POST_ORDER.txt"),
    [
      "1. Upload the .mp4 as Reel / Short / TikTok",
      "2. Paste CAPTION_*.txt for that platform",
      "3. First comment on IG/FB: Modes → apexcapitaladmin.com/modes",
      "4. Reply to comments for 10 minutes",
      "5. Do NOT boost until Stripe live charge exists",
    ].join("\n") + "\n",
  );
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let n = 0;
  for (const slug of SLUGS) {
    const mp4 = path.join(PUBLIC_ADS, `${slug}.mp4`);
    const metaPath = path.join(PUBLIC_ADS, `${slug}.json`);
    if (!fs.existsSync(mp4)) {
      console.log("skip (no mp4)", slug);
      continue;
    }
    let caption = `Apex Capital Admin Services\n\n👉 https://apexcapitaladmin.com/modes`;
    let landing = "https://apexcapitaladmin.com/modes";
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
        caption?: string;
        landing?: string;
      };
      if (meta.caption) caption = meta.caption;
      if (meta.landing) landing = meta.landing;
    }
    const folder = path.join(OUT, slug);
    writePack(folder, mp4, caption, landing);
    console.log("OK", folder);
    n++;
  }
  fs.writeFileSync(
    path.join(OUT, "READ_ME_FIRST.txt"),
    [
      "APEX GOD-MODE WALKTHROUGHS — PHONE PACK",
      "",
      "Upload order this week:",
      "1) apex-vision-walkthrough (brand)",
      "2) apex-notice-walkthrough",
      "3) apex-bid-walkthrough",
      "4) apex-offer-walkthrough",
      "5) apex-grant-walkthrough or apex-site-walkthrough",
      "",
      "Cross-post same day: Instagram → Facebook → TikTok → YouTube Shorts",
      "Full playbook: docs/marketing/GOD_MODE_ORGANIC.md in the repo",
      "",
      `Exported packs: ${n}`,
    ].join("\n") + "\n",
  );
  console.log("Done →", OUT);
}

main();
