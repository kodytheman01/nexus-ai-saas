/**
 * Record a real mobile walkthrough for any Apex Mode on the live site.
 *
 * Usage:
 *   npx tsx scripts/capture-mode-walkthrough.ts --mode bid
 *   npx tsx scripts/capture-mode-walkthrough.ts --mode offer
 *   npx tsx scripts/capture-mode-walkthrough.ts --mode grant
 *   npx tsx scripts/capture-mode-walkthrough.ts --mode notice
 *   npx tsx scripts/capture-mode-walkthrough.ts --mode vision
 */
import fs from "fs";
import path from "path";
import { chromium, type Page } from "playwright";

const ROOT = path.join(__dirname, "..");
const WIDTH = 1080;
const HEIGHT = 1920;
const BASE = "https://apexcapitaladmin.com";

type Beat = {
  name: string;
  url: string;
  scrollPx?: number;
  holdMs?: number;
};

type ModeKey = "bid" | "offer" | "grant" | "notice" | "vision";

const MODES: Record<
  ModeKey,
  { tmpFolder: string; beats: Beat[] }
> = {
  bid: {
    tmpFolder: "bid-walkthrough",
    beats: [
      { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 2800 },
      { name: "02-modes", url: `${BASE}/modes`, scrollPx: 200, holdMs: 3200 },
      {
        name: "03-bid-mode",
        url: `${BASE}/bid-mode`,
        scrollPx: 400,
        holdMs: 3500,
      },
      {
        name: "04-engine-intake",
        url: `${BASE}/engine/contractor-proposal-drafter?sample=1&focus=intake`,
        scrollPx: 500,
        holdMs: 4000,
      },
      {
        name: "05-platform",
        url: `${BASE}/platform`,
        scrollPx: 300,
        holdMs: 3000,
      },
      { name: "06-go-bid", url: `${BASE}/go/bid`, scrollPx: 0, holdMs: 2500 },
    ],
  },
  offer: {
    tmpFolder: "offer-walkthrough",
    beats: [
      { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 2800 },
      { name: "02-modes", url: `${BASE}/modes`, scrollPx: 200, holdMs: 3200 },
      {
        name: "03-offer-mode",
        url: `${BASE}/offer-mode`,
        scrollPx: 400,
        holdMs: 3500,
      },
      {
        name: "04-engine-intake",
        url: `${BASE}/engine/job-offer-letter-drafter?sample=1&focus=intake`,
        scrollPx: 500,
        holdMs: 4000,
      },
      {
        name: "05-how-it-works",
        url: `${BASE}/how-it-works`,
        scrollPx: 350,
        holdMs: 3000,
      },
      { name: "06-go-offer", url: `${BASE}/go/offer`, scrollPx: 0, holdMs: 2500 },
    ],
  },
  grant: {
    tmpFolder: "grant-walkthrough",
    beats: [
      { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 2800 },
      {
        name: "02-grant-mode",
        url: `${BASE}/grant-mode`,
        scrollPx: 400,
        holdMs: 3500,
      },
      {
        name: "03-engine-intake",
        url: `${BASE}/engine/grant-proposal-narrative-generator?sample=1&focus=intake`,
        scrollPx: 500,
        holdMs: 4000,
      },
      {
        name: "04-how-it-works",
        url: `${BASE}/how-it-works`,
        scrollPx: 350,
        holdMs: 3000,
      },
      { name: "05-go-grant", url: `${BASE}/go/grant`, scrollPx: 0, holdMs: 2500 },
    ],
  },
  notice: {
    tmpFolder: "notice-walkthrough",
    beats: [
      { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 2800 },
      {
        name: "02-notice-mode",
        url: `${BASE}/notice-mode`,
        scrollPx: 400,
        holdMs: 3500,
      },
      {
        name: "03-state-packs",
        url: `${BASE}/notice-mode#state-packs`,
        scrollPx: 200,
        holdMs: 3200,
      },
      {
        name: "04-engine-intake",
        url: `${BASE}/engine/pay-or-quit-notice-drafter?sample=1&focus=intake&state=TX`,
        scrollPx: 500,
        holdMs: 4000,
      },
      {
        name: "05-how-it-works",
        url: `${BASE}/how-it-works`,
        scrollPx: 350,
        holdMs: 3200,
      },
      { name: "06-go-notice", url: `${BASE}/go/notice`, scrollPx: 0, holdMs: 2500 },
    ],
  },
  vision: {
    tmpFolder: "vision-walkthrough",
    beats: [
      { name: "01-home-hero", url: `${BASE}/`, scrollPx: 0, holdMs: 3000 },
      { name: "02-vision", url: `${BASE}/vision`, scrollPx: 400, holdMs: 4000 },
      { name: "03-modes", url: `${BASE}/modes`, scrollPx: 300, holdMs: 3500 },
      {
        name: "04-platform",
        url: `${BASE}/platform`,
        scrollPx: 300,
        holdMs: 3200,
      },
      {
        name: "05-how-it-works",
        url: `${BASE}/how-it-works`,
        scrollPx: 350,
        holdMs: 3200,
      },
      { name: "06-go-grant", url: `${BASE}/go/grant`, scrollPx: 0, holdMs: 2500 },
    ],
  },
};

function parseMode(): ModeKey {
  const idx = process.argv.indexOf("--mode");
  const raw = (idx >= 0 ? process.argv[idx + 1] : process.argv[2]) || "bid";
  const mode = raw.replace(/^--mode=/, "").toLowerCase() as ModeKey;
  if (!(mode in MODES)) {
    throw new Error(
      `Unknown mode "${raw}". Use: bid | offer | grant | notice | vision`,
    );
  }
  return mode;
}

async function settle(page: Page) {
  await page
    .waitForLoadState("networkidle", { timeout: 25000 })
    .catch(() => undefined);
  await page.waitForTimeout(600);
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
  const mode = parseMode();
  const cfg = MODES[mode];
  const OUT_DIR = path.join(ROOT, ".video-ads-tmp", cfg.tmpFolder, "ui");

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

  console.log(`Recording ${mode} walkthrough…`);
  for (const beat of cfg.beats) {
    console.log(`  ${beat.name} → ${beat.url}`);
    await page.goto(beat.url, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });
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
    const shot = path.join(OUT_DIR, `${beat.name}.png`);
    await page.screenshot({ path: shot, fullPage: false });
    manifest.push({ name: beat.name, url: beat.url, file: shot });
  }

  await context.close();
  await browser.close();

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
    JSON.stringify(
      {
        mode,
        capturedAt: new Date().toISOString(),
        beats: manifest,
        video: dest,
      },
      null,
      2,
    ),
  );
  console.log("OK video", dest);
  console.log("OK frames", manifest.length);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
