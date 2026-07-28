import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for Apex Capital Admin Services — payment terms, refund policy, acceptable use, and limitation of liability for our automated deliverable engines.",
  alternates: { canonical: `${appUrl}/terms` },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
        Legal
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-3 text-xs text-[#1c2230]/50">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 p-4">
        <p className="text-sm leading-relaxed text-[#5c4a10]">
          <strong>Notice:</strong> This is a general template intended to
          provide baseline coverage for a small, live commerce site. It is
          not a substitute for review by a licensed attorney and does not
          constitute legal advice. Apex Capital Admin Services recommends
          having qualified legal counsel review and, where appropriate,
          customize these terms before any significant increase in
          marketing spend, transaction volume, or expansion into new
          jurisdictions.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            1. Nature of the service
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Apex Capital Admin Services (&quot;we,&quot; &quot;us,&quot; or
            &quot;the platform&quot;) operates a catalog of automated,
            AI-driven &quot;engines.&quot; Each engine accepts a written
            description of your situation and returns a computer-generated
            deliverable (a document, blueprint, script, checklist, or
            similar output). Deliverables are generated automatically by
            software. Unless you purchase the optional human specialist review
            add-on, outputs are not reviewed by a licensed professional prior
            to delivery. Even with human review, outputs remain informational
            drafts and do not constitute legal, financial, tax, medical, or
            certified engineering advice, and no advisor-client, fiduciary, or
            professional relationship is created by using this service. You
            should have any deliverable reviewed by a qualified, licensed
            professional before relying on it for a regulated or consequential
            decision.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            1A. Human specialist review add-on
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            If you purchase the optional human specialist review add-on at
            checkout, Apex Capital Admin Services operations staff will review
            the computer-generated deliverable after delivery and email notes
            to the address you provided, typically within one business day.
            This review is an operational quality pass (clarity, structure,
            obvious gaps, and suggested edits). It is not licensed legal,
            financial, tax, medical, or engineering advice; it does not create
            an attorney–client, CPA–client, or fiduciary relationship; and it
            does not certify fitness for any particular filing, contract
            execution, or regulated use. Failure to receive review notes due
            to an incorrect email address is not grounds for a refund of the
            underlying engine purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            2. Payment terms
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Prices are listed in U.S. Dollars (USD) on each engine&apos;s
            page. Payment is processed by Stripe, a third-party payment
            processor. We do not directly collect or store your full
            payment card details on our systems — Stripe handles that data
            under its own terms and security standards. By submitting
            payment, you represent that you are authorized to use the
            payment method provided.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            3. Refund policy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Because deliverables are generated and delivered automatically,
            typically within seconds of payment, <strong>all sales are
            final</strong> once a deliverable has been successfully
            generated and delivered. If your input requires clarification
            or refinement, one complimentary regeneration is available per
            purchase — contact us at the email below and we will re-run the
            engine with a corrected input at no additional charge. Refunds
            will be issued only in cases where we fail to deliver a
            deliverable due to a technical failure on our end and are
            unable to remedy it through regeneration. To request a refund
            under these circumstances, contact us within 14 days of
            purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            4. Acceptable use
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            You agree to use this platform only for lawful purposes. You may
            not use the service to generate content that is illegal, that
            infringes on the rights of others, or that you intend to
            misrepresent as independently verified professional advice
            (e.g., presenting an automated output as work product from a
            licensed attorney, CPA, physician, or engineer). We reserve the
            right to refuse service, decline a transaction, or suspend
            access for suspected abuse, fraud, or violation of these terms.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            5. Limitation of liability
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            To the fullest extent permitted by law, Apex Capital Admin
            Services and its operators shall not be liable for any
            indirect, incidental, special, consequential, or punitive
            damages, or any loss of profits or revenues, arising from your
            use of, or inability to use, the service or any deliverable
            generated by it. Our total aggregate liability for any claim
            arising out of or relating to these terms or the service is
            limited to the amount you paid for the specific deliverable
            giving rise to the claim. Deliverables are provided &quot;as
            is&quot; and &quot;as available,&quot; without warranties of any
            kind, express or implied, including warranties of accuracy,
            fitness for a particular purpose, or non-infringement.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            6. Professional review required for regulated decisions
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Deliverables are not a substitute for licensed legal, financial,
            tax, medical, or engineering advice. If you intend to rely on a
            deliverable for a regulated, financial, medical, legal,
            compliance, or safety-critical decision, you should have it
            reviewed by an appropriately licensed professional before
            acting on it.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            7. Governing law
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            These terms are governed by the laws of the United States,
            without regard to conflict-of-law principles, except as
            otherwise required by applicable local consumer protection law.
            If any provision of these terms is found unenforceable, the
            remaining provisions will remain in full effect.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            8. Changes to these terms
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We may update these terms from time to time. Material changes
            will be reflected by an updated &quot;Last updated&quot; date on
            this page. Continued use of the service after changes are
            posted constitutes acceptance of the revised terms.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
        <p className="text-sm font-semibold text-[#0b1f3a]">
          Questions about these terms? Contact:{" "}
          <a
            href="mailto:admin@apexcapitaladmin.com"
            className="underline decoration-[#c9a227] decoration-2 underline-offset-4"
          >
            admin@apexcapitaladmin.com
          </a>
        </p>
      </div>
    </div>
  );
}
