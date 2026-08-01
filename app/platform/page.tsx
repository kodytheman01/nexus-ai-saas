import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "How the Apex Capital Admin Services platform works — 500+ engines, Modes, Stripe checkout, delivery, security posture, and optional human review.",
  alternates: { canonical: `${appUrl}/platform` },
};

const pillars = [
  {
    title: "Specialized engines",
    body: "Each engine is a purpose-built prompt pipeline with specialist sample intake — not a single generic chatbot.",
  },
  {
    title: "Modes for money paths",
    body: "Grant, Notice, Bid, and Offer Modes deep-link paid traffic to the right draft with sample intake already loaded.",
  },
  {
    title: "Checkout you can trust",
    body: "Stripe hosts card data. We never store card numbers. Email is required so deliverables and support can reach you.",
  },
  {
    title: "Delivery + record",
    body: "On-page draft typically under 60 seconds, emailed .md copy, download on success, auditable run record on our side.",
  },
  {
    title: "Optional human review",
    body: `Add +$${HUMAN_REVIEW_USD} for an Apex ops quality pass within 1 business day — structure and clarity notes, not licensed advice.`,
  },
  {
    title: "Honest positioning",
    body: "Outputs are informational drafts. No invented testimonials. No guaranteed grants, court outcomes, or funded awards.",
  },
];

const stack = [
  "Next.js application layer",
  "Stripe Checkout + webhooks",
  "Structured AI generation",
  "Email deliverable copy",
  "Optional Inngest job workflows",
  "GA4 + Meta measurement (privacy-aware)",
];

export default function PlatformPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 55% at 60% 0%, #c9a227 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Platform
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            A production draft engine — not a brochure site.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Apex Capital Admin Services is an operating layer for structured
            admin drafts: intake → secure payment → generation → delivery →
            optional human ops review. Built for operators who need speed
            without fake social proof.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/modes"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Explore Modes
            </Link>
            <Link
              href="/how-it-works"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            What the platform includes
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1c2230]/65">
            The same factory powers every Mode and every catalog engine.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-[#0b1f3a]/10 bg-white p-5"
              >
                <h3 className="font-display text-lg font-semibold text-[#0b1f3a]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
              Security &amp; payments posture
            </h2>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-[#1c2230]/70">
              <li>
                <span className="font-semibold text-[#0b1f3a]">Cards:</span>{" "}
                processed by Stripe; we do not store PAN/CVV.
              </li>
              <li>
                <span className="font-semibold text-[#0b1f3a]">Intake:</span> do
                not paste SSNs, medical PHI, passwords, or API secrets.
              </li>
              <li>
                <span className="font-semibold text-[#0b1f3a]">Records:</span>{" "}
                order metadata kept for support, accounting, and legal
                obligations; intake retained only as needed to deliver and
                support.
              </li>
              <li>
                <span className="font-semibold text-[#0b1f3a]">Support:</span>{" "}
                admin@apexcapitaladmin.com · (214) 506-3083 · Mon–Fri 9am–5pm
                CT.
              </li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
              Production stack (high level)
            </h2>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
              {stack.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a227]" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-[#1c2230]/50">
              Stack details may evolve. What matters to buyers of drafts:
              reliable checkout, fast generation, email copy, and clear
              disclaimers.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Ready to run a draft?
          </h2>
          <p className="mt-3 text-sm text-[#1c2230]/65">
            Pick a Mode, or open the catalog and search.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/go/grant"
              className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0]"
            >
              Grant
            </Link>
            <Link
              href="/go/notice"
              className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0]"
            >
              Notice
            </Link>
            <Link
              href="/go/bid"
              className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0]"
            >
              Bid
            </Link>
            <Link
              href="/go/offer"
              className="rounded-lg bg-[#0b1f3a] px-5 py-3 text-sm font-bold text-[#f7f5f0]"
            >
              Offer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
