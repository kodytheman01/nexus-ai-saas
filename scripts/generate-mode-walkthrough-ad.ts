/**
 * Mode walkthrough Reel — real screen recording + VO → /go/{mode}
 *
 *   npx tsx scripts/generate-mode-walkthrough-ad.ts --mode bid --force --capture
 *   npx tsx scripts/generate-mode-walkthrough-ad.ts --mode offer --force --capture
 *   npx tsx scripts/generate-mode-walkthrough-ad.ts --mode vision --force --capture
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execFile, spawnSync } from "child_process";
import { promisify } from "util";
import sharp from "sharp";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const execFileAsync = promisify(execFile);

const wingetLinks = path.join(
  os.homedir(),
  "AppData",
  "Local",
  "Microsoft",
  "WinGet",
  "Links",
);
if (fs.existsSync(wingetLinks) && !process.env.PATH?.includes(wingetLinks)) {
  process.env.PATH = `${wingetLinks};${process.env.PATH ?? ""}`;
}

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "video-ads-premium");
const PUBLIC_ADS = path.join(ROOT, "public", "ads");
const WIDTH = 1080;
const HEIGHT = 1920;
const NAVY = "#0b1f3a";
const GOLD = "#c9a227";
const CREAM = "#f7f5f0";
const FORCE = process.argv.includes("--force");
const DO_CAPTURE = process.argv.includes("--capture");

type ModeKey = "bid" | "offer" | "grant" | "notice" | "vision";

type ModeAd = {
  slug: string;
  tmpFolder: string;
  endCta: string;
  goPath: string;
  landing: string;
  voiceover: string;
  caption: string;
  lowerThirds: [string, string, string, string];
  title: string;
};

const ADS: Record<ModeKey, ModeAd> = {
  bid: {
    slug: "apex-bid-walkthrough",
    tmpFolder: "bid-walkthrough",
    endCta: "Start Bid Mode",
    goPath: "/go/bid",
    landing:
      "https://apexcapitaladmin.com/go/bid?utm_source=instagram&utm_medium=reel&utm_campaign=apex_bid_walkthrough&utm_content=site-tour-live",
    title: "Apex Capital — Bid Mode Walkthrough",
    lowerThirds: [
      "Homepage — Apex Capital Admin",
      "Bid Mode — contractor proposals",
      "Sample intake — scope ready",
      "/go/bid — see the draft path",
    ],
    voiceover: `Customer wants the bid tomorrow. Scope is still in your notes app.

This is Apex Capital Admin Services — apexcapitaladmin.com. You're looking at the real site.

Homepage first — then Bid Mode. Contractor proposals, change orders, scope language.

Open the proposal intake — sample facts ready — Stripe checkout, draft on the page and in your email.

How it works: choose, intake, pay, draft. Optional human review when stakes are high.

Go to apexcapitaladmin.com slash go slash bid. Use the sample. See the draft.

Apex. Draft-ready. Deadline-ready.`,
    caption: `Watch the real Apex Bid Mode — not a stock template.

Homepage → Bid Mode → contractor proposal intake → /go/bid

$19–$24 drafts · Stripe · ~60 seconds · optional +$49 human review
Drafts for structure — confirm numbers before you send.

👉 https://apexcapitaladmin.com/go/bid?utm_source=instagram&utm_medium=reel&utm_campaign=apex_bid_walkthrough&utm_content=site-tour-live

#ApexCapital #BidMode #Contractor #Construction #Proposal`,
  },
  offer: {
    slug: "apex-offer-walkthrough",
    tmpFolder: "offer-walkthrough",
    endCta: "Start Offer Mode",
    goPath: "/go/offer",
    landing:
      "https://apexcapitaladmin.com/go/offer?utm_source=instagram&utm_medium=reel&utm_campaign=apex_offer_walkthrough&utm_content=site-tour-live",
    title: "Apex Capital — Offer Mode Walkthrough",
    lowerThirds: [
      "Homepage — Apex Capital Admin",
      "Offer Mode — HR letters",
      "Job offer intake — sample ready",
      "/go/offer — see the draft path",
    ],
    voiceover: `You hired them. The offer letter is still a Google Doc ghost.

This is Apex Capital Admin Services — apexcapitaladmin.com. You're looking at the real site.

Homepage first — then Offer Mode. Offer letters, rejections, promotion notes.

Open the job-offer intake — sample facts ready — Stripe checkout, draft on the page and in your email.

How it works: choose, intake, pay, draft. Optional human review when stakes are high.

Go to apexcapitaladmin.com slash go slash offer. Use the sample. See the draft.

Apex. Draft-ready. Deadline-ready.`,
    caption: `Watch the real Apex Offer Mode — not a stock template.

Homepage → Offer Mode → job offer intake → /go/offer

$12–$19 drafts · Stripe · ~60 seconds · optional +$49 human review
Drafts for clarity — confirm with counsel/HR before you send.

👉 https://apexcapitaladmin.com/go/offer?utm_source=instagram&utm_medium=reel&utm_campaign=apex_offer_walkthrough&utm_content=site-tour-live

#ApexCapital #OfferMode #HR #Hiring #OfferLetter`,
  },
  grant: {
    slug: "apex-grant-walkthrough",
    tmpFolder: "grant-walkthrough",
    endCta: "Start Grant Mode",
    goPath: "/go/grant",
    landing:
      "https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_grant_walkthrough&utm_content=site-tour-live",
    title: "Apex Capital — Grant Mode Walkthrough",
    lowerThirds: [
      "Homepage — Apex Capital Admin",
      "Grant Mode — funder narratives",
      "Narrative intake — sample ready",
      "/go/grant — see the draft path",
    ],
    voiceover: `FOA due Friday. Still staring at a blank need statement?

This is Apex Capital Admin Services — apexcapitaladmin.com. You're looking at the real site.

Homepage first — then Grant Mode. Funder-style narratives, outlines, budget language.

Open the narrative intake — sample facts ready — Stripe checkout, draft on the page and in your email.

How it works: choose, intake, pay, draft. Optional human review when stakes are high.

Go to apexcapitaladmin.com slash go slash grant. Use the sample. See the draft.

Apex. Draft-ready. Deadline-ready.`,
    caption: `Watch the real Apex Grant Mode — not a stock template.

Homepage → Grant Mode → narrative intake → /go/grant

$19–$24 drafts · Stripe · ~60 seconds · optional +$49 human review
No funding guarantees. Structure before the deadline.

👉 https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_grant_walkthrough&utm_content=site-tour-live

#ApexCapital #GrantMode #Nonprofit #GrantWriting #FOA`,
  },
  notice: {
    slug: "apex-notice-walkthrough",
    tmpFolder: "notice-walkthrough",
    endCta: "Start Notice Mode",
    goPath: "/go/notice",
    landing:
      "https://apexcapitaladmin.com/go/notice?utm_source=instagram&utm_medium=reel&utm_campaign=apex_notice_walkthrough&utm_content=site-tour-live",
    title: "Apex Capital — Notice Mode Walkthrough",
    lowerThirds: [
      "Homepage — Apex Capital Admin",
      "Notice Mode — money path",
      "TX · FL · CA state packs",
      "/go/notice — pay-or-quit",
    ],
    voiceover: `Unpaid rent. A blank notice template. And a deadline.

This is Apex Capital Admin Services — apexcapitaladmin.com. You're looking at the real site.

Homepage first — then Notice Mode. Landlord pay-or-quit, vacate, deposit drafts. Tenant letters too.

State packs for Texas, Florida, and California — local-law cues, not legal advice. Confirm with counsel before you serve.

Open the pay-or-quit intake — sample facts ready — Stripe checkout, draft on the page and in your email.

Go to apexcapitaladmin.com slash go slash notice. Use the sample. See the draft.

Apex. Draft-ready. Deadline-ready.`,
    caption: `Watch the real Apex Notice Mode — not a stock template.

Homepage → Notice Mode → TX/FL/CA packs → pay-or-quit → /go/notice

$12–$24 drafts · Stripe · ~60 seconds · optional +$49 human review
Not legal advice. Confirm local rules before you serve.

👉 https://apexcapitaladmin.com/go/notice?utm_source=instagram&utm_medium=reel&utm_campaign=apex_notice_walkthrough&utm_content=site-tour-live

#ApexCapital #NoticeMode #Landlord #PropertyManagement #PayOrQuit`,
  },
  vision: {
    slug: "apex-vision-walkthrough",
    tmpFolder: "vision-walkthrough",
    endCta: "Time back → start here",
    goPath: "/go/grant",
    landing:
      "https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_vision&utm_content=site-tour-live",
    title: "Apex Capital — Vision Walkthrough",
    lowerThirds: [
      "Apex — time back for what you love",
      "Vision — simplify the admin grind",
      "Four Modes · 500+ engines",
      "Start at /go/grant",
    ],
    voiceover: `What if the admin work that steals your evenings... took a minute instead?

This is Apex Capital Admin Services. We're building a world where drafts for grants, notices, bids, and offers don't eat the time you wanted for your life.

You're looking at the real site. Vision. Modes. Platform. How it works.

Five hundred engines. Stripe checkout. Draft on the page. Optional human review.

We don't sell fake guarantees. We sell structure — so you can spend more of this life doing what you want, not what the blank page forces you to grind.

Start at apexcapitaladmin.com. Pick a Mode. Load the sample. See the draft.

Apex. Time back. Draft-ready.`,
    caption: `Why Apex exists: give people time back for what they love.

Admin drafts shouldn't steal your life. Grants · notices · bids · offers — structured in ~60s.

Watch the real site. No fake testimonials. Drafts, not guarantees.

👉 https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_vision&utm_content=site-tour-live

#ApexCapital #TimeBack #GrantMode #BusinessOps #AdminAutomation`,
  },
};

function parseMode(): ModeKey {
  const idx = process.argv.indexOf("--mode");
  const raw = (idx >= 0 ? process.argv[idx + 1] : "bid") || "bid";
  const mode = raw.replace(/^--mode=/, "").toLowerCase() as ModeKey;
  if (!(mode in ADS)) {
    throw new Error(
      `Unknown mode "${raw}". Use: bid | offer | grant | notice | vision`,
    );
  }
  return mode;
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function synthesize(text: string, outFile: string): Promise<void> {
  if (!FORCE && fs.existsSync(outFile) && fs.statSync(outFile).size > 0) return;
  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    "en-US-AriaNeural",
    OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  );
  const dir = path.dirname(outFile);
  const { audioFilePath } = await tts.toFile(dir, escapeXml(text), {
    rate: 0.94,
    pitch: "-1Hz",
  });
  if (!audioFilePath || !fs.existsSync(audioFilePath)) {
    throw new Error("TTS failed");
  }
  fs.copyFileSync(audioFilePath, outFile);
}

async function audioDuration(file: string): Promise<number> {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "csv=p=0",
    file,
  ]);
  return parseFloat(stdout.trim());
}

async function makeEndCard(ad: ModeAd): Promise<string> {
  const out = path.join(
    ROOT,
    ".video-ads-tmp",
    ad.tmpFolder,
    "end-card.png",
  );
  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>
  <circle cx="540" cy="520" r="70" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <text x="540" y="545" text-anchor="middle" font-family="Georgia, serif" font-size="78" fill="${CREAM}">A</text>
  <text x="540" y="700" text-anchor="middle" font-family="Georgia, serif" font-size="44" fill="${CREAM}">${escapeXml(ad.endCta)}</text>
  <text x="540" y="780" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="${GOLD}">apexcapitaladmin.com${escapeXml(ad.goPath)}</text>
  <text x="540" y="900" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="${CREAM}" opacity="0.8">Sample intake · see the draft · then decide</text>
</svg>`.trim();
  await sharp(Buffer.from(svg)).png().toFile(out);
  return out;
}

async function makeLowerThird(label: string, file: string): Promise<string> {
  const svg = `
<svg width="${WIDTH}" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect x="60" y="40" width="960" height="140" rx="12" fill="${NAVY}" fill-opacity="0.88"/>
  <rect x="60" y="40" width="10" height="140" fill="${GOLD}"/>
  <text x="100" y="125" font-family="Segoe UI, Arial, sans-serif" font-size="40" fill="${CREAM}">${escapeXml(label)}</text>
</svg>`.trim();
  await sharp(Buffer.from(svg)).png().toFile(file);
  return file;
}

function runCapture(mode: ModeKey) {
  console.log(`Capturing ${mode} (Playwright)…`);
  const r = spawnSync(
    process.execPath,
    [
      path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
      path.join(ROOT, "scripts", "capture-mode-walkthrough.ts"),
      "--mode",
      mode,
    ],
    { cwd: ROOT, stdio: "inherit", shell: false, env: process.env },
  );
  if (r.status !== 0) {
    const r2 = spawnSync(
      "npx",
      ["tsx", "scripts/capture-mode-walkthrough.ts", "--mode", mode],
      { cwd: ROOT, stdio: "inherit", shell: true, env: process.env },
    );
    if (r2.status !== 0) {
      throw new Error(`${mode} capture failed`);
    }
  }
}

async function buildOne(mode: ModeKey) {
  const ad = ADS[mode];
  const TMP = path.join(ROOT, ".video-ads-tmp", ad.tmpFolder);
  const UI_DIR = path.join(TMP, "ui");

  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_ADS, { recursive: true });

  if (DO_CAPTURE || !fs.existsSync(path.join(UI_DIR, "full-tour.webm"))) {
    runCapture(mode);
  }

  const uiWebm = path.join(UI_DIR, "full-tour.webm");
  if (!fs.existsSync(uiWebm)) {
    throw new Error(`Missing UI capture at ${uiWebm}. Run with --capture.`);
  }

  const audio = path.join(TMP, "vo-live.mp3");
  console.log(`[${mode}] Synthesizing voiceover…`);
  await synthesize(ad.voiceover, audio);
  const voDur = await audioDuration(audio);
  console.log(`[${mode}] VO ${voDur.toFixed(1)}s`);

  const uiMp4 = path.join(TMP, "ui-raw.mp4");
  console.log(`[${mode}] Converting UI capture…`);
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    uiWebm,
    "-vf",
    `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2,fps=30,format=yuv420p`,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "20",
    "-an",
    uiMp4,
  ]);

  const uiDur = await audioDuration(uiMp4);
  let tempo = voDur / Math.max(uiDur, 0.1);
  tempo = Math.min(1.35, Math.max(0.75, tempo));
  const uiTimed = path.join(TMP, "ui-timed.mp4");
  const pts = (1 / tempo).toFixed(4);
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    uiMp4,
    "-filter:v",
    `setpts=${pts}*PTS`,
    "-an",
    uiTimed,
  ]);

  const endCard = await makeEndCard(ad);
  const endCardVid = path.join(TMP, "end.mp4");
  await execFileAsync("ffmpeg", [
    "-y",
    "-loop",
    "1",
    "-i",
    endCard,
    "-t",
    "3.2",
    "-vf",
    `scale=${WIDTH}:${HEIGHT},fps=30,format=yuv420p`,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    endCardVid,
  ]);

  const lts = await Promise.all(
    ad.lowerThirds.map((label, i) =>
      makeLowerThird(label, path.join(TMP, `lt${i + 1}.png`)),
    ),
  );

  const labeled = path.join(TMP, "ui-labeled.mp4");
  const fc = [
    `[0:v][1:v]overlay=0:H-h-40:enable='between(t,0,8)'[v1]`,
    `[v1][2:v]overlay=0:H-h-40:enable='between(t,8,22)'[v2]`,
    `[v2][3:v]overlay=0:H-h-40:enable='between(t,22,40)'[v3]`,
    `[v3][4:v]overlay=0:H-h-40:enable='between(t,40,999)'[vout]`,
  ].join(";");
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    uiTimed,
    "-i",
    lts[0],
    "-i",
    lts[1],
    "-i",
    lts[2],
    "-i",
    lts[3],
    "-filter_complex",
    fc,
    "-map",
    "[vout]",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-crf",
    "20",
    labeled,
  ]);

  const concatList = path.join(TMP, "concat-live.txt");
  fs.writeFileSync(
    concatList,
    `file '${labeled.replace(/\\/g, "/")}'\nfile '${endCardVid.replace(/\\/g, "/")}'\n`,
  );
  const silent = path.join(TMP, "silent-live.mp4");
  await execFileAsync("ffmpeg", [
    "-y",
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    concatList,
    "-c",
    "copy",
    silent,
  ]);

  const mp4Out = path.join(OUT_DIR, `${ad.slug}.mp4`);
  const publicOut = path.join(PUBLIC_ADS, `${ad.slug}.mp4`);
  console.log(`[${mode}] Muxing VO…`);
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    silent,
    "-i",
    audio,
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-profile:v",
    "high",
    "-level",
    "4.0",
    "-r",
    "30",
    "-b:v",
    "3500k",
    "-maxrate",
    "3500k",
    "-bufsize",
    "7000k",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-ar",
    "44100",
    "-ac",
    "2",
    "-shortest",
    "-movflags",
    "+faststart",
    mp4Out,
  ]);

  fs.copyFileSync(mp4Out, publicOut);
  fs.writeFileSync(
    path.join(PUBLIC_ADS, `${ad.slug}.json`),
    JSON.stringify(
      {
        slug: ad.slug,
        type: `${mode}_walkthrough_live_ui`,
        title: ad.title,
        voiceover: ad.voiceover,
        caption: ad.caption,
        landing: ad.landing,
        source: "playwright_screen_recording",
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  const finalDur = await audioDuration(mp4Out);
  console.log("OK", publicOut, `duration=${finalDur.toFixed(1)}s`);
  return { mode, publicOut, caption: ad.caption, landing: ad.landing };
}

async function main() {
  const mode = parseMode();
  await buildOne(mode);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
