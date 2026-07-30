import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { getIntakeExample } from "../lib/intake-examples";
import { FLAGSHIP_SLUGS } from "../config/flagship";

async function main() {
  const db = new PrismaClient();
  const all = await db.calculationEngine.findMany({ where: { isActive: true } });
  let shortDesc = 0;
  let noGuard = 0;
  let thinSample = 0;
  const flagshipThin: string[] = [];

  for (const e of all) {
    if (e.description.trim().length < 55) shortDesc += 1;
    const p = e.aiSystemPrompt.toLowerCase();
    const needs =
      ["legal", "hr", "realestate", "ecommerce", "health", "insurance", "landlord-notice", "tenant-letter", "hr-offer", "contractor-bid"].includes(
        e.category,
      );
    if (
      needs &&
      !(
        p.includes("not legal") ||
        p.includes("draft only") ||
        p.includes("educational") ||
        p.includes("not licensed") ||
        p.includes("not medical") ||
        p.includes("not financial") ||
        p.includes("not a substitute")
      )
    ) {
      noGuard += 1;
    }
    const sample = getIntakeExample({
      slug: e.slug,
      category: e.category,
      inputPlaceholder: e.inputPlaceholder,
    });
    if (sample.trim().length < 80) thinSample += 1;
    if (FLAGSHIP_SLUGS.includes(e.slug) && sample.trim().length < 120) {
      flagshipThin.push(e.slug);
    }
  }

  console.log(
    JSON.stringify(
      {
        total: all.length,
        shortDesc,
        sensitiveMissingGuard: noGuard,
        thinSample,
        flagshipThin,
        flagships: FLAGSHIP_SLUGS.length,
      },
      null,
      2,
    ),
  );
  await db.$disconnect();
  if (shortDesc || noGuard || flagshipThin.length) process.exitCode = 1;
}

main();
