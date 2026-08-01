import Link from "next/link";
import type { ModeAdPack } from "@/config/mode-catalog";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

type Faq = { q: string; a: string };

type Props = {
  pack: ModeAdPack;
  headline: string;
  subhead: string;
  primaryCtaLabel: string;
  secondary?: { href: string; label: string };
  faqs: Faq[];
};

function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
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

export function ModeHubPage({
  pack,
  headline,
  subhead,
  primaryCtaLabel,
  secondary,
  faqs,
}: Props) {
  const primary = pack.engines.find((e) => e.isPrimary) ?? pack.engines[0];
  const moneyHref = `/engine/${primary.slug}?sample=1&focus=intake`;

  return (
    <div>
      <FaqJsonLd faqs={faqs} />
      <section className="border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Apex · {pack.name}
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            {subhead} Optional human review (+${HUMAN_REVIEW_USD}).
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={moneyHref}
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              {primaryCtaLabel}
            </Link>
            {secondary ? (
              <Link
                href={secondary.href}
                className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
              >
                {secondary.label}
              </Link>
            ) : null}
            <Link
              href="/modes"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              All Modes
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-xs leading-relaxed text-white/50">
            Ads should deep-link via {pack.goPath}. {pack.disclaimer}
          </p>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Everything inside {pack.name}
          </h2>
          <p className="mt-2 text-sm text-[#1c2230]/65">
            {pack.engines.length} engines — advertise the Mode, then each tool.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pack.engines.map((e) => (
              <Link
                key={e.slug}
                href={`/engine/${e.slug}?sample=1&focus=intake`}
                className="rounded-lg border border-[#0b1f3a]/10 bg-white p-5 transition hover:border-[#c9a227]/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {e.isPrimary ? `Primary · ${pack.goPath}` : e.audience}
                  </p>
                  <p className="font-mono text-sm font-bold text-[#0b1f3a]">
                    ${e.price}
                  </p>
                </div>
                <h3 className="mt-1 font-display text-lg font-semibold text-[#0b1f3a]">
                  {e.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/65">
                  {e.hook}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            FAQ
          </h2>
          <dl className="mt-6 space-y-5">
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="text-sm font-bold text-[#0b1f3a]">{item.q}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-[#1c2230]/70">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </div>
  );
}
