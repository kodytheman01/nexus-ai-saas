import type { Metadata } from "next";
import Link from "next/link";
import { GRANT_NARRATIVE_SLUG } from "@/config/conversion";
import { getModeAdPack } from "@/config/mode-catalog";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Grant Mode",
  description:
    "Grant Mode for Apex Capital Admin Services — funder-style narrative drafts, FOA outlines, budget allocation language, and compliance checklists with optional human review.",
  alternates: { canonical: `${appUrl}/grant-mode` },
};

const faqs = [
  {
    q: "Is this a substitute for a grant writer?",
    a: "No. Grant Mode produces structured first-pass drafts from your facts so you (or your grant writer) spend less time staring at a blank page. Final voice, funder alignment, and submission remain yours.",
  },
  {
    q: "Will this guarantee funding?",
    a: "No. No honest product can. We help you organize need, goals, approach, evaluation, and budget narrative language from your inputs.",
  },
  {
    q: "Do you map to a specific FOA / NOFO?",
    a: "Paste the FOA section requirements into intake (or use the outline engine). Outputs are intake-driven drafts — verify every section against the live solicitation before submit.",
  },
  {
    q: "What does human review (+$" + HUMAN_REVIEW_USD + ") cover?",
    a: "Apex ops reviews the generated draft for clarity, structure, and obvious gaps, then emails notes within 1 business day. It is not a licensed grant officer opinion and does not certify fitness for filing.",
  },
  {
    q: "What should I put in intake for best results?",
    a: "Org facts, population served, need data (with sources), measurable goals, activities/timeline, partners, and budget ballpark. Each Grant Mode engine page shows a filled example.",
  },
];

const grantPack = getModeAdPack("grant")!;
const moneyHref = `/engine/${GRANT_NARRATIVE_SLUG}?sample=1&focus=intake`;

function GrantFaqJsonLd() {
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

export default function GrantModePage() {
  return (
    <div>
      <GrantFaqJsonLd />
      <section className="border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Grant Mode
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            Blank FOA page → funder-style narrative draft.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Built for grant writers and nonprofit ops on a deadline. Pay once,
            get a first-pass draft in about a minute — then edit with your team
            or add human review (+${HUMAN_REVIEW_USD}).
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={moneyHref}
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Start narrative draft — $24
            </Link>
            <Link
              href="/engine/nonprofit-budget-allocation-calculator?sample=1&focus=intake"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Or budget narrative — $19
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/50">
            Sample intake loads in one tap. Swap your facts, add email, checkout
            on Stripe. Ads should deep-link via /go/grant.
          </p>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
                Everything inside Grant Mode
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-[#1c2230]/65">
                {grantPack.engines.length} engines. Primary path is narrative —
                outline, budget, and compliance for the rest of the workflow.
              </p>
            </div>
            <Link
              href={moneyHref}
              className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2"
            >
              Go to checkout →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {grantPack.engines.map((e) => (
              <Link
                key={e.slug}
                href={`/engine/${e.slug}?sample=1&focus=intake`}
                className="rounded-lg border border-[#0b1f3a]/10 bg-white p-5 transition hover:border-[#c9a227]/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {e.isPrimary ? "Primary · /go/grant" : e.audience}
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

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            How specialists typically use Grant Mode
          </h2>
          <ol className="mt-6 space-y-4 text-sm leading-relaxed text-[#1c2230]/75">
            <li>
              <span className="font-semibold text-[#0b1f3a]">1. Outline first.</span>{" "}
              Map FOA sections and evidence gaps before drafting prose.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">2. Narrative draft.</span>{" "}
              Paste program facts → get need / goals / approach / evaluation
              language to edit.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">3. Budget narrative.</span>{" "}
              Align allocation language to your spreadsheet — not instead of it.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">4. Compliance pack.</span>{" "}
              After award, keep reporting and evidence checklists current.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">5. Optional human review.</span>{" "}
              Add +${HUMAN_REVIEW_USD} when the draft will go to a board or
              near-final filing.
            </li>
          </ol>
          <Link
            href={moneyHref}
            className="mt-8 inline-flex rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-[#14335c]"
          >
            Start narrative checkout — $24
          </Link>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            FAQ for grant specialists
          </h2>
          <div className="mt-8 space-y-6">
            {faqs.map((item) => (
              <div key={item.q}>
                <h3 className="text-sm font-bold text-[#0b1f3a]">{item.q}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#1c2230]/70">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/how-it-works"
              className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
            >
              How delivery works
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
            >
              Governance &amp; human review
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6d13]">
            Also on Apex
          </p>
          <h2 className="mt-2 font-display text-2xl font-semibold text-[#0b1f3a]">
            Need a landlord or tenant letter instead?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Notice Mode covers landlord pay-or-quit, vacate, renewal, and deposit
            drafts. Tenant Mode covers repair, lease-break, and move-out drafts —
            same Stripe checkout as Grant Mode. Drafts only; not legal advice.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/notice-mode"
              className="inline-flex rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-[#14335c]"
            >
              Open Notice Mode →
            </Link>
            <Link
              href="/tenant-mode"
              className="inline-flex rounded-lg border border-[#0b1f3a]/15 bg-white px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:border-[#c9a227]/50"
            >
              Open Tenant Mode →
            </Link>
            <Link
              href="/modes"
              className="inline-flex rounded-lg border border-[#0b1f3a]/15 bg-white px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:border-[#c9a227]/50"
            >
              All Modes →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
