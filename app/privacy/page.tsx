import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for Apex Capital Admin Services — what data we collect, how it is used, and the third parties involved in fulfilling your order.",
  alternates: { canonical: `${appUrl}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
        Legal
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[#0b1f3a] sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-3 text-xs text-[#1c2230]/50">
        Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-8 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 p-4">
        <p className="text-sm leading-relaxed text-[#5c4a10]">
          <strong>Notice:</strong> This is a general template intended to
          provide baseline coverage for a small, live commerce site. It is
          not a substitute for review by a licensed attorney and does not
          constitute legal advice. It is written to be consistent with the
          general principles of common privacy frameworks (such as the
          GDPR and CCPA) but is not represented as a complete or
          jurisdiction-specific compliance document. Apex Capital Admin
          Services recommends having qualified legal counsel review this
          policy before any significant increase in marketing spend,
          traffic, or expansion into new jurisdictions.
        </p>
      </div>

      <div className="mt-10 space-y-8">
        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            1. Information we collect
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We collect the information you provide directly when you use
            the platform, which may include:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              Your email address, if you provide one at checkout (used to
              deliver your output and follow up on your order).
            </li>
            <li>
              The written input you submit to an engine (used solely to
              generate your requested deliverable).
            </li>
            <li>
              Basic site usage data collected via Google Analytics (e.g.,
              pages visited, device/browser type, approximate location),
              used in aggregate to understand site performance.
            </li>
            <li>
              Site search queries (what you type into the catalog search),
              stored so we can improve which engines to add next. Recent
              searches may also be kept in your browser&apos;s local storage.
            </li>
            <li>
              Optional support-chat messages you send to Apex Concierge
              (used to answer your question and improve support quality).
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We do not directly collect or store your payment card number,
            expiration date, or CVC. Payment details are entered directly
            into Stripe&apos;s secure checkout and handled under
            Stripe&apos;s own privacy and security practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            2. How we use your information
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#1c2230]/70">
            <li>To generate and deliver the deliverable you purchased.</li>
            <li>
              To send transactional communications (e.g., delivery of your
              output, receipts, responses to support requests).
            </li>
            <li>
              To maintain a record of orders for support, accounting, and
              fraud-prevention purposes.
            </li>
            <li>
              To understand aggregate site traffic and usage patterns so we
              can improve the platform.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We do not sell your personal information to third parties, and
            we do not use your submitted input or email address for
            unrelated marketing without your consent.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            3. Third parties involved in fulfillment
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed text-[#1c2230]/70">
            <li>
              <strong className="text-[#0b1f3a]">Stripe</strong> —
              processes payments and handles your payment card data
              directly; we never see or store your full card details.
            </li>
            <li>
              <strong className="text-[#0b1f3a]">Google (Gmail /
              Google Workspace)</strong> — used to send order-related and
              intake emails.
            </li>
            <li>
              <strong className="text-[#0b1f3a]">Google Analytics</strong> —
              used to measure site traffic and usage in aggregate.
            </li>
          </ul>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Each of these providers processes data under its own privacy
            policy and security practices. We share only the information
            necessary for each provider to perform its function (e.g.,
            your email and purchase details are shared with Stripe solely
            to process payment and with Google solely to deliver email).
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            4. Data retention
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We retain order records (email address, engine used, and a
            reference to the generated deliverable) for as long as
            reasonably necessary to provide support, maintain accounting
            records, and comply with legal or tax obligations. Submitted
            engine inputs are retained only as long as needed to generate
            and deliver your output, plus a limited period for support
            purposes, after which they may be deleted or anonymized.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            5. Your rights and choices
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            Depending on where you live, you may have the right to request
            access to, correction of, or deletion of the personal
            information we hold about you, or to object to certain
            processing. To make such a request, contact us at the email
            below and we will respond within a reasonable time. We will
            never charge you a fee for exercising these rights and will not
            discriminate against you for doing so.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            6. Data security
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We use reasonable administrative and technical safeguards to
            protect the information we hold, including encrypted
            connections (HTTPS) and reputable third-party infrastructure
            providers. No method of transmission or storage is completely
            secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            7. Children&apos;s privacy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            This service is intended for business and professional use by
            adults and is not directed at children under 16. We do not
            knowingly collect personal information from children.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            8. Changes to this policy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
            We may update this policy from time to time. Material changes
            will be reflected by an updated &quot;Last updated&quot; date on
            this page.
          </p>
        </section>
      </div>

      <div className="mt-12 rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
        <p className="text-sm font-semibold text-[#0b1f3a]">
          Questions about this policy, or requests regarding your data?
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
