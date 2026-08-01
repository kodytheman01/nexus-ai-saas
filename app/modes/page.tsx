import type { Metadata } from "next";
import Link from "next/link";
import { MODE_AD_CATALOG } from "@/config/mode-catalog";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Modes",
  description:
    "Apex Modes — Grant, Notice, Bid, and Offer. See every engine inside each Mode. Sample intake, Stripe checkout, optional human review.",
  alternates: { canonical: `${appUrl}/modes` },
};

export default function ModesPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 80% 10%, #c9a227 0%, transparent 55%), radial-gradient(ellipse 45% 40% at 5% 85%, #14335c 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Apex Capital Admin Services
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            Four Modes. Every engine inside.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Each Mode is a focused path — and every tool inside it is listed
            below. Sample intake ready, Stripe checkout, on-page + email
            delivery, optional human review (+${HUMAN_REVIEW_USD}).
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {MODE_AD_CATALOG.map((m) => (
              <a
                key={m.id}
                href={`#${m.id}`}
                className="rounded-lg border border-white/25 bg-white/5 px-4 py-2.5 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
              >
                {m.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {MODE_AD_CATALOG.map((m) => {
        const primary = m.engines.find((e) => e.isPrimary) ?? m.engines[0];
        return (
          <section
            key={m.id}
            id={m.id}
            className="scroll-mt-24 border-b border-[#0b1f3a]/10 bg-[#f7f5f0] odd:bg-white"
          >
            <div className="mx-auto max-w-6xl px-4 py-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6d13]">
                    {m.audience}
                  </p>
                  <h2 className="mt-2 font-display text-3xl font-semibold text-[#0b1f3a]">
                    {m.name}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
                    {m.tagline}. {m.engines.length} engines · {m.priceRange}.
                  </p>
                  <p className="mt-2 text-xs text-[#1c2230]/55">{m.disclaimer}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href={m.goPath}
                    className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0] transition hover:bg-[#14335c]"
                  >
                    Start {m.name.split(" ")[0]} — money path
                  </Link>
                  <Link
                    href={m.hubPath}
                    className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2.5 text-sm font-bold text-[#0b1f3a]"
                  >
                    Full guide
                  </Link>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {m.engines.map((e) => (
                  <Link
                    key={e.slug}
                    href={`/engine/${e.slug}?sample=1&focus=intake`}
                    className="group flex flex-col rounded-lg border border-[#0b1f3a]/10 bg-white p-4 transition hover:border-[#c9a227]/50 hover:shadow-sm"
                  >

                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                        {e.isPrimary ? "Primary · money path" : e.audience}
                      </p>
                      <p className="font-mono text-sm font-bold text-[#0b1f3a]">
                        ${e.price}
                      </p>
                    </div>
                    <h3 className="mt-1.5 font-display text-base font-semibold text-[#0b1f3a] group-hover:text-[#14335c]">
                      {e.title}
                    </h3>
                    <p className="mt-2 flex-1 text-xs leading-relaxed text-[#1c2230]/65">
                      {e.hook}
                    </p>
                    <p className="mt-3 text-xs font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2">
                      Open sample intake →
                    </p>
                  </Link>
                ))}
              </div>

              <p className="mt-6 text-sm text-[#1c2230]/60">
                Fastest start:{" "}
                <Link
                  href={`/engine/${primary.slug}?sample=1&focus=intake`}
                  className="font-semibold text-[#0b1f3a] underline underline-offset-2"
                >
                  {primary.title}
                </Link>{" "}
                or jump straight to{" "}
                <Link
                  href={m.goPath}
                  className="font-semibold text-[#0b1f3a] underline underline-offset-2"
                >
                  {m.goPath}
                </Link>
                .
              </p>
            </div>
          </section>
        );
      })}

      <section className="bg-[#0b1f3a]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-display text-xl font-semibold text-[#f7f5f0] sm:text-2xl">
            Advertise the Mode — then the engines inside it
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Cold traffic hits the Mode money URL. Follow-up content deep-links
            each engine with sample intake loaded. Full catalog stays open for
            searchers who know exactly what they need.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/vision"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a]"
            >
              Vision
            </Link>
            <Link
              href="/#catalog"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0]"
            >
              Full catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
