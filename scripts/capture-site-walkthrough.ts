/**
 * Record a real mobile walkthrough of the live Apex site (Playwright).
 * Output: .video-ads-tmp/walkthrough/ui-capture.webm (+ per-beat clips)
 *
 * Usage:
 *   npx tsx scripts/capture-site-walkthrough.ts
 */
import fs from "fs";
import path from "path";
import { chromium, type Page } from "playwright";

const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, ".video-ads-tmp", "walkthrough", "ui");
const WIDTH = 1080;
const HEIGHT = 1920;
const BASE = "https://apexcapitaladmin.com";

type Beat = {
  name: string;
  url: string;
  scrollPx?: number;
  holdMs?: number;
};

const BEATS: Beat[] = [
  { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 2800 },
  { name: "02-home-grant", url: `${BASE}/`, scrollPx: 900, holdMs: 3200 },
  { name: "03-grant-mode", url: `${BASE}/grant-mode`, scrollPx: 400, holdMs: 3500 },
  {
    name: "04-engine-intake",
    url: `${BASE}/engine/grant-proposal-narrative-generator?sample=1&focus=intake`,
    scrollPx: 500,
    holdMs: 4000,
  },
  { name: "05-how-it-works", url: `${BASE}/how-it-works`, scrollPx: 350, holdMs: 3500 },
  { name: "06-catalog", url: `${BASE}/?view=all#catalog`, scrollPx: 200, holdMs: 3200 },
  { name: "07-about", url: `${BASE}/about`, scrollPx: 300, holdMs: 2800 },
  { name: "08-go-grant", url: `${BASE}/go/grant`, scrollPx: 0, holdMs: 2500 },
];

async function settle(page: Page) {
  await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => undefined);
  await page.waitForTimeout(600);
  // Dismiss cookie / chat noise if present
  for (const sel of [
    'button:has-text("Accept")',
    'button:has-text("Got it")',
    '[aria-label="Close"]',
  ]) {
    const el = page.locator(sel).first();
    if (await el.isVisible().catch(() => false)) {
      await el.click({ timeout: 1000 }).catch(() => undefined);
    }
  }
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });

  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: OUT_DIR,
      size: { width: WIDTH, height: HEIGHT },
    },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 ApexWalkthroughBot/1.0",
  });

  const page = await context.newPage();
  const manifest: { name: string; url: string; file?: string }[] = [];

  console.log("Recording live site walkthrough…");
  for (const beat of BEATS) {
    console.log(`  ${beat.name} → ${beat.url}`);
    await page.goto(beat.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await settle(page);
    if (beat.scrollPx && beat.scrollPx > 0) {
      await page.evaluate(async (px) => {
        const step = 40;
        for (let y = 0; y < px; y += step) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 16));
        }
        window.scrollTo(0, px);
      }, beat.scrollPx);
      await page.waitForTimeout(400);
    }
    await page.waitForTimeout(beat.holdMs ?? 2500);
    // Still frame backup
    const shot = path.join(OUT_DIR, `${beat.name}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    manifest.push({ name: beat.name, url: beat.url, file: shot });
  }

  await context.close();
  await browser.close();

  // Playwright names video files randomly — rename the recorded webm
  const videos = fs
    .readdirSync(OUT_DIR)
    .filter((f) => f.endsWith(".webm"))
    .map((f) => path.join(OUT_DIR, f));
  if (!videos.length) {
    throw new Error("No Playwright video recorded");
  }
  const dest = path.join(OUT_DIR, "full-tour.webm");
  fs.renameSync(videos[0], dest);

  fs.writeFileSync(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify({ capturedAt: new Date().toISOString(), beats: manifest, video: dest }, null, 2),
  );
  console.log("OK video", dest);
  console.log("OK frames", manifest.length);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
