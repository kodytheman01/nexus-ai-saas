import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Apex Capital Admin Services delivers structured drafts: Modes, intake, Stripe checkout, instant generation, email copy, optional human review.",
  alternates: { canonical: `${appUrl}/how-it-works` },
};

const steps = [
  {
    title: "Choose a Mode or engine",
    body: "Start in Grant, Notice, Bid, or Offer Mode — or browse 500+ specialized engines. Paid ads deep-link via /go/* with sample intake ready.",
  },
  {
    title: "Write a real intake",
    body: "Each engine page shows a filled specialist example. Facts, metrics, constraints, and audience beat vague prompts.",
  },
  {
    title: "Pay securely with Stripe",
    body: "Card details stay with Stripe. Email is required so we can deliver a copy and support your order.",
  },
  {
    title: "Receive the draft instantly",
    body: "On-page delivery typically under 60 seconds, plus an emailed .md copy and a Download button on the success page.",
  },
  {
    title: "Refine or add human review",
    body: `One complimentary regeneration is included when offered. Optional human specialist review (+$${HUMAN_REVIEW_USD}) adds an Apex ops quality pass within 1 business day.`,
  },
];

const assurances = [
  {
    title: "Specialist sample intakes",
    body: "Every live engine can load a filled example so you see structure before you pay.",
  },
  {
    title: "Mode money paths",
    body: "/go/grant, /go/notice, /go/bid, /go/offer skip the catalog wall and land on the right draft.",
  },
  {
    title: "State packs where it matters",
    body: "Notice Mode includes TX / FL / CA oriented packs — still drafts, still confirm locally.",
  },
  {
    title: "No fake endorsements",
    body: "We publish process notes only after real paid orders — never invented testimonials.",
  },
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Operating model
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            How it works
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Apex is a deliverable engine layer — not a marketplace of unverified
            freelancers, and not a licensed advisory firm. You buy a structured
            draft generated from your intake, with optional human ops review when
            stakes are high.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/modes"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              View all Modes
            </Link>
            <Link
              href="/platform"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Platform overview
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <ol className="space-y-8">
            {steps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b1f3a] text-sm font-bold text-[#c9a227]">
                  {i + 1}
                </span>
                <div>
                  <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
                    {step.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[#1c2230]/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Built like a serious product
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1c2230]/65">
            The same operating layer under every Mode and every catalog engine.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {assurances.map((a) => (
              <div
                key={a.title}
                className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5"
              >
                <h3 className="font-display text-lg font-semibold text-[#0b1f3a]">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
                  {a.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <div className="rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
            <h2 className="font-display text-lg font-semibold text-[#0b1f3a]">
              What you should expect (and not expect)
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
              <li>
                <span className="font-semibold text-[#0b1f3a]">Expect:</span> a
                structured, editable draft; transparent pricing; Stripe checkout;
                email delivery; clear disclaimers.
              </li>
              <li>
                <span className="font-semibold text-[#0b1f3a]">Do not expect:</span>{" "}
                licensed legal/CPA/medical advice, guaranteed grant awards, or
                attorney–client privilege from the human review add-on.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/go/grant"
                className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
              >
                Start Grant Mode
              </Link>
              <Link
                href="/go/notice"
                className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2.5 text-sm font-bold text-[#0b1f3a]"
              >
                Start Notice Mode
              </Link>
              <Link
                href="/faq"
                className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2.5 text-sm font-bold text-[#0b1f3a]"
              >
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
