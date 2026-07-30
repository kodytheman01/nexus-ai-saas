import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { FLAGSHIP_ENGINES } from "@/config/flagship";
import {
  grantMoneyLandingPath,
  isGrantPaidTraffic,
} from "@/config/conversion";
import { ANONYMIZED_WINS } from "@/config/wins";
import { displayTitle } from "@/lib/display";
import { HUMAN_REVIEW_USD } from "@/lib/offer";
import { ClientCatalogView } from "./components/ClientCatalogView";
import { FindEnginePrompt } from "./components/FindEnginePrompt";

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: Props) {
  const sp = await searchParams;

  // Paid Grant Mode ads should not dump into the 500-engine wall —
  // send them straight to the money engine with sample intake ready.
  if (isGrantPaidTraffic(sp)) {
    redirect(grantMoneyLandingPath(sp));
  }

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
              {`500 specialized engines. Stripe-secured checkout. Instant on-page delivery plus email copy. Optional human specialist review (+$${HUMAN_REVIEW_USD}) when the stakes are high.`}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/engine/grant-proposal-narrative-generator?sample=1&focus=intake"
                className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
              >
                Start with Grant Mode
              </Link>
              <Link
                href="/?view=all#catalog"
                className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
              >
                Browse all 500 engines
              </Link>
            </div>
          </div>

          <div className="mt-10 max-w-xl">
            <FindEnginePrompt variant="dark" />
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
          <div className="mx-auto max-w-6xl px-4 py-10">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8a6d13]">
                  Grant Mode
                </p>
                <h2 className="mt-1 font-display text-xl font-semibold text-[#0b1f3a] sm:text-2xl">
                  Fastest path if you write grants
                </h2>
              </div>
              <Link
                href="/grant-mode"
                className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2"
              >
                Full guide →
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {grantFlagships.map((f) => (
                <Link
                  key={f.slug}
                  href={`/engine/${f.slug}?sample=1&focus=intake`}
                  className="group rounded-lg border border-[#0b1f3a]/10 bg-white p-4 transition hover:border-[#c9a227]/50 hover:shadow-sm"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {f.badge}
                  </span>
                  <h3 className="mt-1.5 font-display text-sm font-semibold text-[#0b1f3a] group-hover:text-[#14335c]">
                    {displayTitle(f.engine!.title)}
                  </h3>
                  <p className="mt-2 font-mono text-sm font-bold text-[#0b1f3a]">
                    ${f.engine!.priceInUSD}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <div id="catalog" className="scroll-mt-24 mx-auto max-w-6xl px-4 py-10">
        <div className="mb-5">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Catalog — flagships first
          </h2>
          <p className="mt-1 text-sm text-[#1c2230]/60">
            Start with Flagships. Tap All or search anytime — all{" "}
            {engines.length || 500} engines stay available.
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
            <ClientCatalogView
              initialEngines={engines}
              categories={categories}
              initialCategory="flagships"
            />
          </Suspense>
        )}
      </div>

      <section className="border-t border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a] sm:text-2xl">
            Instant drafts. Optional human review. No fake endorsements.
          </h2>
          {ANONYMIZED_WINS.length > 0 ? (
            <div className="mx-auto mt-6 grid max-w-3xl gap-3 text-left sm:grid-cols-2">
              {ANONYMIZED_WINS.map((w) => (
                <div
                  key={w.id}
                  className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                    {w.dateLabel} · {w.role}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[#0b1f3a]">
                    {w.engineLabel}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#1c2230]/65">
                    {w.whatChanged}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#1c2230]/65">
              Scenarios are illustrative. After paid orders we publish short
              anonymized process notes — never invented testimonials.
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
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
