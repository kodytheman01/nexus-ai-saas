/**
 * Checkout override — simulates completed Stripe sessions without live charges.
 *
 * Usage:
 *   npm run test:checkout-override
 *   npm run test:checkout-override -- --all
 *   npm run test:checkout-override -- --all --live
 *
 * --all   = every flagship engine
 * --live  = after DB upsert, POST /api/regenerate on production so Netlify OpenAI runs
 */
import "dotenv/config";
import { FLAGSHIP_ENGINES } from "../config/flagship";
import { db } from "../lib/db";
import { getIntakeExample } from "../lib/intake-examples";
import { processEngineExecution } from "../lib/process-engine";

const TEST_EMAIL = "checkout-override@apexcapitaladmin.com";
const LIVE_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

const args = new Set(process.argv.slice(2));
const runAll = args.has("--all");
const useLive = args.has("--live");

function sessionIdFor(slug: string): string {
  return `cs_test_mock_${slug.slice(0, 40)}`;
}

async function upsertAndProcess(slug: string, userInput: string) {
  const sessionId = sessionIdFor(slug);
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine || !engine.isActive) {
    throw new Error(`Engine "${slug}" not found or inactive.`);
  }

  await db.engineRun.upsert({
    where: { stripeSessionId: sessionId },
    create: {
      stripeSessionId: sessionId,
      userEmail: TEST_EMAIL,
      engineSlug: slug,
      inputParameters: userInput,
      status: "pending",
      humanReview: false,
      allowanceTokens: useLive ? 1 : 1,
      attribution: JSON.stringify({
        utm_source: "checkout_override_script",
        utm_medium: useLive ? "live_regen" : "local_cli",
      }),
    },
    update: {
      userEmail: TEST_EMAIL,
      engineSlug: slug,
      inputParameters: userInput,
      status: "pending",
      outputData: null,
      humanReview: false,
      allowanceTokens: 1,
    },
  });

  if (useLive) {
    const res = await fetch(`${LIVE_ORIGIN}/api/regenerate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stripeSessionId: sessionId,
        newUserInput: userInput,
      }),
    });
    const data = (await res.json()) as { success?: boolean; error?: string };
    if (!res.ok) {
      throw new Error(data.error || `Live regenerate HTTP ${res.status}`);
    }
    // Poll until completed/failed (Netlify generation)
    let run = null;
    for (let i = 0; i < 45; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      run = await db.engineRun.findUnique({
        where: { stripeSessionId: sessionId },
        select: {
          id: true,
          status: true,
          stripeSessionId: true,
          engineSlug: true,
          outputData: true,
          updatedAt: true,
        },
      });
      if (run && (run.status === "completed" || run.status === "failed")) break;
    }
    return run;
  }

  await processEngineExecution({
    stripeSessionId: sessionId,
    engineSlug: slug,
    userInput,
  });

  return db.engineRun.findUnique({
    where: { stripeSessionId: sessionId },
    select: {
      id: true,
      status: true,
      stripeSessionId: true,
      engineSlug: true,
      outputData: true,
      updatedAt: true,
    },
  });
}

async function main() {
  const targets = runAll
    ? FLAGSHIP_ENGINES.map((f) => f.slug)
    : ["grant-proposal-narrative-generator"];

  console.log("=== Checkout override ===");
  console.log(`Mode:    ${useLive ? "LIVE regenerate (Netlify OpenAI)" : "local process"}`);
  console.log(`Engines: ${targets.length}${runAll ? " (all flagships)" : ""}`);
  console.log(
    `OpenAI:  ${process.env.OPENAI_API_KEY ? "local key set" : "local key missing"}`,
  );
  console.log(`Origin:  ${LIVE_ORIGIN}\n`);

  const results: {
    slug: string;
    sessionId: string;
    status: string;
    demo: boolean;
    url: string;
  }[] = [];

  for (const slug of targets) {
    const engine = await db.calculationEngine.findUnique({ where: { slug } });
    const userInput = getIntakeExample({
      slug,
      category: engine?.category || "writing",
      inputPlaceholder: engine?.inputPlaceholder || "Provide details…",
    });

    process.stdout.write(`→ ${slug} … `);
    try {
      const run = await upsertAndProcess(slug, userInput);
      if (!run) throw new Error("EngineRun missing after processing");
      const demo = (run.outputData || "").includes("Demo Mode");
      const url = `${LIVE_ORIGIN}/success?session_id=${run.stripeSessionId}`;
      results.push({
        slug,
        sessionId: run.stripeSessionId,
        status: run.status,
        demo,
        url,
      });
      console.log(`${run.status}${demo ? " (demo)" : " (real)"}`);
      console.log(`  ${url}`);
    } catch (err) {
      console.log("FAILED");
      console.error(`  ${err instanceof Error ? err.message : err}`);
      results.push({
        slug,
        sessionId: sessionIdFor(slug),
        status: "error",
        demo: true,
        url: `${LIVE_ORIGIN}/success?session_id=${sessionIdFor(slug)}`,
      });
    }
  }

  console.log("\n=== Summary ===");
  const ok = results.filter((r) => r.status === "completed").length;
  const real = results.filter((r) => r.status === "completed" && !r.demo).length;
  console.log(`Completed: ${ok}/${results.length}`);
  console.log(`Real AI:   ${real}/${results.length}`);
  for (const r of results) {
    console.log(`- ${r.status.padEnd(10)} ${r.slug}`);
  }
}

main()
  .catch((err) => {
    console.error("\nCheckout override failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
