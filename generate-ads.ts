/**
 * generate-ads.ts
 *
 * Generates short-form, platform-ready ad scripts for every engine.
 * Optimized for TikTok / Reels / Shorts: punchy hooks, clean overlays
 * (no "HOOK:" / "SERVICE:" labels), and ~12–18s voiceovers.
 *
 * Usage: npm run generate-ads
 */
import fs from "fs";
import path from "path";
import { ENGINES_SEED_DATA, type EngineSeed } from "./config/engines";

type AdScript = {
  engineTitle: string;
  slug: string;
  targetUrl: string;
  voiceoverScript: string;
  screenOverlayText: string[];
  socialCaption: string;
};

const SITE_URL = "https://apexcapitaladmin.com";

/** Strip catalog prefixes like "Engine 185: " so creatives read like a real brand. */
function cleanTitle(title: string): string {
  return title.replace(/^Engine\s+\d+:\s*/i, "").trim();
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatPrice(priceInUSD: number): string {
  return Number.isInteger(priceInUSD) ? String(priceInUSD) : priceInUSD.toFixed(2);
}

/** One-sentence benefit from description, truncated for VO length. */
function shortBenefit(description: string): string {
  const cleaned = description.replace(/\s+/g, " ").trim();
  const sentence = cleaned.split(/(?<=[.!?])\s+/)[0] || cleaned;
  return sentence.length > 140 ? `${sentence.slice(0, 137).trim()}…` : sentence;
}

const HOOKS = [
  (category: string) => `Stop wasting hours on ${category}.`,
  (category: string) => `${capitalize(category)} shouldn't eat your whole week.`,
  (category: string) => `There's a faster way to handle ${category}.`,
  (category: string) => `Still doing ${category} the hard way?`,
];

const OVERLAY_HOOKS = [
  (category: string) => `Eliminate ${capitalize(category)} Friction`,
  (category: string) => `${capitalize(category)}. Solved.`,
  (category: string) => `Skip the ${capitalize(category)} Grind`,
  (category: string) => `Instant ${capitalize(category)} Results`,
];

const CAPTION_OPENERS = [
  (category: string, title: string) =>
    `${title} — built to remove ${category} friction in seconds.`,
  (category: string, title: string) =>
    `Why grind through ${category} manually? Use ${title}.`,
  (category: string, title: string) =>
    `${title}: professional ${category} output, delivered instantly.`,
  (category: string, title: string) =>
    `Your ${category} bottleneck ends here. Meet ${title}.`,
];

function buildAdScript(engine: EngineSeed): AdScript {
  const title = cleanTitle(engine.title || "Execution Engine");
  const category = (engine.category || "operations").toLowerCase();
  const description = engine.description || "Professional deliverable, generated instantly.";
  const slug = engine.slug || "app";
  const price = formatPrice(engine.priceInUSD ?? 29.99);
  const benefit = shortBenefit(description);

  const v = hashString(slug) % HOOKS.length;
  const hook = HOOKS[v](category);
  const overlayHook = OVERLAY_HOOKS[v](category);
  const captionOpen = CAPTION_OPENERS[v](category, title);
  const targetUrl = `${SITE_URL}/engine/${slug}`;

  // Keep VO short enough for Reels/TikTok (~12–18s spoken).
  const voiceoverScript = [
    hook,
    `This is ${title}.`,
    benefit,
    "Enter your details, check out, and get delivery by email in seconds.",
    "Link in the caption — start now.",
  ].join(" ");

  return {
    engineTitle: title,
    slug,
    targetUrl,
    voiceoverScript,
    // Clean on-screen lines — no HOOK:/SERVICE:/CTA: labels (those look amateur).
    screenOverlayText: [
      overlayHook,
      title,
      `$${price}`,
      "Instant email delivery",
      "apexcapitaladmin.com",
    ],
    socialCaption: `${captionOpen}

Instant output
Secured checkout
Delivered to your inbox

${targetUrl}`,
  };
}

function main() {
  const ads = ENGINES_SEED_DATA.map(buildAdScript);
  const outputPath = path.join(__dirname, "500_video_ads_export.json");
  fs.writeFileSync(outputPath, JSON.stringify(ads, null, 2), "utf-8");
  console.log(`Generated ${ads.length} premium ad scripts → ${outputPath}`);
}

main();
