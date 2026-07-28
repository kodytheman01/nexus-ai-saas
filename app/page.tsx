import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
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

  return (
    <>
      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
              Automated Advisory &amp; Deliverable Engines
            </p>
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#0b1f3a] sm:text-5xl">
              Apex Capital Admin Services
            </h1>
            <p className="mt-4 text-base leading-relaxed text-[#1c2230]/70">
              Specialized knowledge engines that convert your inputs into
              professional-grade deliverables — secured by Stripe payments,
              generated instantly by our engine layer.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              {
                label: "Instant delivery",
                detail: "Typically under 60 seconds",
              },
              {
                label: "Secure checkout",
                detail: "Powered by Stripe",
              },
              {
                label: "500+ engines",
                detail: "Specialized catalog",
              },
              {
                label: "Regeneration",
                detail: "One complimentary re-run",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] px-3 py-4 text-center"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-[#0b1f3a]">
                  {item.label}
                </p>
                <p className="mt-1 text-[11px] leading-snug text-[#1c2230]/60">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
            {["Intake", "Secure payment", "Automated generation", "Delivery"].map(
              (step, i, arr) => (
                <span
                  key={step}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-[#0b1f3a]/60"
                >
                  {step}
                  {i < arr.length - 1 ? (
                    <span aria-hidden className="text-[#c9a227]">
                      →
                    </span>
                  ) : null}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Find your deliverable
          </h2>
          <p className="mt-1 text-sm text-[#1c2230]/60">
            Search 500+ engines — your recent searches stay on this device, and
            anonymous query trends help us decide what to build next.
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
            Operating Model
          </p>
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a] sm:text-3xl">
            A disciplined, deliverable-driven engine layer
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#1c2230]/70">
            Each engine on this platform pairs a defined intake process with a
            purpose-built generation pipeline, secured payment processing, and
            an auditable output record. Clients describe their situation once
            and receive a structured, ready-to-use deliverable in return.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-block text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4 transition hover:text-[#0b1f3a]/70"
          >
            Learn more about our platform
          </Link>
        </div>
      </section>
    </>
  );
}
