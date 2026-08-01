import { PrismaClient } from "@prisma/client";
import { ENGINES_SEED_DATA } from "../config/engines";
import { EXPANSION_ENGINES_SEED } from "../config/expansion-engines";
import { NOTICE_ENGINES_SEED } from "../config/notice-engines";
import { BID_ENGINES_SEED } from "../config/bid-engines";
import { OFFER_ENGINES_SEED } from "../config/offer-engines";
import { normalizeEngineSeed } from "../lib/engine-quality";

const prisma = new PrismaClient();

async function main() {
  const all = [
    ...ENGINES_SEED_DATA,
    ...NOTICE_ENGINES_SEED,
    ...BID_ENGINES_SEED,
    ...OFFER_ENGINES_SEED,
    ...EXPANSION_ENGINES_SEED,
  ].map(normalizeEngineSeed);

  console.log("Seeding engines (quality-normalized)...");

  for (const engine of all) {
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
  }

  console.log(
    `Seeded ${all.length} engines (${ENGINES_SEED_DATA.length} core + ${NOTICE_ENGINES_SEED.length} notice/tenant + ${BID_ENGINES_SEED.length} bid + ${OFFER_ENGINES_SEED.length} offer + ${EXPANSION_ENGINES_SEED.length} expansion) with quality floor.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
