import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { FLAGSHIP_ENGINES } from "@/config/flagship";
import { displayTitle } from "@/lib/display";
import { HUMAN_REVIEW_USD } from "@/lib/offer";
import { ClientCatalogView } from "./components/ClientCatalogView";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const engines = await db.calculationEngine.findMany({
    where: { isActive: true },
    orderBy: { title: "asc" },
    select: {
      slug: true,
      title: true,
      description: true,
      priceInUSD: true,
      category: true,
    },
  });

  const categories = Array.from(new Set(engines.map((e) => e.category)));
  const bySlug = new Map(engines.map((e) => [e.slug, e]));
  const flagships = FLAGSHIP_ENGINES.map((f) => ({
    ...f,
    engine: bySlug.get(f.slug),
  })).filter((f) => f.engine);

  const grantFlagships = flagships.filter((f) => f.badge === "Grant Mode");

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 70% 20%, #c9a227 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 10% 90%, #14335c 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              Apex Capital Admin Services
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
              Draft-ready grant, contract, and ops deliverables — from intake to
              output.
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              500 specialized engines. Stripe-secured checkout. Instant on-page
              delivery plus email copy. Optional human specialist review (+$
              {HUMAN_REVIEW_USD}) when the stakes are high.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#grant-mode"
                className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
              >
                Start with Grant Mode
              </a>
              <a
                href="#catalog"
                className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
              >
                Browse all 500 engines
              </a>
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: "Instant draft", detail: "Typically under 60 seconds" },
              { label: "Email copy", detail: "Sent to your checkout address" },
              {
                label: "Full catalog",
                detail: `${engines.length || 500} engines live`,
              },
              {
                label: "Human review",
                detail: `Optional +$${HUMAN_REVIEW_USD} specialist pass`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-4"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#c9a227]">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-white/55">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {grantFlagships.length > 0 ? (
        <section
          id="grant-mode"
          className="scroll-mt-24 border-b border-[#0b1f3a]/10 bg-[#f7f5f0]"
        >
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6d13]">
                Grant Mode
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[#0b1f3a] sm:text-3xl">
                Built for people who write and manage grants
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/65">
                Narrative drafts, FOA outlines, budget allocation language, and
                compliance checklists — then refine with your team or add human
                review at checkout.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {grantFlagships.map((f) => (
                <Link
                  key={f.slug}
                  href={`/engine/${f.slug}`}
                  className="group rounded-lg border border-[#0b1f3a]/10 bg-white p-5 transition hover:border-[#c9a227]/50 hover:shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {f.badge}
                  </span>
                  <h3 className="mt-2 font-display text-base font-semibold text-[#0b1f3a] group-hover:text-[#14335c]">
                    {displayTitle(f.engine!.title)}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#1c2230]/60">
                    {f.hook}
                  </p>
                  <p className="mt-3 font-mono text-sm font-bold text-[#0b1f3a]">
                    ${f.engine!.priceInUSD}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {flagships.length > 0 ? (
        <section className="border-b border-[#0b1f3a]/10 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-14">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
                  Flagship engines
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold text-[#0b1f3a]">
                  See the work before you buy
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/65">
                  Each flagship page includes an illustrative sample excerpt and
                  anonymized scenario — not a fake testimonial. All 500 engines
                  remain in the catalog below.
                </p>
              </div>
              <a
                href="#catalog"
                className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
              >
                Jump to full catalog
              </a>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {flagships.map((f) => (
                <Link
                  key={f.slug}
                  href={`/engine/${f.slug}`}
                  className="group rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5 transition hover:border-[#c9a227]/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                        {f.badge}
                      </span>
                      <h3 className="mt-1 font-display text-lg font-semibold text-[#0b1f3a]">
                        {displayTitle(f.engine!.title)}
                      </h3>
                    </div>
                    <span className="shrink-0 font-mono text-sm font-bold text-[#0b1f3a]">
                      ${f.engine!.priceInUSD}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/40">
                    Illustrative scenario
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0b1f3a]/85">
                    {f.scenarioTitle}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#1c2230]/60">
                    {f.scenarioBody}
                  </p>
                  <p className="mt-3 text-xs font-bold text-[#0b1f3a] group-hover:text-[#14335c]">
                    View sample excerpt →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div id="catalog" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Full catalog — {engines.length || 500} engines
          </h2>
          <p className="mt-1 text-sm text-[#1c2230]/60">
            Search every engine. Use Grants &amp; nonprofit to filter. Recent
            searches stay on this device.
          </p>
        </div>
        {engines.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#0b1f3a]/20 bg-white p-10 text-center">
            <p className="font-semibold text-[#0b1f3a]">
              No engines available yet.
            </p>
            <p className="mt-2 text-sm text-[#1c2230]/60">
              Run{" "}
              <code className="rounded bg-[#0b1f3a]/5 px-1.5 py-0.5">
                npx prisma db seed
              </code>{" "}
              then refresh.
            </p>
          </div>
        ) : (
          <Suspense
            fallback={
              <div className="rounded-lg border border-[#0b1f3a]/10 bg-white p-8 text-sm text-[#1c2230]/50">
                Loading catalog…
              </div>
            }
          >
            <ClientCatalogView initialEngines={engines} categories={categories} />
          </Suspense>
        )}
      </div>

      <section className="border-t border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Trust &amp; delivery
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a] sm:text-3xl">
            Instant drafts. Optional human review. No fake endorsements.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#1c2230]/70">
            Scenarios on this site are illustrative. Outputs are informational
            drafts — not licensed legal, financial, tax, or medical advice.
            When you need a second set of eyes, add human specialist review at
            checkout.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4 transition hover:text-[#0b1f3a]/70"
            >
              Platform &amp; governance
            </Link>
            <Link
              href="/privacy"
              className="text-sm font-semibold text-[#0b1f3a]/60 underline underline-offset-4 hover:text-[#0b1f3a]"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="text-sm font-semibold text-[#0b1f3a]/60 underline underline-offset-4 hover:text-[#0b1f3a]"
            >
              Terms
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
