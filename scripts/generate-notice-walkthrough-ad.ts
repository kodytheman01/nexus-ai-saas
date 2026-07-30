/**
 * Notice Mode walkthrough Reel — real screen recording + VO → /go/notice
 *
 *   npx tsx scripts/generate-notice-walkthrough-ad.ts --force --capture
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
const TMP = path.join(ROOT, ".video-ads-tmp", "notice-walkthrough");
const UI_DIR = path.join(TMP, "ui");
const WIDTH = 1080;
const HEIGHT = 1920;
const NAVY = "#0b1f3a";
const GOLD = "#c9a227";
const CREAM = "#f7f5f0";
const SLUG = "apex-notice-walkthrough";
const FORCE = process.argv.includes("--force");
const DO_CAPTURE = process.argv.includes("--capture");

const LANDING =
  "https://apexcapitaladmin.com/go/notice?utm_source=instagram&utm_medium=reel&utm_campaign=apex_notice_walkthrough&utm_content=site-tour-live";

const VOICEOVER = `Unpaid rent. A blank notice template. And a deadline.

This is Apex Capital Admin Services — apexcapitaladmin.com. You're looking at the real site.

Homepage first — then Notice Mode. Landlord pay-or-quit, vacate, deposit drafts. Tenant letters too.

State packs for Texas, Florida, and California — local-law cues, not legal advice. Confirm with counsel before you serve.

Open the pay-or-quit intake — sample facts ready — Stripe checkout, draft on the page and in your email.

How it works: choose, intake, pay, draft. Optional human review when stakes are high.

Go to apexcapitaladmin.com slash go slash notice. Use the sample. See the draft.

Apex. Draft-ready. Deadline-ready.`;

const CAPTION = `Watch the real Apex Notice Mode — not a stock template.

Homepage → Notice Mode → TX/FL/CA packs → pay-or-quit intake → /go/notice

$24 drafts · Stripe · ~60 seconds · optional +$49 human review
Not legal advice. Confirm local rules before you serve.

👉 ${LANDING}

#ApexCapital #NoticeMode #Landlord #PropertyManagement #PayOrQuit`;

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

async function makeEndCard(): Promise<string> {
  const out = path.join(TMP, "end-card.png");
  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${NAVY}"/>
  <circle cx="540" cy="520" r="70" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <text x="540" y="545" text-anchor="middle" font-family="Georgia, serif" font-size="78" fill="${CREAM}">A</text>
  <text x="540" y="700" text-anchor="middle" font-family="Georgia, serif" font-size="48" fill="${CREAM}">Start Notice Mode</text>
  <text x="540" y="780" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" fill="${GOLD}">apexcapitaladmin.com/go/notice</text>
  <text x="540" y="900" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="${CREAM}" opacity="0.8">Sample intake · see the draft · then decide</text>
</svg>`.trim();
  await sharp(Buffer.from(svg)).png().toFile(out);
  return out;
}

async function makeLowerThird(label: string, file: string): Promise<string> {
  const svg = `
<svg width="${WIDTH}" height="220" xmlns="http://www.w3.org/2000/svg">
  <rect x="60" y="40" width="960" height="140" rx="12" fill="${NAVY}" fill-opacity="0.88"/>
  <rect x="60" y="40" width="10" height="140" fill="${GOLD}"/>
  <text x="100" y="125" font-family="Segoe UI, Arial, sans-serif" font-size="42" fill="${CREAM}">${escapeXml(label)}</text>
</svg>`.trim();
  await sharp(Buffer.from(svg)).png().toFile(file);
  return file;
}

function runCapture() {
  console.log("Capturing Notice Mode (Playwright)…");
  const r = spawnSync(
    process.execPath,
    [
      path.join(ROOT, "node_modules", "tsx", "dist", "cli.mjs"),
      path.join(ROOT, "scripts", "capture-notice-walkthrough.ts"),
    ],
    { cwd: ROOT, stdio: "inherit", shell: false, env: process.env },
  );
  if (r.status !== 0) {
    const r2 = spawnSync(
      "npx",
      ["tsx", "scripts/capture-notice-walkthrough.ts"],
      { cwd: ROOT, stdio: "inherit", shell: true, env: process.env },
    );
    if (r2.status !== 0) {
      throw new Error("Notice Mode capture failed");
    }
  }
}

async function main() {
  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_ADS, { recursive: true });

  if (DO_CAPTURE || !fs.existsSync(path.join(UI_DIR, "full-tour.webm"))) {
    runCapture();
  }

  const uiWebm = path.join(UI_DIR, "full-tour.webm");
  if (!fs.existsSync(uiWebm)) {
    throw new Error(`Missing UI capture at ${uiWebm}. Run with --capture.`);
  }

  const audio = path.join(TMP, "vo-live.mp3");
  console.log("Synthesizing voiceover…");
  await synthesize(VOICEOVER, audio);
  const voDur = await audioDuration(audio);
  console.log(`VO ${voDur.toFixed(1)}s`);

  const uiMp4 = path.join(TMP, "ui-raw.mp4");
  console.log("Converting UI capture…");
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

  const endCard = await makeEndCard();
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

  const ltHome = await makeLowerThird(
    "Homepage — Apex Capital Admin",
    path.join(TMP, "lt1.png"),
  );
  const ltNotice = await makeLowerThird(
    "Notice Mode — money path",
    path.join(TMP, "lt2.png"),
  );
  const ltState = await makeLowerThird(
    "TX · FL · CA state packs",
    path.join(TMP, "lt3.png"),
  );
  const ltGo = await makeLowerThird(
    "/go/notice — pay-or-quit",
    path.join(TMP, "lt4.png"),
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
    ltHome,
    "-i",
    ltNotice,
    "-i",
    ltState,
    "-i",
    ltGo,
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

  const mp4Out = path.join(OUT_DIR, `${SLUG}.mp4`);
  const publicOut = path.join(PUBLIC_ADS, `${SLUG}.mp4`);
  console.log("Muxing VO…");
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
    path.join(PUBLIC_ADS, `${SLUG}.json`),
    JSON.stringify(
      {
        slug: SLUG,
        type: "notice_walkthrough_live_ui",
        title: "Apex Capital — Notice Mode Walkthrough",
        voiceover: VOICEOVER,
        caption: CAPTION,
        landing: LANDING,
        source: "playwright_screen_recording",
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
  );

  const finalDur = await audioDuration(mp4Out);
  console.log("OK", publicOut, `duration=${finalDur.toFixed(1)}s`);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
