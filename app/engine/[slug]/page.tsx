import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { EngineCheckoutForm } from "@/app/components/EngineCheckoutForm";
import { ProductJsonLd } from "@/app/components/JsonLd";
import { getFlagship } from "@/config/flagship";
import { displayTitle } from "@/lib/display";
import { getSampleDeliverable, WHAT_YOU_GET_DEFAULT } from "@/lib/offer";
import { EngineCanceledBanner } from "./CanceledBanner";

export const dynamic = "force-dynamic";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ canceled?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine) return { title: "Engine not found" };

  const title = `${displayTitle(engine.title)} | Apex Capital Admin Services`;
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

export default async function EnginePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine || !engine.isActive) notFound();

  const name = displayTitle(engine.title);
  const flagship = getFlagship(engine.slug);
  const sample = getSampleDeliverable({
    slug: engine.slug,
    title: engine.title,
    category: engine.category,
    description: engine.description,
  });
  const whatYouGet = flagship?.whatYouGet ?? WHAT_YOU_GET_DEFAULT;

  const related = await db.calculationEngine.findMany({
    where: {
      isActive: true,
      category: engine.category,
      NOT: { slug: engine.slug },
    },
    take: 4,
    orderBy: { title: "asc" },
    select: { slug: true, title: true, priceInUSD: true },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
      <ProductJsonLd
        name={name}
        description={engine.description}
        slug={engine.slug}
        priceInUSD={engine.priceInUSD}
      />

      <nav className="mb-6 flex flex-wrap items-center gap-2 text-xs text-[#1c2230]/50">
        <Link href="/" className="hover:text-[#0b1f3a]">
          Home
        </Link>
        <span aria-hidden>/</span>
        <Link href="/#catalog" className="hover:text-[#0b1f3a]">
          Catalog
        </Link>
        {flagship?.badge === "Grant Mode" ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/#grant-mode" className="hover:text-[#0b1f3a]">
              Grant Mode
            </Link>
          </>
        ) : null}
        <span aria-hidden>/</span>
        <span className="text-[#0b1f3a]/70">{name}</span>
      </nav>

      {sp.canceled === "1" ? <EngineCanceledBanner /> : null}

      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Checkout first on mobile so buyers aren't buried under sample */}
        <div id="intake" className="order-1 scroll-mt-28 lg:order-2">
          <div className="rounded-lg border border-[#0b1f3a]/10 bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <h2 className="mb-1 font-display text-xl font-semibold text-[#0b1f3a]">
              Start intake
            </h2>
            <p className="mb-4 text-xs text-[#1c2230]/55">
              ${engine.priceInUSD} draft · optional human review at checkout
            </p>
            <EngineCheckoutForm
              slug={engine.slug}
              inputLabel={engine.inputLabel}
              inputPlaceholder={engine.inputPlaceholder}
              priceInUSD={engine.priceInUSD}
            />
          </div>
        </div>

        <div className="order-2 lg:order-1">
          <div className="mb-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                {engine.category}
              </span>
              {flagship ? (
                <span className="inline-block rounded-full border border-[#0b1f3a]/15 bg-[#0b1f3a] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#c9a227]">
                  {flagship.badge}
                </span>
              ) : null}
            </div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
              {name}
            </h1>
            <p className="text-base leading-relaxed text-[#1c2230]/70">
              {flagship?.hook ?? engine.description}
            </p>
            {flagship ? (
              <p className="text-sm leading-relaxed text-[#1c2230]/60">
                {engine.description}
              </p>
            ) : null}
            <p className="font-mono text-lg font-bold text-[#0b1f3a]">
              ${engine.priceInUSD}{" "}
              <span className="text-xs font-bold uppercase text-[#1c2230]/40">
                USD
              </span>
              <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-[#1c2230]/45">
                · Instant draft + email copy
              </span>
            </p>
          </div>

          <div className="mb-8 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/50">
              What you get
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#1c2230]/75">
              {whatYouGet.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {flagship ? (
            <div className="mb-8 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                Illustrative scenario (anonymized)
              </p>
              <h2 className="mt-1 font-display text-lg font-semibold text-[#0b1f3a]">
                {flagship.scenarioTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
                {flagship.scenarioBody}
              </p>
            </div>
          ) : null}

          <div className="rounded-lg border border-[#0b1f3a]/10 bg-[#0b1f3a] p-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#c9a227]">
                {sample.label}
              </h2>
              <span className="text-[10px] uppercase tracking-wide text-white/40">
                {sample.isFlagship ? "Flagship sample" : "Structure sample"}
              </span>
            </div>
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-relaxed text-white/85">
              {sample.body}
            </pre>
            <p className="mt-3 text-[10px] leading-relaxed text-white/40">
              Illustrative only — your live output is generated from your intake
              after payment.
            </p>
          </div>

          {related.length > 0 ? (
            <div className="mt-8">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/50">
                Related in {engine.category}
              </h2>
              <ul className="mt-3 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/engine/${r.slug}`}
                      className="flex items-center justify-between rounded-lg border border-[#0b1f3a]/10 bg-white px-3 py-2.5 text-sm hover:border-[#c9a227]/40"
                    >
                      <span className="font-semibold text-[#0b1f3a]">
                        {displayTitle(r.title)}
                      </span>
                      <span className="font-mono text-xs text-[#0b1f3a]/60">
                        ${r.priceInUSD}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
