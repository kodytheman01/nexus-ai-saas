/**
 * Upsert Wave-2 Lien/Eviction/Creator/Deal engines only.
 *   npx tsx scripts/seed-expansion-engines.ts
 */
import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { EXPANSION_ENGINES_SEED } from "../config/expansion-engines";
import { normalizeEngineSeed } from "../lib/engine-quality";

loadEnv();

async function main() {
  const prisma = new PrismaClient();
  try {
    for (const raw of EXPANSION_ENGINES_SEED) {
      const engine = normalizeEngineSeed(raw);
      await prisma.calculationEngine.upsert({
        where: { slug: engine.slug },
        update: {
          title: engine.title,
          description: engine.description,
          priceInUSD: engine.priceInUSD,
          inputLabel: engine.inputLabel,
          inputPlaceholder: engine.inputPlaceholder,
          aiSystemPrompt: engine.aiSystemPrompt,
          outputFormat: engine.outputFormat,
          category: engine.category,
          isActive: true,
        },
        create: {
          slug: engine.slug,
          title: engine.title,
          description: engine.description,
          priceInUSD: engine.priceInUSD,
          inputLabel: engine.inputLabel,
          inputPlaceholder: engine.inputPlaceholder,
          aiSystemPrompt: engine.aiSystemPrompt,
          outputFormat: engine.outputFormat,
          category: engine.category,
          isActive: true,
        },
      });
      console.log("upsert", engine.slug, `$${engine.priceInUSD}`);
    }
    console.log("OK", EXPANSION_ENGINES_SEED.length, "expansion engines");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
