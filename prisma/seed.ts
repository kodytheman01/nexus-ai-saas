import { PrismaClient } from "@prisma/client";
import { ENGINES_SEED_DATA } from "../config/engines";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding engines...");

  for (const engine of ENGINES_SEED_DATA) {
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

  console.log(`Seeded ${ENGINES_SEED_DATA.length} engines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
