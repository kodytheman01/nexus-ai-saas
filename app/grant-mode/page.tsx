import type { Metadata } from "next";
import Link from "next/link";
import { FLAGSHIP_ENGINES } from "@/config/flagship";
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

const grantFlagships = FLAGSHIP_ENGINES.filter((f) => f.badge === "Grant Mode");

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
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Grant Mode
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            First-pass grant drafts that respect how funders read.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Narrative, outline, budget allocation, and compliance engines —
            built for grant writers, program managers, and nonprofit ops who
            need structure before polish.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/engine/grant-proposal-narrative-generator"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Open narrative engine
            </Link>
            <Link
              href="/#catalog"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Filter Grants &amp; nonprofit in catalog
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Core Grant Mode engines
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1c2230]/65">
            Each page includes an illustrative sample excerpt and anonymized
            scenario. No fake testimonials. No guaranteed awards.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {grantFlagships.map((f) => (
              <Link
                key={f.slug}
                href={`/engine/${f.slug}`}
                className="rounded-lg border border-[#0b1f3a]/10 bg-white p-5 transition hover:border-[#c9a227]/50"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                  {f.badge}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-[#0b1f3a]">
                  {f.hook}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/60">
                  {f.scenarioTitle}. {f.scenarioBody}
                </p>
                <p className="mt-3 text-xs font-bold text-[#0b1f3a]">
                  View sample →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14">
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
              Add +${HUMAN_REVIEW_USD} when the draft will go to a board or near-final
              filing.
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14">
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
    </div>
  );
}
