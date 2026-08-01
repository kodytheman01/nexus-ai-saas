import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about Apex Capital Admin Services — pricing, delivery, Modes, human review, and what drafts are (and are not).",
  alternates: { canonical: `${appUrl}/faq` },
};

const faqs = [
  {
    q: "What am I buying?",
    a: "A structured draft generated from your written intake for a specific engine — narrative, letter, checklist, outline, or similar deliverable. You also get an emailed copy and typically one regeneration token.",
  },
  {
    q: "How fast is delivery?",
    a: "On-page delivery is typically under 60 seconds after Stripe confirms payment. An email copy goes to the checkout address.",
  },
  {
    q: "What are Modes?",
    a: "Grant, Notice, Bid, and Offer Modes are focused entry paths into the catalog with money URLs (/go/grant, /go/notice, /go/bid, /go/offer) and sample intakes. The full 500+ engine catalog remains available.",
  },
  {
    q: "Is this legal advice / will my grant get funded?",
    a: "No. Outputs are informational drafts for structural reference. Rules vary by jurisdiction and funder. Confirm with a qualified professional before serving, filing, or submitting. No product can guarantee funding or legal outcomes.",
  },
  {
    q: `What does human review (+$${HUMAN_REVIEW_USD}) include?`,
    a: "An Apex ops specialist reviews the generated draft for clarity, structure, and obvious gaps, then emails notes within 1 business day. It is not a licensed attorney, CPA, grant officer, or medical engagement.",
  },
  {
    q: "Do you store my card number?",
    a: "No. Checkout runs through Stripe. We do not store card numbers.",
  },
  {
    q: "What should I put in intake?",
    a: "Real facts: parties, dates, amounts, constraints, audience, and measurable details. Every engine page can load a specialist sample — replace the sample with your facts before checkout.",
  },
  {
    q: "What should I never paste into intake?",
    a: "SSNs, medical PHI, passwords, API secrets, or full card numbers. Redact sensitive identifiers when possible.",
  },
  {
    q: "Can I get a refund?",
    a: "See Terms of Service. Because deliverables are generated instantly from your intake, refunds are limited; contact support if generation failed or payment duplicated.",
  },
  {
    q: "Who do I contact for support?",
    a: "admin@apexcapitaladmin.com or (214) 506-3083, Mon–Fri 9am–5pm Central. Include your checkout email and approximate purchase time.",
  },
];

function FaqJsonLd() {
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

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <FaqJsonLd />
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
        Help
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
        Frequently asked questions
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#1c2230]/70">
        Straight answers about drafts, Modes, checkout, and review. For Mode-
        specific detail, open the Mode guides.
      </p>

      <dl className="mt-12 space-y-8">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="font-display text-lg font-semibold text-[#0b1f3a]">
              {item.q}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
              {item.a}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-12 flex flex-wrap gap-4 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-6">
        <Link
          href="/modes"
          className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
        >
          All Modes
        </Link>
        <Link
          href="/how-it-works"
          className="text-sm font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
        >
          How it works
        </Link>
        <Link
          href="/terms"
          className="text-sm font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
        >
          Terms
        </Link>
        <Link
          href="/privacy"
          className="text-sm font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
        >
          Privacy
        </Link>
      </div>
    </div>
  );
}
