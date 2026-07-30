import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "How Apex Capital Admin Services delivers structured drafts: intake, Stripe checkout, instant generation, email copy, optional human review.",
  alternates: { canonical: `${appUrl}/how-it-works` },
};

const steps = [
  {
    title: "Choose an engine",
    body: "Browse 500+ specialized engines — or start in Grant Mode (narratives) or Notice Mode (landlord/tenant letters).",
  },
  {
    title: "Write a real intake",
    body: "Each engine page shows a filled example. Facts, metrics, constraints, and audience beat vague prompts.",
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
    body: `One complimentary regeneration is included. Optional human specialist review (+$${HUMAN_REVIEW_USD}) adds an Apex ops quality pass within 1 business day.`,
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
        Operating model
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
        How it works
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#1c2230]/70">
        Apex is a deliverable engine layer — not a marketplace of unverified
        freelancers, and not a licensed advisory firm. You buy a structured
        draft generated from your intake, with optional human ops review when
        stakes are high.
      </p>

      <ol className="mt-12 space-y-8">
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

      <div className="mt-12 rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
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
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/grant-mode"
            className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
          >
            Start Grant Mode
          </Link>
          <Link
            href="/notice-mode"
            className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2.5 text-sm font-bold text-[#0b1f3a]"
          >
            Start Notice Mode
          </Link>
        </div>
      </div>
    </div>
  );
}
