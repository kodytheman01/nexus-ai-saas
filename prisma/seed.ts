import { PrismaClient } from "@prisma/client";
import { ENGINES_SEED_DATA } from "../config/engines";
import { NOTICE_ENGINES_SEED } from "../config/notice-engines";

const prisma = new PrismaClient();

async function main() {
  const all = [...ENGINES_SEED_DATA, ...NOTICE_ENGINES_SEED];
  console.log("Seeding engines...");

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
    `Seeded ${all.length} engines (${ENGINES_SEED_DATA.length} core + ${NOTICE_ENGINES_SEED.length} notice/tenant).`,
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
