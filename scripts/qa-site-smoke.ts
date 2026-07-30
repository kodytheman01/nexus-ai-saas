/**
 * Production smoke + journey audit for Apex Capital Admin Services.
 * Safe by design: capped concurrency, no checkout purchases, no 100k flood.
 *
 * Usage: npx tsx scripts/qa-site-smoke.ts
 * Optional: BASE_URL=https://apexcapitaladmin.com npx tsx scripts/qa-site-smoke.ts
 */
import "dotenv/config";

const BASE = (process.env.BASE_URL || "https://apexcapitaladmin.com").replace(
  /\/$/,
  "",
);
const CONCURRENCY = 8;
const TIMEOUT_MS = 20_000;

const STATIC_PATHS = [
  "/",
  "/grant-mode",
  "/notice-mode",
  "/bid-mode",
  "/offer-mode",
  "/go/grant",
  "/go/notice",
  "/go/bid",
  "/go/offer",
  "/about",
  "/privacy",
  "/terms",
  "/how-it-works",
  "/engines",
  "/admin/login",
  "/robots.txt",
  "/sitemap.xml",
  "/favicon.ico",
];

const FLAGSHIP_SLUGS = [
  "grant-proposal-narrative-generator",
  "grant-proposal-outline-generator",
  "grant-compliance-reporting-checklist",
  "nonprofit-budget-allocation-calculator",
  "nda-generator",
  "sales-proposal-generator",
  "freelance-client-proposal-generator",
  "startup-runway-and-burn-rate-calculator",
  "privacy-policy-generator",
  "ironclad-contract-factory",
  "pay-or-quit-notice-drafter",
  "notice-to-vacate-drafter",
  "security-deposit-itemization-letter",
  "tenant-repair-request-letter",
  "contractor-proposal-drafter",
  "change-order-drafter",
  "job-offer-letter-drafter",
  "offer-rejection-letter",
];

type Result = {
  path: string;
  status: number;
  ok: boolean;
  ms: number;
  error?: string;
  notes?: string[];
};

async function fetchOne(path: string): Promise<Result> {
  const url = path.startsWith("http") ? path : `${BASE}${path}`;
  const started = Date.now();
  const notes: string[] = [];
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        "User-Agent": "ApexQASmoke/1.0 (+ops; not a load test)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });
    const ms = Date.now() - started;
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("text/html")) {
      const body = await res.text();
      if (body.includes("Application error") || body.includes("Internal Server Error")) {
        notes.push("html looks like an error page");
      }
      if (body.includes("No engines available yet")) {
        notes.push("catalog empty warning");
      }
      if (path === "/" && !body.includes("Flagships") && !body.includes("flagships")) {
        notes.push("homepage missing Flagships chip text");
      }
      if (
        path === "/" &&
        !body.includes("500 specialized engines") &&
        !body.includes("500+ specialized engines")
      ) {
        notes.push("homepage missing engines hero copy");
      }
      if (
        path.startsWith("/engine/nda") &&
        body.includes("verify against the live FOA")
      ) {
        notes.push("FOA bleed on NDA page");
      }
      if (
        path.includes("grant-proposal") &&
        !body.includes("FOA") &&
        res.ok
      ) {
        notes.push("grant page may be missing FOA checklist copy");
      }
    }
    const ok = res.status >= 200 && res.status < 400 && notes.every((n) => !n.includes("error") && !n.includes("FOA bleed"));
    return {
      path,
      status: res.status,
      ok: res.status >= 200 && res.status < 400 && !notes.some((n) => n.includes("FOA bleed") || n.includes("error page")),
      ms,
      notes: notes.length ? notes : undefined,
    };
  } catch (e) {
    return {
      path,
      status: 0,
      ok: false,
      ms: Date.now() - started,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = [];
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
  return out;
}

async function sampleEngineSlugsFromSitemap(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE}/sitemap.xml`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const xml = await res.text();
    const matches = [...xml.matchAll(/\/engine\/([a-z0-9-]+)/gi)].map((m) => m[1]);
    const unique = Array.from(new Set(matches));
    // Stratified sample: first 40 + last 20 + every Nth for coverage
    if (unique.length <= 80) return unique;
    const step = Math.max(1, Math.floor(unique.length / 60));
    const sampled = new Set<string>();
    for (let i = 0; i < unique.length; i += step) sampled.add(unique[i]);
    unique.slice(0, 20).forEach((s) => sampled.add(s));
    unique.slice(-20).forEach((s) => sampled.add(s));
    return Array.from(sampled);
  } catch {
    return [];
  }
}

async function main() {
  console.log(`\nApex QA smoke — ${BASE}`);
  console.log("Safe mode: no purchases, capped concurrency, no visitor flood.\n");

  const sitemapSlugs = await sampleEngineSlugsFromSitemap();
  const enginePaths = Array.from(
    new Set([...FLAGSHIP_SLUGS, ...sitemapSlugs]),
  ).map((s) => `/engine/${s}`);

  const paths = [...STATIC_PATHS, ...enginePaths];
  console.log(`Checking ${paths.length} URLs (concurrency ${CONCURRENCY})…\n`);

  const results = await mapPool(paths, CONCURRENCY, fetchOne);
  const failed = results.filter((r) => !r.ok);
  const slow = results.filter((r) => r.ok && r.ms > 3000);
  const warned = results.filter((r) => r.ok && r.notes?.length);

  const avg =
    results.reduce((a, r) => a + r.ms, 0) / Math.max(1, results.length);
  const p95 = [...results.map((r) => r.ms)].sort((a, b) => a - b)[
    Math.floor(results.length * 0.95)
  ];

  console.log("── Summary ──");
  console.log(`OK:      ${results.length - failed.length}/${results.length}`);
  console.log(`Failed:  ${failed.length}`);
  console.log(`Slow>3s: ${slow.length}`);
  console.log(`Notes:   ${warned.length}`);
  console.log(`Avg:     ${Math.round(avg)}ms  p95: ${p95}ms\n`);

  // Funnel model: if 100k visitors hit a healthy site with these failure rates
  const failRate = failed.length / results.length;
  const estimatedBrokenJourneys = Math.round(100_000 * failRate);
  console.log("── 100k-visitor stress model (not a live flood) ──");
  console.log(
    `Observed failure rate on sampled routes: ${(failRate * 100).toFixed(2)}%`,
  );
  console.log(
    `Projected broken landings at 100k sessions: ~${estimatedBrokenJourneys}`,
  );
  console.log(
    `If avg page is ${Math.round(avg)}ms, 100k sequential would be impossible;`,
);
  console.log(
    `with CDN/edge, concurrent capacity depends on Netlify/Neon/Stripe — not simulated here.\n`,
  );

  if (failed.length) {
    console.log("── Failures ──");
    for (const r of failed) {
      console.log(
        `FAIL ${r.status || "ERR"} ${r.path} (${r.ms}ms)${r.error ? ` — ${r.error}` : ""}${r.notes ? ` — ${r.notes.join("; ")}` : ""}`,
      );
    }
    console.log("");
  }

  if (slow.length) {
    console.log("── Slow (>3s) ──");
    for (const r of slow.slice(0, 20)) {
      console.log(`SLOW ${r.ms}ms ${r.path}`);
    }
    if (slow.length > 20) console.log(`…and ${slow.length - 20} more`);
    console.log("");
  }

  if (warned.length) {
    console.log("── Notes ──");
    for (const r of warned) {
      console.log(`NOTE ${r.path}: ${r.notes?.join("; ")}`);
    }
    console.log("");
  }

  if (failed.length) process.exitCode = 1;
  else console.log("All sampled routes passed.\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
