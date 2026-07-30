/**
 * Apex site walkthrough Reel — narrates the whole product, not one engine SKU.
 *
 * Why engine ads underperform: they pitch one $24 tool with text-on-navy.
 * This creative walks the live product story: who we are → Grant Mode →
 * how it works → 500 engines / Concierge → trust → why Apex → CTA.
 *
 * Usage:
 *   npx tsx scripts/generate-site-walkthrough-ad.ts
 *   npx tsx scripts/generate-site-walkthrough-ad.ts --force
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
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
const TMP = path.join(ROOT, ".video-ads-tmp", "walkthrough");
const WIDTH = 1080;
const HEIGHT = 1920;
const NAVY = "#0b1f3a";
const GOLD = "#c9a227";
const CREAM = "#f7f5f0";
const SLUG = "apex-site-walkthrough";
const FORCE = process.argv.includes("--force");

const LANDING =
  "https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_walkthrough&utm_content=site-tour";

/** Full walkthrough VO — talks them through the site and the offer (~45s). */
const VOICEOVER = `Deadline on the line and a blank page in front of you?

This is Apex Capital Admin Services — apexcapitaladmin.com.

We build draft-ready grant, contract, and ops paperwork — fast.

On the homepage, start with Grant Mode: a funder-style narrative from your facts in about a minute, twenty-four dollars, Stripe checkout.

Need more? Five hundred engines — NDAs, budgets, offers, ops playbooks — or ask Concierge to find the right one.

How it works: choose, intake, pay, draft. On-page and email in under sixty seconds. Optional forty-nine dollar human review when stakes are high.

No fake testimonials. No funding promises. Just structure you can revise.

Why us: speed, Stripe security, a full catalog, and a clear path when you're stuck.

Go to apexcapitaladmin.com slash go slash grant. Use the sample intake. See the draft.

Apex. Draft-ready. Deadline-ready.`;

const CAPTION = `Apex Capital Admin Services — the whole site, in one Reel.

Grant Mode · 500 engines · Concierge finder
Stripe checkout · draft in ~60s · optional +$49 human review
No fake testimonials. Drafts, not guarantees.

Why come to us: you need structure before the deadline — not another blank doc.

👉 ${LANDING}

#ApexCapital #GrantMode #Nonprofit #GrantWriting #BusinessOps`;

type Scene = {
  badge: string;
  title: string;
  lines: string[];
};

const SCENES: Scene[] = [
  {
    badge: "APEX CAPITAL ADMIN",
    title: "Stop the blank page.",
    lines: ["Draft-ready grant, contract,", "and ops deliverables."],
  },
  {
    badge: "GRANT MODE",
    title: "Where the money starts.",
    lines: ["Narrative from your facts ~60s.", "$24 · Stripe · sample intake."],
  },
  {
    badge: "500 ENGINES + CONCIERGE",
    title: "The full catalog.",
    lines: ["NDAs · budgets · offers · ops.", "Or ask: Find an engine."],
  },
  {
    badge: "HOW IT WORKS",
    title: "Choose → Pay → Draft.",
    lines: ["Under 60 seconds.", "Optional +$49 human review."],
  },
  {
    badge: "WHY APEX",
    title: "Speed. Trust. Path.",
    lines: ["No fake testimonials.", "Structure before the deadline."],
  },
  {
    badge: "START NOW",
    title: "apexcapitaladmin.com/go/grant",
    lines: ["Sample intake → see the draft.", "Then decide."],
  },
];

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function resolveFont(): string {
  for (const f of [
    "C:/Windows/Fonts/seguisb.ttf",
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
  ]) {
    if (fs.existsSync(f)) return f;
  }
  throw new Error("No bold font found");
}

async function renderScene(scene: Scene, index: number): Promise<string> {
  const out = path.join(TMP, `scene-${index}.png`);
  const lineSvg = scene.lines
    .map(
      (l, i) =>
        `<text x="540" y="${980 + i * 78}" text-anchor="middle" font-family="Georgia, serif" font-size="42" fill="${CREAM}" opacity="0.92">${escapeXml(l)}</text>`,
    )
    .join("\n");

  const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#15294a"/>
      <stop offset="55%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="#070f1c"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  <rect x="72" y="72" width="48" height="2" fill="${GOLD}" opacity="0.7"/>
  <rect x="72" y="72" width="2" height="48" fill="${GOLD}" opacity="0.7"/>
  <rect x="${WIDTH - 120}" y="72" width="48" height="2" fill="${GOLD}" opacity="0.7"/>
  <rect x="${WIDTH - 74}" y="72" width="2" height="48" fill="${GOLD}" opacity="0.7"/>
  <circle cx="540" cy="260" r="64" fill="none" stroke="${GOLD}" stroke-width="2.5"/>
  <text x="540" y="278" text-anchor="middle" font-family="Georgia, serif" font-size="72" fill="${CREAM}">A</text>
  <text x="540" y="400" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" letter-spacing="6" fill="${GOLD}">${escapeXml(scene.badge)}</text>
  <text x="540" y="560" text-anchor="middle" font-family="Georgia, serif" font-size="56" fill="${CREAM}">${escapeXml(scene.title)}</text>
  <rect x="420" y="610" width="240" height="2" fill="${GOLD}" opacity="0.65"/>
  ${lineSvg}
  <text x="540" y="1780" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" fill="${GOLD}" opacity="0.85">apexcapitaladmin.com</text>
  <text x="540" y="1840" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="${CREAM}" opacity="0.45">${index + 1} / ${SCENES.length}</text>
</svg>`.trim();

  await sharp(Buffer.from(svg)).png().toFile(out);
  return out;
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

async function main() {
  fs.mkdirSync(TMP, { recursive: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.mkdirSync(PUBLIC_ADS, { recursive: true });

  const mp4Out = path.join(OUT_DIR, `${SLUG}.mp4`);
  const publicOut = path.join(PUBLIC_ADS, `${SLUG}.mp4`);
  const audio = path.join(TMP, "vo.mp3");
  const metaJson = path.join(PUBLIC_ADS, `${SLUG}.json`);

  console.log("Rendering walkthrough scenes…");
  const scenes: string[] = [];
  for (let i = 0; i < SCENES.length; i++) {
    scenes.push(await renderScene(SCENES[i], i));
  }

  console.log("Synthesizing voiceover…");
  await synthesize(VOICEOVER, audio);
  const dur = await audioDuration(audio);
  const per = Math.max(2.8, dur / SCENES.length);
  console.log(`Audio ${dur.toFixed(1)}s · ~${per.toFixed(1)}s per scene`);

  // Build concat demuxer with timed stills (Ken Burns via zoompan briefly)
  const font = resolveFont();
  const localFont = path.join(TMP, "font.ttf");
  fs.copyFileSync(font, localFont);

  const listFile = path.join(TMP, "concat.txt");
  const listLines: string[] = [];
  for (let i = 0; i < scenes.length; i++) {
    const d = i === scenes.length - 1 ? Math.max(per, dur - per * (scenes.length - 1)) : per;
    listLines.push(`file '${scenes[i].replace(/\\/g, "/")}'`);
    listLines.push(`duration ${d.toFixed(3)}`);
  }
  listLines.push(`file '${scenes[scenes.length - 1].replace(/\\/g, "/")}'`);
  fs.writeFileSync(listFile, listLines.join("\n"), "utf8");

  const silentVideo = path.join(TMP, "silent.mp4");
  console.log("Encoding video…");
  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFile,
      "-vf",
      `scale=${WIDTH}:${HEIGHT}:force_original_aspect_ratio=decrease,pad=${WIDTH}:${HEIGHT}:(ow-iw)/2:(oh-ih)/2,format=yuv420p`,
      "-r",
      "30",
      "-pix_fmt",
      "yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      silentVideo,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-i",
      silentVideo,
      "-i",
      audio,
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-shortest",
      "-movflags",
      "+faststart",
      mp4Out,
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );

  fs.copyFileSync(mp4Out, publicOut);
  fs.writeFileSync(
    metaJson,
    JSON.stringify(
      {
        slug: SLUG,
        type: "site_walkthrough",
        title: "Apex Capital — Full Site Walkthrough",
        voiceover: VOICEOVER,
        caption: CAPTION,
        landing: LANDING,
        scenes: SCENES.map((s) => s.badge),
        createdAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log("OK", publicOut);
  console.log("CAPTION_FILE", metaJson);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
