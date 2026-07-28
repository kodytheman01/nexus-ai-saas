import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EngineCheckoutForm } from "@/app/components/EngineCheckoutForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine) return { title: "Engine not found" };
  return {
    title: `${engine.title} | Nexus Engines`,
    description: engine.description,
  };
}

export default async function EnginePage({ params }: Props) {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine || !engine.isActive) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 space-y-3">
        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
          {engine.category}
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {engine.title}
        </h1>
        <p className="text-base text-zinc-600">{engine.description}</p>
        <p className="font-mono text-lg font-black text-zinc-900">
          ${engine.priceInUSD}{" "}
          <span className="text-xs font-bold uppercase text-zinc-400">USD</span>
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <EngineCheckoutForm
          slug={engine.slug}
          inputLabel={engine.inputLabel}
          inputPlaceholder={engine.inputPlaceholder}
          priceInUSD={engine.priceInUSD}
        />
      </div>
    </div>
  );
}
