/**
 * Sync Wave 1 (Grant Mode + premium) MP4s into public/ads/ for live HTTPS hosting.
 * Meta / IG Graph can then use PUBLIC_AD_VIDEO_BASE_URL=https://apexcapitaladmin.com/ads
 *
 * Usage: npx tsx scripts/sync-wave1-ads-public.ts
 *        npm run ads:wave1:live
 */
import fs from "fs";
import path from "path";
import { FLAGSHIP_ENGINES } from "../config/flagship";

const ROOT = path.join(__dirname, "..");
const PREMIUM_DIR = path.join(ROOT, "video-ads-premium");
const STANDARD_DIR = path.join(ROOT, "video-ads-output");
const OUT_DIR = path.join(ROOT, "public", "ads");
const SITE = "https://apexcapitaladmin.com";

const GRANT = FLAGSHIP_ENGINES.filter((f) => f.badge === "Grant Mode").map(
  (f) => f.slug,
);

function listMp4s(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mp4") && !f.includes(".tmp."))
    .map((f) => f.replace(/\.mp4$/i, ""));
}

function srcFor(slug: string): string {
  const p = path.join(PREMIUM_DIR, `${slug}.mp4`);
  if (fs.existsSync(p)) return p;
  const s = path.join(STANDARD_DIR, `${slug}.mp4`);
  if (fs.existsSync(s)) return s;
  throw new Error(`Missing MP4: ${slug}`);
}

function main() {
  const premium = listMp4s(PREMIUM_DIR);
  const slugs = [...GRANT, ...premium.filter((s) => !GRANT.includes(s))];

  fs.mkdirSync(OUT_DIR, { recursive: true });
  // remove old mp4s not in wave1
  for (const f of fs.readdirSync(OUT_DIR)) {
    if (!f.endsWith(".mp4")) continue;
    const slug = f.replace(/\.mp4$/i, "");
    if (!slugs.includes(slug)) {
      fs.unlinkSync(path.join(OUT_DIR, f));
    }
  }

  const manifest: {
    slug: string;
    tier: string;
    url: string;
    bytes: number;
  }[] = [];

  for (const slug of slugs) {
    const src = srcFor(slug);
    const dest = path.join(OUT_DIR, `${slug}.mp4`);
    fs.copyFileSync(src, dest);
    const bytes = fs.statSync(dest).size;
    const tier = GRANT.includes(slug)
      ? "grant"
      : fs.existsSync(path.join(PREMIUM_DIR, `${slug}.mp4`))
        ? "premium"
        : "standard";
    manifest.push({
      slug,
      tier,
      url: `${SITE}/ads/${slug}.mp4`,
      bytes,
    });
    console.log(`✓ ${tier.padEnd(8)} ${slug}`);
  }

  fs.writeFileSync(
    path.join(OUT_DIR, "wave1.json"),
    JSON.stringify(
      {
        updatedAt: new Date().toISOString(),
        publicBase: `${SITE}/ads`,
        count: manifest.length,
        items: manifest,
      },
      null,
      2,
    ),
    "utf-8",
  );

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Apex Wave 1 Ads</title>
  <meta name="robots" content="noindex" />
  <style>
    body{font-family:system-ui,sans-serif;max-width:720px;margin:2rem auto;padding:0 1rem;background:#f7f5f0;color:#0b1f3a}
    a{color:#0b1f3a} li{margin:.4rem 0} .t{font-size:12px;opacity:.6}
  </style>
</head>
<body>
  <h1>Wave 1 — Grant Mode + Premium</h1>
  <p>Public base: <code>${SITE}/ads</code> · ${manifest.length} videos</p>
  <p class="t">For Instagram Graph: PUBLIC_AD_VIDEO_BASE_URL=${SITE}/ads</p>
  <ol>
    ${manifest
      .map(
        (m) =>
          `<li><strong>${m.tier}</strong> — <a href="/ads/${m.slug}.mp4">${m.slug}.mp4</a></li>`,
      )
      .join("\n    ")}
  </ol>
</body>
</html>`;
  fs.writeFileSync(path.join(OUT_DIR, "index.html"), indexHtml, "utf-8");

  const mb = manifest.reduce((a, m) => a + m.bytes, 0) / (1024 * 1024);
  console.log(`\nSynced ${manifest.length} videos (${mb.toFixed(1)} MB) → public/ads/`);
  console.log(`Live base after deploy: ${SITE}/ads`);
  console.log(`Index: ${SITE}/ads/index.html`);
  console.log(`Manifest: ${SITE}/ads/wave1.json`);
}

main();
