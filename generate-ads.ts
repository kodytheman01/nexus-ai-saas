/**
 * generate-ads.js (run via tsx, matching this repo's prisma/seed.ts convention)
 *
 * Generates ad creative scripts (voiceover, on-screen overlay text, social caption)
 * for every engine in config/engines.ts, for use in paid video ad production.
 *
 * Output: 500_video_ads_export.json (gitignored — this is generated data, not source)
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

// A few rotating phrasing variants so 500 ads aren't near-identical (ad platforms
// can flag repetitive/duplicate creative). Chosen deterministically per engine below.
const HOOKS = [
  (category: string) => `Stop chasing outcomes in ${category} through raw effort alone.`,
  (category: string) => `Tired of ${category} work that eats your week for pennies of progress?`,
  (category: string) => `Most people overcomplicate ${category}. It doesn't have to be this hard.`,
  (category: string) => `What if ${category} results took seconds, not weeks?`,
];

const BODIES = [
  (title: string, description: string) =>
    `Real scale doesn't come from pushing harder—it comes from stepping into systems built for instant execution. Introducing the ${title}. ${description} Plug your details in, sign, and let automated pipelines handle post-purchase delivery in seconds.`,
  (title: string, description: string) =>
    `Meet the ${title}. ${description} No guesswork, no waiting on a specialist—just enter your inputs and get a production-ready result back immediately.`,
  (title: string, description: string) =>
    `The ${title} was built for exactly this. ${description} Sign once, submit your details, and receive your output the moment it's ready.`,
  (title: string, description: string) =>
    `That's what the ${title} solves. ${description} Enter your details, confirm your order, and the system takes it from there.`,
];

const CLOSERS = [
  "The architecture is built. Claim your outcome now.",
  "The system is already running. All you have to do is start it.",
  "It's ready when you are. Get instant access below.",
  "No waiting list, no onboarding call—just go.",
];

const OVERLAY_HOOKS = [
  (category: string) => `HOOK: Eliminate ${category} Friction`,
  (category: string) => `HOOK: ${capitalize(category)}, Solved`,
  (category: string) => `HOOK: Skip the ${category} Grind`,
  (category: string) => `HOOK: Instant ${capitalize(category)} Results`,
];

const CTA_LINES = [
  (category: string, title: string) => `Stop working against friction. Command your ${category} operations with the ${title}.`,
  (category: string, title: string) => `Why fight ${category} manually when the ${title} does it in seconds?`,
  (category: string, title: string) => `${title}: built to make ${category} effortless.`,
  (category: string, title: string) => `Your ${category} bottleneck ends here — meet the ${title}.`,
];

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

/** Deterministic hash of a string to a non-negative integer, so variant selection is reproducible. */
function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function formatPrice(priceInUSD: number): string {
  return priceInUSD.toFixed(2);
}

function buildAdScript(engine: EngineSeed): AdScript {
  const title = engine.title || "Execution Engine";
  const category = engine.category || "operations";
  const description = engine.description || "High-utility automated business logic.";
  const slug = engine.slug || "app";
  const price = formatPrice(engine.priceInUSD ?? 29.99);

  const variantIndex = hashString(slug) % HOOKS.length;
  const hook = HOOKS[variantIndex](category);
  const body = BODIES[variantIndex](title, description);
  const closer = CLOSERS[variantIndex];
  const overlayHook = OVERLAY_HOOKS[variantIndex](category);
  const ctaLine = CTA_LINES[variantIndex](category, title);

  const targetUrl = `${SITE_URL}/engine/${slug}`;

  return {
    engineTitle: title,
    slug,
    targetUrl,
    voiceoverScript: `${hook} ${body} ${closer}`,
    screenOverlayText: [
      overlayHook,
      `SERVICE: ${title}`,
      `PRICE: $${price} USD`,
      `DELIVERY: Instant via Email & Google Drive`,
      `CTA: apexcapitaladmin.com/engine/${slug}`,
    ],
    socialCaption: `${ctaLine}\n\n⚡ Instant Output\n🔒 Secured E-Sign Agreement\n📁 Automated Delivery to Gmail & Drive\n\n👉 Claim Execution: ${targetUrl}`,
  };
}

function main() {
  const ads = ENGINES_SEED_DATA.map(buildAdScript);

  const outputPath = path.join(__dirname, "500_video_ads_export.json");
  fs.writeFileSync(outputPath, JSON.stringify(ads, null, 2), "utf-8");

  console.log(`Generated ${ads.length} ad scripts -> ${outputPath}`);
}

main();
