import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EngineCheckoutForm } from "@/app/components/EngineCheckoutForm";
import { ProductJsonLd } from "@/app/components/JsonLd";

export const dynamic = "force-dynamic";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine) return { title: "Engine not found" };

  const title = `${engine.title} | Apex Capital Admin Services`;
  const description = engine.description;
  const url = `${appUrl}/engine/${engine.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Apex Capital Admin Services",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function EnginePage({ params }: Props) {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine || !engine.isActive) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <ProductJsonLd
        name={engine.title}
        description={engine.description}
        slug={engine.slug}
        priceInUSD={engine.priceInUSD}
      />
      <div className="mb-8 space-y-3">
        <span className="inline-block rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
          {engine.category}
        </span>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
          {engine.title}
        </h1>
        <p className="text-base leading-relaxed text-[#1c2230]/70">
          {engine.description}
        </p>
        <p className="font-mono text-lg font-bold text-[#0b1f3a]">
          ${engine.priceInUSD}{" "}
          <span className="text-xs font-bold uppercase text-[#1c2230]/40">
            USD
          </span>
        </p>
      </div>

      <div className="rounded-lg border border-[#0b1f3a]/10 bg-white p-6 shadow-sm">
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
