/**
 * Export Mode + per-engine ad kits (captions for IG/FB/TT/YT) to Desktop Apex Ops.
 *
 *   npx tsx scripts/export-mode-ad-kits.ts
 */
import fs from "fs";
import path from "path";
import os from "os";
import {
  MODE_AD_CATALOG,
  engineLanding,
  modeLanding,
  type ModeAdPack,
  type ModeEngineAd,
} from "../config/mode-catalog";

const DESKTOP =
  process.env.APEX_OPS ||
  path.join(os.homedir(), "OneDrive", "Desktop", "Apex Ops");
const OUT = path.join(DESKTOP, "8 - God Mode Marketing", "MODE-ADS");
const DOCS = path.join(__dirname, "..", "docs", "marketing");

function igModeCaption(m: ModeAdPack): string {
  const lines = m.engines
    .slice(0, 6)
    .map((e) => `· ${e.title} ($${e.price})`)
    .join("\n");
  const more =
    m.engines.length > 6 ? `\n· +${m.engines.length - 6} more inside` : "";
  return `${m.modeHook}

${m.name} — ${m.tagline}

What's inside:
${lines}${more}

${m.priceRange} · Stripe · ~60s · optional +$49 human review
${m.disclaimer}

👉 ${modeLanding(m.goPath, m.id)}

${m.hashtags}`;
}

function igEngineCaption(m: ModeAdPack, e: ModeEngineAd): string {
  return `${e.hook}

${m.name} · ${e.title} · $${e.price}
For: ${e.audience}

Sample intake ready → Stripe → draft on the page + email
${m.disclaimer}

👉 ${engineLanding(e.slug, m.id)}

Or full Mode: https://apexcapitaladmin.com${m.goPath}

${m.hashtags}`;
}

function fbFromIg(ig: string): string {
  return ig
    .replace(/utm_source=instagram/g, "utm_source=facebook")
    .replace(/#\w+/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function ttFromIg(ig: string, url: string): string {
  const hook = ig.split("\n")[0];
  return `${hook}

Real Apex site — sample intake → Stripe → draft ~60s

${url.replace("utm_source=instagram", "utm_source=tiktok").replace(/^https?:\/\//, "")}

#apexcapital #smallbusiness #adminautomation`;
}

function writeCaptions(folder: string, ig: string, landing: string, title: string) {
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "CAPTION_INSTAGRAM.txt"), ig + "\n");
  fs.writeFileSync(path.join(folder, "CAPTION_FACEBOOK.txt"), fbFromIg(ig) + "\n");
  fs.writeFileSync(
    path.join(folder, "CAPTION_TIKTOK.txt"),
    ttFromIg(ig, landing) + "\n",
  );
  fs.writeFileSync(
    path.join(folder, "YOUTUBE_SHORTS.txt"),
    `TITLE:\n${title} | Apex Capital Admin Services\n\nDESCRIPTION:\n${ig.replace(/utm_source=instagram/g, "utm_source=youtube")}\n\n#Shorts\n`,
  );
  fs.writeFileSync(
    path.join(folder, "LINKS.txt"),
    [
      `instagram: ${landing}`,
      `facebook: ${landing.replace("utm_source=instagram", "utm_source=facebook")}`,
      `tiktok: ${landing.replace("utm_source=instagram", "utm_source=tiktok")}`,
      `youtube: ${landing.replace("utm_source=instagram", "utm_source=youtube")}`,
      `mode hub: use goPath from MODE.txt`,
    ].join("\n") + "\n",
  );
}

function writeMarkdownCatalog(): string {
  const parts: string[] = [
    "# Mode Ad Catalog — Advertise every Mode + every engine inside",
    "",
    "Source of truth: `config/mode-catalog.ts`",
    "Phone kits: `Desktop\\Apex Ops\\8 - God Mode Marketing\\MODE-ADS\\`",
    "",
    "**Rule:** Mode overview ads → `/go/{mode}`. Engine ads → `/engine/{slug}?sample=1`. One Mode per creative.",
    "",
  ];
  for (const m of MODE_AD_CATALOG) {
    parts.push(`## ${m.name}`);
    parts.push(`- **Audience:** ${m.audience}`);
    parts.push(`- **Money URL:** \`${m.goPath}\``);
    parts.push(`- **Hub:** \`${m.hubPath}\``);
    parts.push(`- **Hook:** ${m.modeHook}`);
    parts.push(`- **Disclaimer:** ${m.disclaimer}`);
    parts.push("");
    parts.push("| Engine | Price | Hook | Primary |");
    parts.push("|--------|------:|------|---------|");
    for (const e of m.engines) {
      parts.push(
        `| ${e.title} | $${e.price} | ${e.hook} | ${e.isPrimary ? "YES → " + m.goPath : ""} |`,
      );
    }
    parts.push("");
  }
  return parts.join("\n");
}

function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const md = writeMarkdownCatalog();
  fs.writeFileSync(path.join(DOCS, "MODE_AD_CATALOG.md"), md);
  fs.writeFileSync(path.join(OUT, "MODE_AD_CATALOG.md"), md);

  let packs = 0;
  for (const m of MODE_AD_CATALOG) {
    const modeFolder = path.join(OUT, `${m.id.toUpperCase()}-MODE`);
    const modeIg = igModeCaption(m);
    const modeLand = modeLanding(m.goPath, m.id);
    writeCaptions(
      path.join(modeFolder, "00-MODE-OVERVIEW"),
      modeIg,
      modeLand,
      m.name,
    );
    fs.writeFileSync(
      path.join(modeFolder, "00-MODE-OVERVIEW", "MODE.txt"),
      [
        `MODE: ${m.name}`,
        `GO: https://apexcapitaladmin.com${m.goPath}`,
        `HUB: https://apexcapitaladmin.com${m.hubPath}`,
        `ENGINES: ${m.engines.length}`,
        `POST ORDER: Mode overview first, then primary engine, then rest`,
        "",
        "VIDEO TIP: Use Mode walkthrough MP4 if available:",
        `  public/ads/apex-${m.id}-walkthrough.mp4`,
        "  else use engine wave1 MP4 or screen record /go path",
      ].join("\n") + "\n",
    );

    m.engines.forEach((e, i) => {
      const n = String(i + 1).padStart(2, "0");
      const folder = path.join(
        modeFolder,
        `${n}-${e.slug}${e.isPrimary ? "-PRIMARY" : ""}`,
      );
      writeCaptions(
        folder,
        igEngineCaption(m, e),
        engineLanding(e.slug, m.id),
        `${m.name} — ${e.title}`,
      );
      fs.writeFileSync(
        path.join(folder, "WHEN.txt"),
        e.isPrimary
          ? "Post right after Mode overview. This is the money engine.\n"
          : "Post as follow-up Reel same week. Deep-link sample intake.\n",
      );
      packs++;
    });
    packs++;
  }

  fs.writeFileSync(
    path.join(OUT, "READ_ME_FIRST.txt"),
    [
      "MODE ADS — EVERY MODE + EVERY ENGINE",
      "",
      "How to advertise:",
      "1) Post 00-MODE-OVERVIEW (lists what's inside + /go/{mode})",
      "2) Post PRIMARY engine next (sample intake deep link)",
      "3) Rotate remaining engines across the week",
      "4) Cross-post IG → FB → TikTok → YouTube Shorts (same captions files)",
      "",
      "Folders:",
      "  GRANT-MODE/",
      "  NOTICE-MODE/",
      "  BID-MODE/",
      "  OFFER-MODE/",
      "",
      `Packs written: ${packs}`,
      "Full catalog: MODE_AD_CATALOG.md",
      "",
      "Never send cold ads to the 525-engine homepage wall.",
    ].join("\n") + "\n",
  );

  console.log("OK docs →", path.join(DOCS, "MODE_AD_CATALOG.md"));
  console.log("OK phone →", OUT);
  console.log("Packs:", packs);
}

main();
