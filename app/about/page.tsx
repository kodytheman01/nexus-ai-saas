import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Apex Capital Admin Services operates 500 automated advisory engines — Stripe checkout, instant drafts, optional human review, and clear governance.",
  alternates: { canonical: `${appUrl}/about` },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
        About the Platform
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
        Apex Capital Admin Services
      </h1>
      <p className="mt-4 text-base leading-relaxed text-[#1c2230]/70">
        Apex Capital Admin Services designs and operates a catalog of 500
        automated advisory and deliverable engines. Each engine is a
        purpose-built pipeline that takes a client&apos;s written description of
        a problem and returns a structured draft — narrative, checklist,
        outline, or report — without waiting on a manual queue.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            What you actually receive
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                A customized draft
              </span>{" "}
              generated from your intake — not a generic PDF brochure.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                On-page delivery
              </span>{" "}
              typically under 60 seconds after payment confirmation.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                One regeneration token
              </span>{" "}
              if your first intake needs correction.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Optional human specialist review (+${HUMAN_REVIEW_USD})
              </span>{" "}
              — Apex ops reviews the generated deliverable within 1 business day
              and emails notes to your checkout address.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            The operating model
          </h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <span className="font-semibold text-[#0b1f3a]">Intake.</span> Select
              an engine and describe your situation.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Secure payment.
              </span>{" "}
              Checkout runs through Stripe. We do not store card numbers.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Automated generation.
              </span>{" "}
              The engine produces a structured draft from your inputs.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Delivery &amp; record.
              </span>{" "}
              You receive the deliverable immediately, with an auditable run
              record on our side.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Who reviews human-review orders?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            When you add human specialist review (+${HUMAN_REVIEW_USD}), Apex
            operations staff perform a post-delivery quality pass on your
            generated draft — checking clarity, structure, obvious gaps, and
            suggested edits — then email notes within 1 business day. Reviewers
            are ops specialists supporting the platform; this is not a licensed
            attorney, CPA, grant officer, or medical professional engagement,
            and it does not create a professional–client relationship.
          </p>
          <ul className="mt-3 space-y-1 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <span className="font-semibold text-[#0b1f3a]">In scope:</span>{" "}
              structure, readability, missing sections, and practical next-edit
              notes.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">Out of scope:</span>{" "}
              legal opinions, filing certification, financial audits, or
              guaranteed funder outcomes.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Samples and scenarios
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Flagship engine pages include illustrative sample excerpts and
            anonymized scenarios so you can judge structure before purchase.
            Those scenarios are not client endorsements or guaranteed outcomes.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Entity, support &amp; data retention
          </h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <span className="font-semibold text-[#0b1f3a]">Legal name:</span>{" "}
              Apex Capital Admin Services · Operating from Texas, USA
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">Support:</span>{" "}
              admin@apexcapitaladmin.com · (214) 506-3083 · Mon–Fri, 9am–5pm
              Central
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Human review SLA:
              </span>{" "}
              Within 1 business day of generation (ops quality pass — not
              licensed advice)
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">Retention:</span>{" "}
              Order records (email, engine, deliverable reference) are kept as
              needed for support, accounting, and legal obligations. Intake text
              is retained only as long as needed to generate, deliver, and
              support your order, then may be deleted or anonymized.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">Do not submit:</span>{" "}
              SSNs, medical PHI, passwords, or API secrets in intake.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Governance and standards
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Every engine run is logged. Outputs are informational and structural
            drafts — not a substitute for licensed legal, financial, tax,
            medical, or engineering advice. For regulated filings, board packs,
            or contracts you intend to execute, use the human review add-on
            and/or have a qualified professional review before reliance.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#1c2230]/70">
            We do not claim bar admission, CPA licensure, or grant-making
            authority. We operate an admin and deliverable engine layer with
            transparent pricing and optional human ops follow-up.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
        <p className="text-sm leading-relaxed text-[#1c2230]/70">
          Built for grant writers, operators, founders, and specialists who need
          a first-pass draft fast — then refinement where it matters.
        </p>
        <p className="mt-4 text-sm font-semibold text-[#0b1f3a]">
          Contact:{" "}
          <a
            href="mailto:admin@apexcapitaladmin.com"
            className="underline decoration-[#c9a227] decoration-2 underline-offset-4"
          >
            admin@apexcapitaladmin.com
          </a>
        </p>
        <p className="mt-2 text-sm text-[#1c2230]/60">
          Phone:{" "}
          <a href="tel:+12145063083" className="underline underline-offset-2">
            (214) 506-3083
          </a>
          {" · "}Operating from Texas, USA
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <Link
            href="/grant-mode"
            className="font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
          >
            Grant Mode
          </Link>
          <Link
            href="/how-it-works"
            className="font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
          >
            How it works
          </Link>
          <Link
            href="/#catalog"
            className="font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
          >
            Full catalog
          </Link>
          <Link
            href="/terms"
            className="font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
