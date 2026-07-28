import { db } from "@/lib/db";
import { ClientCatalogView } from "./components/ClientCatalogView";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const engines = await db.calculationEngine.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    select: {
      slug: true,
      title: true,
      description: true,
      priceInUSD: true,
      category: true,
    },
  });

  const categories = Array.from(new Set(engines.map((e) => e.category)));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.2em] text-emerald-700">
          Knowledge → Micro-Asset → Stripe
        </p>
        <h1 className="font-display text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Nexus Engines
        </h1>
        <p className="mt-3 text-base text-zinc-600">
          Pick a problem engine, describe your situation, unlock a turnkey
          blueprint, script, or checklist.
        </p>
      </div>

      {engines.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center">
          <p className="font-semibold text-zinc-800">No engines seeded yet.</p>
          <p className="mt-2 text-sm text-zinc-500">
            Run <code className="rounded bg-zinc-100 px-1.5 py-0.5">npx prisma db seed</code>{" "}
            then refresh.
          </p>
        </div>
      ) : (
        <ClientCatalogView initialEngines={engines} categories={categories} />
      )}
    </div>
  );
}
