/**
 * Local checkout override — simulates a completed Stripe session without
 * live charges or Gmail SMTP.
 *
 * Usage:
 *   npx tsx scripts/test-checkout-override.ts
 *   npm run test:checkout-override
 *
 * Note: This codebase stores checkouts as EngineRun (not "Purchase") and
 * generates via processEngineExecution() (not processEngineDeliverable()).
 */
import "dotenv/config";
import { db } from "../lib/db";
import { processEngineExecution } from "../lib/process-engine";

const ENGINE_SLUG = "grant-proposal-narrative-generator";
const MOCK_SESSION_ID = "cs_test_mock_123";
const TEST_EMAIL = "checkout-override@apexcapitaladmin.com";

const SAMPLE_INPUT = `Organization: Riverbend Workforce Alliance (501(c)(3)), serving 3 rural counties.
Funder / opportunity: State workforce development grant (adult credential pathway).
Population: Adults 18–54 without industry credentials; high manufacturing vacancy rates.
Need (with data): Employers report tech roles open 90+ days; local completion rates lag state average by 12 pts.
Program: 16-week technician cohort, employer advisory board, wraparound supports.
Goals: Enroll 80 learners / 12 months; 70% credential completion; 55% placed in related jobs within 90 days.
Ask: Draft need, goals, approach, and evaluation narrative sections.`;

async function main() {
  console.log("=== Checkout override test ===");
  console.log(`Engine:  ${ENGINE_SLUG}`);
  console.log(`Session: ${MOCK_SESSION_ID}`);
  console.log(
    `OpenAI:  ${process.env.OPENAI_API_KEY ? "configured (live generation)" : "missing (demo placeholder)"}`,
  );
  console.log(
    `Gmail:   ${process.env.GMAIL_APP_PASSWORD ? "configured" : "not set (email skipped — fine for this test)"}`,
  );

  const engine = await db.calculationEngine.findUnique({
    where: { slug: ENGINE_SLUG },
  });
  if (!engine || !engine.isActive) {
    throw new Error(
      `Engine "${ENGINE_SLUG}" not found or inactive. Run: npx prisma db seed`,
    );
  }

  // Upsert mock EngineRun (our purchase/checkout record)
  await db.engineRun.upsert({
    where: { stripeSessionId: MOCK_SESSION_ID },
    create: {
      stripeSessionId: MOCK_SESSION_ID,
      userEmail: TEST_EMAIL,
      engineSlug: ENGINE_SLUG,
      inputParameters: SAMPLE_INPUT,
      status: "pending",
      humanReview: false,
      allowanceTokens: 1,
      attribution: JSON.stringify({
        utm_source: "checkout_override_script",
        utm_medium: "local_cli",
      }),
    },
    update: {
      userEmail: TEST_EMAIL,
      engineSlug: ENGINE_SLUG,
      inputParameters: SAMPLE_INPUT,
      status: "pending",
      outputData: null,
      humanReview: false,
      allowanceTokens: 1,
    },
  });

  console.log("\nCreated/reset EngineRun → calling processEngineExecution()…\n");

  await processEngineExecution({
    stripeSessionId: MOCK_SESSION_ID,
    engineSlug: ENGINE_SLUG,
    userInput: SAMPLE_INPUT,
  });

  const run = await db.engineRun.findUnique({
    where: { stripeSessionId: MOCK_SESSION_ID },
    select: {
      id: true,
      status: true,
      stripeSessionId: true,
      engineSlug: true,
      outputData: true,
      updatedAt: true,
    },
  });

  if (!run) {
    throw new Error("EngineRun missing after processing.");
  }

  console.log("=== Result ===");
  console.log(`Run ID:   ${run.id}`);
  console.log(`Status:   ${run.status}`);
  console.log(`Updated:  ${run.updatedAt.toISOString()}`);
  console.log(`Success:  ${MOCK_SESSION_ID}`);
  console.log("\n--- Deliverable output ---\n");
  console.log(run.outputData || "(empty output)");
  console.log("\n--- end ---");
  console.log(
    `\nView on local success page (if dev server is up):\n  http://localhost:3000/success?session_id=${MOCK_SESSION_ID}`,
  );
}

main()
  .catch((err) => {
    console.error("\nCheckout override failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await db.$disconnect();
  });
