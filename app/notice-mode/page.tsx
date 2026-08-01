import type { Metadata } from "next";
import Link from "next/link";
import { NOTICE_PRIMARY_SLUG } from "@/config/conversion";
import { getModeAdPack } from "@/config/mode-catalog";
import { NOTICE_STATE_PACKS, NOTICE_STATE_CODES } from "@/config/state-packs";
import { LEGAL_DISCLAIMER } from "@/config/trust";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Notice Mode",
  description:
    "Notice Mode for Apex Capital Admin Services — landlord pay-or-quit, vacate, renewal, entry, deposit drafts plus tenant repair, move-out, and lease-break letters. Optional human review. Not legal advice.",
  alternates: { canonical: `${appUrl}/notice-mode` },
};

const faqs = [
  {
    q: "Is this legal advice?",
    a: "No. Drafts only. Landlord-tenant laws vary by state and city. Confirm notices, timelines, and required language with local counsel before you serve or file anything.",
  },
  {
    q: "Do you cover landlords and tenants?",
    a: "Yes. Notice Mode covers landlord notices (pay-or-quit, vacate, renewal, entry, deposit). Tenant Mode covers repair requests, move-out checklists, roommate outlines, and lease-break requests.",
  },
  {
    q: "Is this separate from Grant Mode?",
    a: "Same Apex platform and checkout. Grant Mode is for funder narratives; Notice Mode is for landlord and tenant letters. Pick the Mode that matches your deliverable.",
  },
  {
    q: "Will a pay-or-quit from here hold up in court?",
    a: "No product can promise that. We give you a structured first-pass draft from your facts. Statutory wording and service method must match your jurisdiction.",
  },
  {
    q: "What does human review (+$" + HUMAN_REVIEW_USD + ") cover?",
    a: "Apex ops reviews the generated draft for clarity, structure, and obvious gaps, then emails notes within 1 business day. It is not a licensed attorney opinion and does not certify fitness for filing or service.",
  },
];

const noticePack = getModeAdPack("notice")!;
const landlordEngines = noticePack.engines.filter(
  (e) =>
    e.audience.includes("Landlords") ||
    e.audience === "Landlords · PMs",
);
const tenantEngines = noticePack.engines.filter(
  (e) =>
    e.audience.includes("Tenants") ||
    e.audience.includes("Roommates"),
);
const moneyHref = `/engine/${NOTICE_PRIMARY_SLUG}?sample=1&focus=intake`;

function NoticeFaqJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function NoticeModePage() {
  return (
    <div>
      <NoticeFaqJsonLd />
      <section className="border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Apex · Notice Mode
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            Blank page → structured landlord or tenant draft.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Same Apex Capital Admin Services platform as Grant Mode — built for
            owners, PMs, and renters on a deadline. Pay once, get a first-pass
            draft in about a minute — then edit or add human review (+$
            {HUMAN_REVIEW_USD}).
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={moneyHref}
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Start pay-or-quit draft — $24
            </Link>
            <Link
              href="/engine/tenant-repair-request-letter?sample=1&focus=intake"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Or tenant repair letter — $15
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/50">
            Sample intake loads in one tap. Ads should deep-link via /go/notice.{" "}
            {LEGAL_DISCLAIMER}
          </p>
        </div>
      </section>

      <section
        id="state-packs"
        className="scroll-mt-24 border-b border-[#0b1f3a]/10 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            State packs — TX · FL · CA
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#1c2230]/65">
            Educational local-law cues only. Never a substitute for counsel.
            Open pay-or-quit with your state attached.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {NOTICE_STATE_CODES.map((code) => {
              const pack = NOTICE_STATE_PACKS[code];
              return (
                <div
                  key={code}
                  className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {pack.code} pack
                  </p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-[#0b1f3a]">
                    {pack.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/65">
                    {pack.tagline}
                  </p>
                  <ul className="mt-3 space-y-1.5 text-[11px] leading-relaxed text-[#1c2230]/70">
                    {pack.localLawCues.slice(0, 2).map((row) => (
                      <li key={row.section}>
                        <span className="font-semibold text-[#0b1f3a]">
                          {row.section}:
                        </span>{" "}
                        {row.tip}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/engine/${NOTICE_PRIMARY_SLUG}?sample=1&focus=intake&state=${pack.code}`}
                    className="mt-4 inline-block text-xs font-bold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2"
                  >
                    Open pay-or-quit with {pack.code} cues →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Landlord notices — everything inside
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#1c2230]/65">
            {landlordEngines.length} landlord engines. Primary money path is
            pay-or-quit. Advertise the Mode, then each letter type.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {landlordEngines.map((e) => (
              <Link
                key={e.slug}
                href={`/engine/${e.slug}?sample=1&focus=intake`}
                className="rounded-lg border border-[#0b1f3a]/10 bg-white p-5 transition hover:border-[#c9a227]/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {e.isPrimary ? "Primary · /go/notice" : "Landlord"}
                  </span>
                  <span className="font-mono text-sm font-bold text-[#0b1f3a]">
                    ${e.price}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-[#0b1f3a]">
                  {e.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/60">
                  {e.hook}
                </p>
                <p className="mt-3 text-xs font-bold text-[#0b1f3a]">
                  Open with sample intake →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        id="tenant"
        className="scroll-mt-24 border-b border-[#0b1f3a]/10 bg-white"
      >
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Tenant Mode — everything inside
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-[#1c2230]/65">
            {tenantEngines.length} tenant engines — paper-trail letters and
            checklists. Still drafts, still not legal advice.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tenantEngines.map((e) => (
              <Link
                key={e.slug}
                href={`/engine/${e.slug}?sample=1&focus=intake`}
                className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5 transition hover:border-[#c9a227]/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    Tenant
                  </span>
                  <span className="font-mono text-sm font-bold text-[#0b1f3a]">
                    ${e.price}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg font-semibold text-[#0b1f3a]">
                  {e.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/60">
                  {e.hook}
                </p>
                <p className="mt-3 text-xs font-bold text-[#0b1f3a]">
                  Open with sample intake →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            How people typically use Notice Mode
          </h2>
          <ol className="mt-6 space-y-4 text-sm leading-relaxed text-[#1c2230]/75">
            <li>
              <span className="font-semibold text-[#0b1f3a]">1. Pick the side.</span>{" "}
              Landlord notice or tenant letter — don&apos;t mix facts.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">2. Load sample.</span>{" "}
              See structure, then swap your names, dates, and amounts.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">3. Checkout.</span>{" "}
              Stripe → draft on-page + email copy.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">4. Local check.</span>{" "}
              Confirm notice periods, service method, and required language for
              your state/city.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">5. Optional review.</span>{" "}
              Add +${HUMAN_REVIEW_USD} when the draft will be served or sent to
              counsel.
            </li>
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={moneyHref}
              className="inline-flex rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-[#14335c]"
            >
              Start pay-or-quit checkout — $24
            </Link>
            <Link
              href="/grant-mode"
              className="inline-flex rounded-lg border border-[#0b1f3a]/15 px-5 py-3 text-sm font-bold text-[#0b1f3a]"
            >
              Or open Grant Mode
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            FAQ
          </h2>
          <dl className="mt-6 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-semibold text-[#0b1f3a]">
                  {item.q}
                </dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#1c2230]/70">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
