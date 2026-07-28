/**
 * generate-video-ads.ts (run via tsx, matching this repo's generate-ads.ts / prisma/seed.ts convention)
 *
 * Converts 500_video_ads_export.json (produced by `npm run generate-ads`) into finished,
 * upload-ready vertical (1080x1920) MP4 video ads: a branded navy/gold background, the 5
 * screenOverlayText lines staggered on screen, and a synthesised voiceover of voiceoverScript.
 *
 * Pipeline (100% free, local, no API keys):
 *  - TTS:    msedge-tts (free wrapper around Microsoft Edge's neural "Read Aloud" voices)
 *  - Visual: sharp (renders the static navy-gradient brand background once, no per-video cost)
 *  - Video:  ffmpeg (drawtext staggers each overlay line in time with the voiceover, muxes audio)
 *
 * Requirements: Node.js, ffmpeg + ffprobe on PATH (install via `winget install Gyan.FFmpeg`).
 *
 * Usage:
 *   npm run generate-video-ads                  # render all 500 (resumable — skips existing .mp4s)
 *   npm run generate-video-ads -- --premium --limit 12   # institutional motion template + Aria VO
 *   npm run generate-video-ads -- --premium --force       # rebuild all premium (slow, high quality)
 *   npm run generate-video-ads -- --slugs a,b,c  # render only specific slugs
 *   npm run generate-video-ads -- --voice en-US-AriaNeural
 *
 * Output:
 *   video-ads-output/{slug}.mp4          (standard)
 *   video-ads-premium/{slug}.mp4         (--premium)
 */
import fs from "fs";
import path from "path";
import os from "os";
import { execFile } from "child_process";
import { promisify } from "util";
import sharp from "sharp";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";
import {
  isRateLimitError,
  sleep,
  withExponentialBackoff,
} from "./lib/api-utils";

const execFileAsync = promisify(execFile);

/** Pause between TTS requests to reduce Edge throttling during long batch runs. */
const TTS_THROTTLE_MS = 750;

// `npm run` sometimes hands scripts a PATH stripped of user/machine-level entries
// (observed in this environment). Make sure winget-installed ffmpeg/ffprobe shims resolve.
const wingetLinks = path.join(os.homedir(), "AppData", "Local", "Microsoft", "WinGet", "Links");
if (fs.existsSync(wingetLinks) && !process.env.PATH?.includes(wingetLinks)) {
  process.env.PATH = `${wingetLinks};${process.env.PATH ?? ""}`;
}

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
const OUTPUT_DIR = path.join(ROOT, "video-ads-output");
const TMP_DIR = path.join(ROOT, ".video-ads-tmp");
const BG_PATH = path.join(TMP_DIR, "background-1080x1920.png");

const WIDTH = 1080;
const HEIGHT = 1920;
const NAVY = "#0b1f3a";
const NAVY_LIGHT = "#15294a";
const GOLD = "#c9a227";

const DEFAULT_VOICE = "en-US-AriaNeural"; // premium neural voice (clearer than Guy)
const MIN_STAGE_SEC = 1.9;
const END_PAD_SEC = 0.8;
const MAX_TEXT_WIDTH_PX = WIDTH - 160; // 80px margin each side
const PREMIUM_OUTPUT_DIR = path.join(ROOT, "video-ads-premium");
const PREMIUM_BG_PATH = path.join(TMP_DIR, "background-premium-1080x1920.png");

const FONT_CANDIDATES = [
  "C:/Windows/Fonts/seguisb.ttf", // Segoe UI Semibold
  "C:/Windows/Fonts/segoeuib.ttf", // Segoe UI Bold
  "C:/Windows/Fonts/arialbd.ttf", // Arial Bold
];

/**
 * Windows font paths (e.g. "C:/Windows/Fonts/...") contain a drive-letter colon, which
 * collides with ffmpeg's own ':' option separator inside a -filter_complex string.
 * Quoting/backslash-escaping that colon proved unreliable in practice, so instead we copy
 * the font next to the other per-run temp files and reference it with a path relative to
 * ffmpeg's working directory (ROOT) — no colon ever appears in that string.
 */
function resolveFont(): string {
  for (const candidate of FONT_CANDIDATES) {
    if (fs.existsSync(candidate)) return candidate;
  }
  throw new Error(
    "No suitable bold sans-serif font file found (checked Segoe UI Semibold/Bold, Arial Bold). " +
      "Edit FONT_CANDIDATES in generate-video-ads.ts to point at an installed TTF."
  );
}

function ensureLocalFontCopy(sourceFont: string): string {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const localFont = path.join(TMP_DIR, "brand-font.ttf");
  if (!fs.existsSync(localFont)) {
    fs.copyFileSync(sourceFont, localFont);
  }
  return localFont;
}

/** Convert an absolute path (must be on the same drive as ROOT) to a forward-slash path relative to ROOT. */
function toFilterPath(absPath: string): string {
  return path.relative(ROOT, absPath).replace(/\\/g, "/");
}

/**
 * msedge-tts builds its SSML request via raw string interpolation and does not escape
 * input itself (see package README) — an unescaped "&" (e.g. "Micro-SaaS & Automation")
 * produces invalid XML that the server silently rejects mid-stream. Escape before sending.
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts: {
    limit?: number;
    slugs?: string[];
    voice: string;
    premium: boolean;
    force: boolean;
  } = { voice: DEFAULT_VOICE, premium: false, force: false };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit") opts.limit = parseInt(args[++i], 10);
    else if (args[i] === "--slugs") opts.slugs = args[++i].split(",").map((s) => s.trim());
    else if (args[i] === "--voice") opts.voice = args[++i];
    else if (args[i] === "--premium") opts.premium = true;
    else if (args[i] === "--force") opts.force = true;
  }
  // Premium defaults to Aria unless user overrides --voice after/before; keep Aria as default.
  if (opts.premium && opts.voice === DEFAULT_VOICE) {
    opts.voice = "en-US-AriaNeural";
  }
  return opts;
}

async function ensureBackground(premium: boolean): Promise<string> {
  fs.mkdirSync(TMP_DIR, { recursive: true });
  const outPath = premium ? PREMIUM_BG_PATH : BG_PATH;
  if (fs.existsSync(outPath)) return outPath;

  // Richer institutional frame for premium: deep navy field, soft vignette,
  // gold ring, thin rule, subtle corner brackets — still brand-safe, not "AI purple".
  const svg = premium
    ? `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="28%" r="65%">
      <stop offset="0%" stop-color="#1a3358"/>
      <stop offset="55%" stop-color="${NAVY}"/>
      <stop offset="100%" stop-color="#070f1c"/>
    </radialGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.06"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="${GOLD}" stop-opacity="0.05"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#sheen)"/>
  <circle cx="${WIDTH / 2}" cy="210" r="70" fill="none" stroke="${GOLD}" stroke-width="2.5" opacity="0.85"/>
  <circle cx="${WIDTH / 2}" cy="210" r="52" fill="none" stroke="${GOLD}" stroke-width="1" opacity="0.35"/>
  <rect x="72" y="72" width="48" height="2" fill="${GOLD}" opacity="0.55"/>
  <rect x="72" y="72" width="2" height="48" fill="${GOLD}" opacity="0.55"/>
  <rect x="${WIDTH - 120}" y="72" width="48" height="2" fill="${GOLD}" opacity="0.55"/>
  <rect x="${WIDTH - 74}" y="72" width="2" height="48" fill="${GOLD}" opacity="0.55"/>
  <rect x="72" y="${HEIGHT - 74}" width="48" height="2" fill="${GOLD}" opacity="0.4"/>
  <rect x="72" y="${HEIGHT - 120}" width="2" height="48" fill="${GOLD}" opacity="0.4"/>
  <rect x="${WIDTH - 120}" y="${HEIGHT - 74}" width="48" height="2" fill="${GOLD}" opacity="0.4"/>
  <rect x="${WIDTH - 74}" y="${HEIGHT - 120}" width="2" height="48" fill="${GOLD}" opacity="0.4"/>
  <rect x="${WIDTH / 2 - 120}" y="${HEIGHT - 168}" width="240" height="1.5" fill="${GOLD}" opacity="0.55"/>
</svg>`.trim()
    : `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.25" y2="1">
      <stop offset="0%" stop-color="${NAVY_LIGHT}"/>
      <stop offset="100%" stop-color="${NAVY}"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <circle cx="${WIDTH / 2}" cy="230" r="58" fill="none" stroke="${GOLD}" stroke-width="5" opacity="0.9"/>
  <rect x="${WIDTH / 2 - 90}" y="${HEIGHT - 172}" width="180" height="2" fill="${GOLD}" opacity="0.6"/>
</svg>`.trim();

  await sharp(Buffer.from(svg)).png().toFile(outPath);
  return outPath;
}

/** Split a single "word" with no natural break points (e.g. a bare URL/slug) into maxChars-sized chunks. */
function hardBreak(word: string, maxChars: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < word.length; i += maxChars) {
    chunks.push(word.slice(i, i + maxChars));
  }
  return chunks;
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (word.length > maxChars) {
      // e.g. a long URL/slug with no spaces — can't be word-wrapped, so hard-break it.
      if (current) {
        lines.push(current);
        current = "";
      }
      const pieces = hardBreak(word, maxChars);
      lines.push(...pieces.slice(0, -1));
      current = pieces[pieces.length - 1];
      continue;
    }
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Pick a font size + line-wrapped text so arbitrary-length overlay lines stay legible and on-screen. */
function layoutLine(text: string): { fontSize: number; text: string; lineCount: number } {
  const candidateSizes = [72, 64, 56, 48, 42, 38, 34, 30, 26];
  const avgCharWidthRatio = 0.56; // heuristic for a bold sans-serif at a given px size
  for (const fontSize of candidateSizes) {
    const maxChars = Math.max(4, Math.floor(MAX_TEXT_WIDTH_PX / (fontSize * avgCharWidthRatio)));
    const lines = wrapText(text, maxChars);
    if (lines.length <= 3 && lines.every((l) => l.length <= maxChars)) {
      return { fontSize, text: lines.join("\n"), lineCount: lines.length };
    }
  }
  const fontSize = 22;
  const maxChars = Math.max(4, Math.floor(MAX_TEXT_WIDTH_PX / (fontSize * avgCharWidthRatio)));
  const lines = wrapText(text, maxChars);
  return { fontSize, text: lines.join("\n"), lineCount: lines.length };
}

async function getAudioDurationSeconds(file: string): Promise<number> {
  const { stdout } = await execFileAsync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "csv=p=0",
    file,
  ]);
  const seconds = parseFloat(stdout.trim());
  if (!Number.isFinite(seconds) || seconds <= 0) {
    throw new Error(`Could not determine audio duration for ${file} (got "${stdout.trim()}")`);
  }
  return seconds;
}

async function synthesizeVoiceover(
  tts: MsEdgeTTS,
  text: string,
  dirPath: string,
  opts: { force?: boolean; premium?: boolean } = {},
): Promise<string> {
  fs.mkdirSync(dirPath, { recursive: true });
  const filename = opts.premium ? "audio-premium.mp3" : "audio.mp3";
  const existing = path.join(dirPath, filename);
  if (!opts.force && fs.existsSync(existing) && fs.statSync(existing).size > 0) {
    return existing;
  }
  // Clear stale TTS output so msedge-tts writes a fresh file with our name.
  for (const stale of fs.readdirSync(dirPath)) {
    if (stale.endsWith(".mp3") && (opts.force || opts.premium)) {
      try {
        fs.unlinkSync(path.join(dirPath, stale));
      } catch {
        /* ignore */
      }
    }
  }

  return withExponentialBackoff(
    async () => {
      const { audioFilePath } = await tts.toFile(
        dirPath,
        escapeXml(text),
        opts.premium ? { rate: 0.92, pitch: "-1Hz" } : undefined,
      );
      if (!audioFilePath || !fs.existsSync(audioFilePath) || fs.statSync(audioFilePath).size === 0) {
        throw new Error("Edge TTS returned empty audio file");
      }
      if (path.basename(audioFilePath) !== filename) {
        fs.copyFileSync(audioFilePath, existing);
        return existing;
      }
      return audioFilePath;
    },
    {
      label: `edge-tts:${path.basename(dirPath)}`,
      maxAttempts: 5,
      baseDelayMs: 1000,
      maxDelayMs: 45_000,
    },
  );
}

/** Fade alpha expression for drawtext: ease in/out over ~0.35s within [start,end]. */
function fadeAlphaExpr(start: number, end: number): string {
  const fade = 0.35;
  // ffmpeg enable already gates visibility; alpha softens the cut.
  return `if(lt(t\\,${start.toFixed(2)}+${fade})\\,(t-${start.toFixed(2)})/${fade}\\,if(gt(t\\,${end.toFixed(2)}-${fade})\\,(${end.toFixed(2)}-t)/${fade}\\,1))`;
}

function stageFontSize(index: number, base: number, premium: boolean): number {
  if (!premium) return base;
  // Hierarchy: hook huge → title → price punchy → delivery → URL quiet
  const boosts = [1.15, 1.05, 1.35, 0.9, 0.85];
  return Math.round(base * (boosts[index] ?? 1));
}

async function renderVideo(
  ad: AdScript,
  voicePath: string,
  fontFile: string,
  outPath: string,
  opts: { premium?: boolean; bgPath?: string } = {},
): Promise<void> {
  const premium = !!opts.premium;
  const bgPath = opts.bgPath || BG_PATH;
  const audioDuration = await getAudioDurationSeconds(voicePath);
  const stageCount = ad.screenOverlayText.length;
  const stageDuration = Math.max(audioDuration / stageCount, premium ? 2.1 : MIN_STAGE_SEC);
  const totalDuration = stageDuration * stageCount + (premium ? 1.0 : END_PAD_SEC);

  const fontFileRel = toFilterPath(fontFile);
  const dirForTmp = path.dirname(voicePath);
  const filters: string[] = [];

  // Ken Burns: slow push-in on a still frame → feels like a designed motion graphic.
  if (premium) {
    const frames = Math.max(1, Math.ceil(totalDuration * 30));
    filters.push(
      `[0:v]scale=1200:2133:force_original_aspect_ratio=increase,` +
        `crop=1080:1920,zoompan=z='min(1.08\\,1+0.00035*on)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':` +
        `d=${frames}:s=1080x1920:fps=30[vbase]`,
    );
  }

  let prevLabel = premium ? "vbase" : "0:v";

  const monogramFile = path.join(dirForTmp, "monogram.txt");
  fs.writeFileSync(monogramFile, "A", "utf-8");
  const monogramFileRel = toFilterPath(monogramFile);
  const monoY = premium ? 210 : 230;
  filters.push(
    `[${prevLabel}]drawtext=fontfile=${fontFileRel}:textfile=${monogramFileRel}:fontcolor=${GOLD}:` +
      `fontsize=${premium ? 72 : 64}:x=(w-text_w)/2:y=${monoY}-(text_h/2)[vmono]`,
  );
  prevLabel = "vmono";

  for (let i = 0; i < stageCount; i++) {
    const layout = layoutLine(ad.screenOverlayText[i]);
    const fontSize = stageFontSize(i, layout.fontSize, premium);
    const lineFile = path.join(dirForTmp, `line${i}.txt`);
    fs.writeFileSync(lineFile, layout.text, "utf-8");
    const lineFileRel = toFilterPath(lineFile);

    const start = i * stageDuration;
    const end =
      i === stageCount - 1
        ? stageDuration * stageCount + (premium ? 1.0 : END_PAD_SEC)
        : (i + 1) * stageDuration;
    const outLabel = i === stageCount - 1 ? "vout" : `v${i}`;
    const color = i === 2 && premium ? "#f0d78c" : GOLD; // price line slightly brighter
    const alpha = premium ? `:alpha='${fadeAlphaExpr(start, end)}'` : "";

    filters.push(
      `[${prevLabel}]drawtext=fontfile=${fontFileRel}:textfile=${lineFileRel}:fontcolor=${color}:` +
        `fontsize=${fontSize}:line_spacing=${premium ? 18 : 14}:x=(w-text_w)/2:y=(h-text_h)/2:` +
        `enable='between(t\\,${start.toFixed(2)}\\,${end.toFixed(2)})'${alpha}[${outLabel}]`,
    );
    prevLabel = outLabel;
  }

  const brandFile = path.join(dirForTmp, "brand.txt");
  fs.writeFileSync(brandFile, "APEX CAPITAL ADMIN SERVICES", "utf-8");
  const brandFileRel = toFilterPath(brandFile);
  filters.push(
    `[vout]drawtext=fontfile=${fontFileRel}:textfile=${brandFileRel}:fontcolor=${GOLD}:` +
      `fontsize=${premium ? 28 : 26}:x=(w-text_w)/2:y=h-130:alpha=${premium ? 0.9 : 0.85}[vbrand]`,
  );

  // Soft bottom vignette bar feel via a second faint rule label for premium end card clarity.
  if (premium) {
    const tagFile = path.join(dirForTmp, "tagline.txt");
    fs.writeFileSync(tagFile, "INSTANT PROFESSIONAL DELIVERABLES", "utf-8");
    const tagFileRel = toFilterPath(tagFile);
    filters.push(
      `[vbrand]drawtext=fontfile=${fontFileRel}:textfile=${tagFileRel}:fontcolor=${GOLD}:` +
        `fontsize=20:x=(w-text_w)/2:y=h-95:alpha=0.55[vfinal]`,
    );
  } else {
    filters.push(`[vbrand]null[vfinal]`);
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  const tmpOutPath = `${outPath}.tmp.mp4`;

  await execFileAsync(
    "ffmpeg",
    [
      "-y",
      "-loop",
      "1",
      "-i",
      bgPath,
      "-i",
      voicePath,
      "-filter_complex",
      filters.join(";"),
      "-map",
      "[vfinal]",
      "-map",
      "1:a:0",
      "-t",
      totalDuration.toFixed(2),
      "-r",
      "30",
      "-pix_fmt",
      "yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      premium ? "slow" : "veryfast",
      "-crf",
      premium ? "17" : "20",
      "-c:a",
      "aac",
      "-b:a",
      premium ? "192k" : "128k",
      "-movflags",
      "+faststart",
      tmpOutPath,
    ],
    { cwd: ROOT, maxBuffer: 1024 * 1024 * 32 },
  );

  fs.renameSync(tmpOutPath, outPath);
}

async function main() {
  const opts = parseArgs();

  if (!fs.existsSync(INPUT_JSON)) {
    console.error(
      `Could not find ${INPUT_JSON}. Run "npm run generate-ads" first to produce it.`,
    );
    process.exit(1);
  }

  const fontFile = ensureLocalFontCopy(resolveFont());
  const outDir = opts.premium ? PREMIUM_OUTPUT_DIR : OUTPUT_DIR;
  console.log(`Mode: ${opts.premium ? "PREMIUM" : "standard"}`);
  console.log(`Using font: ${fontFile}`);
  console.log(`Using voice: ${opts.voice}`);
  console.log(`Output dir: ${outDir}`);

  const bgPath = await ensureBackground(opts.premium);
  console.log(`Background ready: ${bgPath}`);

  let ads: AdScript[] = JSON.parse(fs.readFileSync(INPUT_JSON, "utf-8"));
  if (opts.slugs) {
    const wanted = new Set(opts.slugs);
    ads = ads.filter((ad) => wanted.has(ad.slug));
  }

  fs.mkdirSync(outDir, { recursive: true });

  const pending = ads.filter(
    (ad) => opts.force || !fs.existsSync(path.join(outDir, `${ad.slug}.mp4`)),
  );
  const toProcess = opts.limit ? pending.slice(0, opts.limit) : pending;

  console.log(
    `${ads.length} ads in input, ${ads.length - pending.length} already rendered, ` +
      `${toProcess.length} to render this run.`,
  );

  const tts = new MsEdgeTTS();
  await tts.setMetadata(
    opts.voice,
    opts.premium
      ? OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3
      : OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
  );

  let succeeded = 0;
  let failed = 0;
  const timings: number[] = [];

  for (const [index, ad] of toProcess.entries()) {
    const startedAt = Date.now();
    const outPath = path.join(outDir, `${ad.slug}.mp4`);
    const adTmpDir = path.join(TMP_DIR, opts.premium ? `${ad.slug}-premium` : ad.slug);
    try {
      if (index > 0) await sleep(opts.premium ? 1100 : TTS_THROTTLE_MS);

      const voicePath = await synthesizeVoiceover(tts, ad.voiceoverScript, adTmpDir, {
        force: opts.force || opts.premium,
        premium: opts.premium,
      });
      await renderVideo(ad, voicePath, fontFile, outPath, {
        premium: opts.premium,
        bgPath,
      });
      const seconds = (Date.now() - startedAt) / 1000;
      timings.push(seconds);
      succeeded++;
      console.log(
        `[${index + 1}/${toProcess.length}] OK  ${ad.slug}.mp4  (${seconds.toFixed(1)}s)`,
      );
    } catch (err) {
      failed++;
      const msg = (err as Error).message;
      if (isRateLimitError(err)) {
        console.error(
          `[${index + 1}/${toProcess.length}] RATE-LIMIT ${ad.slug}: ${msg} — will retry on next run`,
        );
        await sleep(10_000);
      } else {
        console.error(`[${index + 1}/${toProcess.length}] FAIL ${ad.slug}:`, msg);
      }
    }
  }

  tts.close();

  const avg = timings.length ? timings.reduce((a, b) => a + b, 0) / timings.length : 0;
  console.log("");
  console.log(
    `Done. Succeeded: ${succeeded}, Failed: ${failed}, Skipped (already existed): ${ads.length - pending.length}`,
  );
  if (avg > 0) {
    console.log(`Average render time this run: ${avg.toFixed(1)}s/video.`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("FATAL:", err);
  process.exit(1);
});
