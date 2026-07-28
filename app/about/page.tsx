import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "Apex Capital Admin Services operates a suite of automated advisory and deliverable engines — secure Stripe payments, instant AI-generated outputs, and an auditable delivery record.",
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
        Apex Capital Admin Services designs and operates a catalog of
        automated advisory and deliverable engines. Each engine is a
        purpose-built pipeline that takes a client&apos;s written description
        of a problem and returns a structured, professional-grade
        deliverable — a blueprint, script, checklist, or report — without
        manual drafting.
      </p>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            What the platform does
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            The catalog spans a range of specialized knowledge domains. Each
            engine defines its own intake fields, generation logic, and
            output format, so clients receive a deliverable tailored to their
            specific request rather than a generic template.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            The operating model
          </h2>
          <ul className="mt-2 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <span className="font-semibold text-[#0b1f3a]">Intake.</span>{" "}
              A client selects an engine and submits a description of their
              situation through a structured form.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Secure payment.
              </span>{" "}
              Checkout is processed through Stripe. No payment information is
              stored on our systems.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Automated generation.
              </span>{" "}
              Upon confirmation, the corresponding engine runs and produces a
              deliverable, typically within seconds.
            </li>
            <li>
              <span className="font-semibold text-[#0b1f3a]">
                Delivery &amp; record.
              </span>{" "}
              The client receives the deliverable immediately, with a single
              complimentary regeneration available if the initial input needs
              refinement.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Governance and standards
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Every engine and deliverable is versioned and logged. Outputs are
            informational and computational in nature and are not a
            substitute for licensed legal, financial, tax, medical, or
            engineering advice — clients are encouraged to have deliverables
            reviewed by a qualified professional before relying on them for
            regulated decisions.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
        <p className="text-sm leading-relaxed text-[#1c2230]/70">
          Apex Capital Admin Services is built to operate as a durable,
          low-overhead engine layer: consistent processes, transparent
          pricing, and deliverables that stand on their own merits. We
          welcome inquiries from partners, grant reviewers, and institutional
          collaborators.
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
      </div>
    </div>
  );
}
