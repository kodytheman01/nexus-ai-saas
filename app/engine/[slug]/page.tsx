import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { canonicalEngineSlug } from "@/config/engine-redirects";
import { EngineCheckoutForm } from "@/app/components/EngineCheckoutForm";
import { EnginePixelEvents } from "@/app/components/EnginePixelEvents";
import { ProductJsonLd } from "@/app/components/JsonLd";
import { getFlagship } from "@/config/flagship";
import {
  BID_PAIRINGS,
  ENTITY,
  FOA_COVERAGE_CHECKLIST,
  GRANT_PAIRINGS,
  HOUSING_LEGAL_DISCLAIMER,
  NOTICE_PAIRINGS,
  NOTICE_PRE_SERVE_CHECKLIST,
  OFFER_PAIRINGS,
} from "@/config/trust";
import { NOTICE_STATE_PACKS, parseNoticeState } from "@/config/state-packs";
import { displayTitle, isGrantRelated } from "@/lib/display";
import { getIntakeExample } from "@/lib/intake-examples";
import { getSampleDeliverable, WHAT_YOU_GET_DEFAULT } from "@/lib/offer";
import { EngineCanceledBanner } from "./CanceledBanner";

export const dynamic = "force-dynamic";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ canceled?: string; state?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const engine = await db.calculationEngine.findUnique({ where: { slug } });
  if (!engine) return { title: "Engine not found" };

  const name = displayTitle(engine.title);
  const fullTitle = `${name} | Apex Capital Admin Services`;
  const description = engine.description;
  const url = `${appUrl}/engine/${engine.slug}`;

  return {
    // Layout template already appends " | Apex Capital Admin Services"
    title: name,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Apex Capital Admin Services",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export default async function EnginePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;

  const canonical = canonicalEngineSlug(slug);
  if (canonical) {
    const q = new URLSearchParams();
    q.set("sample", "1");
    q.set("focus", "intake");
    if (sp.canceled === "1") q.set("canceled", "1");
    if (sp.state) q.set("state", String(sp.state));
    redirect(`/engine/${canonical}?${q.toString()}`);
  }

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
  const intakeExample = getIntakeExample({
    slug: engine.slug,
    category: engine.category,
    inputPlaceholder: engine.inputPlaceholder,
  });
  const isGrant =
    flagship?.badge === "Grant Mode" ||
    isGrantRelated({
      slug: engine.slug,
      title: engine.title,
      category: engine.category,
    });
  const isTenant =
    flagship?.badge === "Tenant Mode" || engine.category === "tenant-letter";
  const isNotice =
    !isTenant &&
    (flagship?.badge === "Notice Mode" ||
      engine.category === "landlord-notice" ||
      engine.category === "landlord-ops");
  const isBid =
    flagship?.badge === "Bid Mode" || engine.category === "contractor-bid";
  const isOffer =
    flagship?.badge === "Offer Mode" || engine.category === "hr-offer";
  const isPolicy = flagship?.badge === "Policy Mode";
  const isCollect = flagship?.badge === "Collect Mode";
  const isLien =
    flagship?.badge === "Lien Mode" || engine.category === "lien-notice";
  const isEviction =
    flagship?.badge === "Eviction Mode" || engine.category === "eviction-ops";
  const isCreator =
    flagship?.badge === "Creator Mode" || engine.category === "creator-ops";
  const isDeal =
    flagship?.badge === "Deal Mode" || engine.category === "deal-ops";
  const statePack =
    isNotice || isTenant ? parseNoticeState(sp.state) : null;
  const statePackData = statePack ? NOTICE_STATE_PACKS[statePack] : null;
  const pairings =
    GRANT_PAIRINGS[engine.slug] ??
    NOTICE_PAIRINGS[engine.slug] ??
    BID_PAIRINGS[engine.slug] ??
    OFFER_PAIRINGS[engine.slug] ??
    [];

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
      <EnginePixelEvents
        slug={engine.slug}
        name={name}
        priceInUSD={engine.priceInUSD}
      />
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
        {isNotice ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/notice-mode" className="hover:text-[#0b1f3a]">
              Notice Mode
            </Link>
          </>
        ) : null}
        {isTenant ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/tenant-mode" className="hover:text-[#0b1f3a]">
              Tenant Mode
            </Link>
          </>
        ) : null}
        {isBid ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/bid-mode" className="hover:text-[#0b1f3a]">
              Bid Mode
            </Link>
          </>
        ) : null}
        {isOffer ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/offer-mode" className="hover:text-[#0b1f3a]">
              Offer Mode
            </Link>
          </>
        ) : null}
        {isPolicy ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/policy-mode" className="hover:text-[#0b1f3a]">
              Policy Mode
            </Link>
          </>
        ) : null}
        {isCollect ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/collect-mode" className="hover:text-[#0b1f3a]">
              Collect Mode
            </Link>
          </>
        ) : null}
        {isLien ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/lien-mode" className="hover:text-[#0b1f3a]">
              Lien Mode
            </Link>
          </>
        ) : null}
        {isEviction ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/eviction-mode" className="hover:text-[#0b1f3a]">
              Eviction Mode
            </Link>
          </>
        ) : null}
        {isCreator ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/creator-mode" className="hover:text-[#0b1f3a]">
              Creator Mode
            </Link>
          </>
        ) : null}
        {isDeal ? (
          <>
            <span aria-hidden>/</span>
            <Link href="/deal-mode" className="hover:text-[#0b1f3a]">
              Deal Mode
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
              ${engine.priceInUSD} draft · email copy included · optional human
              review
            </p>
            <ul className="mb-4 grid grid-cols-2 gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#0b1f3a]/55">
              <li className="rounded border border-[#0b1f3a]/10 bg-[#f7f5f0] px-2 py-1.5">
                Stripe checkout
              </li>
              <li className="rounded border border-[#0b1f3a]/10 bg-[#f7f5f0] px-2 py-1.5">
                Instant draft
              </li>
              <li className="rounded border border-[#0b1f3a]/10 bg-[#f7f5f0] px-2 py-1.5">
                Email + download
              </li>
              <li className="rounded border border-[#0b1f3a]/10 bg-[#f7f5f0] px-2 py-1.5">
                1 regen token
              </li>
            </ul>
            <Suspense
              fallback={
                <div className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-4 text-sm text-[#1c2230]/50">
                  Loading checkout…
                </div>
              }
            >
              <EngineCheckoutForm
                slug={engine.slug}
                inputLabel={engine.inputLabel}
                inputPlaceholder={engine.inputPlaceholder}
                priceInUSD={engine.priceInUSD}
                intakeExample={intakeExample}
              />
            </Suspense>
            <p className="mt-4 text-[11px] leading-relaxed text-[#1c2230]/55">
              {isNotice || isTenant
                ? HOUSING_LEGAL_DISCLAIMER
                : isGrant
                  ? "Not a substitute for a licensed attorney, CPA, grant officer, or your program team. Drafts are first-pass structure — verify against the live FOA before submit."
                  : isPolicy || isOffer
                    ? "Not employment counsel. Drafts are first-pass structure — have HR/counsel review before issuing or publishing."
                    : isCollect
                      ? "Not legal advice or licensed debt collection. Have counsel review before sending demand letters."
                      : "Not a substitute for a licensed attorney, CPA, or your program team. Drafts are first-pass structure — verify with counsel before relying on them."}{" "}
              Support: {ENTITY.email} · {ENTITY.supportHours}.
            </p>
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
            <div className="mb-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-[#0b1f3a]/10 bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/40">
                  Before
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/65">
                  {isGrant
                    ? "Scattered notes, blank-page FOA sections, and unclear where budget narrative meets the story."
                    : "Scattered notes, blank templates, and no clear first draft to hand your team."}
                </p>
              </div>
              <div className="rounded-lg border border-[#c9a227]/35 bg-[#c9a227]/10 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                  After
                </p>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/70">
                  Sectioned draft from your intake — ready for your voice,
                  program team, and counsel review.
                </p>
              </div>
            </div>
          ) : null}

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

          {isGrant ? (
            <div className="mb-8 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/50">
                FOA paste-in coverage checklist
              </h2>
              <p className="mt-1 text-xs text-[#1c2230]/55">
                Paste FOA section requirements into intake. Tick these against
                the live solicitation before you submit.
              </p>
              <ul className="mt-3 space-y-2">
                {FOA_COVERAGE_CHECKLIST.map((row) => (
                  <li
                    key={row.section}
                    className="flex gap-2 text-sm leading-relaxed text-[#1c2230]/75"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#c9a227]">
                      [ ]
                    </span>
                    <span>
                      <span className="font-semibold text-[#0b1f3a]">
                        {row.section}.
                      </span>{" "}
                      {row.tip}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {isNotice || isTenant ? (
            <div className="mb-8 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/50">
                Before you serve or send
              </h2>
              <p className="mt-1 text-xs text-[#1c2230]/55">
                {HOUSING_LEGAL_DISCLAIMER}
              </p>
              <ul className="mt-3 space-y-2">
                {NOTICE_PRE_SERVE_CHECKLIST.map((row) => (
                  <li
                    key={row.section}
                    className="flex gap-2 text-sm leading-relaxed text-[#1c2230]/75"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-[10px] text-[#c9a227]">
                      [ ]
                    </span>
                    <span>
                      <span className="font-semibold text-[#0b1f3a]">
                        {row.section}.
                      </span>{" "}
                      {row.tip}
                    </span>
                  </li>
                ))}
              </ul>
              {!statePackData ? (
                <p className="mt-3 text-[11px] text-[#1c2230]/55">
                  State packs:{" "}
                  {(["TX", "FL", "CA"] as const).map((code, i) => (
                    <span key={code}>
                      {i > 0 ? " · " : null}
                      <Link
                        href={`/engine/${engine.slug}?sample=1&focus=intake&state=${code}`}
                        className="font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2"
                      >
                        {code}
                      </Link>
                    </span>
                  ))}
                </p>
              ) : null}
            </div>
          ) : null}

          {statePackData ? (
            <div className="mb-8 rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/10 p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#8a6d13]">
                {statePackData.code} state pack — local-law cues
              </h2>
              <p className="mt-1 text-xs text-[#1c2230]/65">
                {statePackData.tagline} Educational only — confirm with counsel.
              </p>
              <ul className="mt-3 space-y-2">
                {statePackData.localLawCues.map((row) => (
                  <li
                    key={row.section}
                    className="text-sm leading-relaxed text-[#1c2230]/75"
                  >
                    <span className="font-semibold text-[#0b1f3a]">
                      {row.section}.
                    </span>{" "}
                    {row.tip}
                  </li>
                ))}
              </ul>
              <div className="mt-3 rounded border border-[#0b1f3a]/10 bg-white/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/45">
                  Suggested intake lines
                </p>
                <pre className="mt-1 whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#1c2230]/70">
                  {statePackData.intakeHints.join("\n")}
                </pre>
              </div>
            </div>
          ) : null}

          {pairings.length > 0 ? (
            <div className="mb-8 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/50">
                Pair with
              </h2>
              <ul className="mt-3 space-y-2">
                {pairings.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/engine/${p.slug}`}
                      className="block rounded-lg border border-[#0b1f3a]/10 bg-white px-3 py-2.5 hover:border-[#c9a227]/40"
                    >
                      <span className="text-sm font-semibold text-[#0b1f3a]">
                        {p.label}
                      </span>
                      <span className="mt-0.5 block text-xs text-[#1c2230]/55">
                        {p.why}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
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
