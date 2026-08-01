import type { Metadata } from "next";
import Link from "next/link";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Modes",
  description:
    "Apex Modes — Grant, Notice, Bid, and Offer. Purpose-built draft engines with sample intake, Stripe checkout, and optional human review.",
  alternates: { canonical: `${appUrl}/modes` },
};

const modes = [
  {
    name: "Grant Mode",
    tag: "Nonprofits · grant writers",
    price: "$19–$24",
    blurb:
      "Funder-style narrative, FOA outline, budget language, and compliance checklists — blank page to first-pass draft.",
    hub: "/grant-mode",
    go: "/go/grant",
    cta: "Start Grant Mode",
  },
  {
    name: "Notice Mode",
    tag: "Landlords · tenants · TX/FL/CA packs",
    price: "$12–$19",
    blurb:
      "Pay-or-quit, notice to vacate, deposit itemization, repair requests, and more — structured letters from your facts.",
    hub: "/notice-mode",
    go: "/go/notice",
    cta: "Start Notice Mode",
  },
  {
    name: "Bid Mode",
    tag: "GCs · trades · estimators",
    price: "$19–$24",
    blurb:
      "Contractor proposals, change orders, and bid cover language — scope, price, and timeline in one draft.",
    hub: "/bid-mode",
    go: "/go/bid",
    cta: "Start Bid Mode",
  },
  {
    name: "Offer Mode",
    tag: "HR · founders · people ops",
    price: "$12–$19",
    blurb:
      "Offer letters, rejections, and promotion notes — clear, professional drafts you can edit before send.",
    hub: "/offer-mode",
    go: "/go/offer",
    cta: "Start Offer Mode",
  },
];

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
            Four Modes. One draft factory.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Each Mode is a focused path into the catalog — sample intake ready,
            Stripe checkout, on-page + email delivery, optional human review
            (+${HUMAN_REVIEW_USD}). Need something else? The full 500+ engine
            catalog stays open.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#catalog"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Browse full catalog
            </Link>
            <Link
              href="/platform"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              Platform overview
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 sm:grid-cols-2">
          {modes.map((m) => (
            <article
              key={m.name}
              className="flex flex-col rounded-lg border border-[#0b1f3a]/10 bg-white p-6"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                {m.tag}
              </p>
              <h2 className="mt-2 font-display text-2xl font-semibold text-[#0b1f3a]">
                {m.name}
              </h2>
              <p className="mt-1 font-mono text-sm font-bold text-[#0b1f3a]">
                {m.price}
              </p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-[#1c2230]/70">
                {m.blurb}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={m.go}
                  className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0] transition hover:bg-[#14335c]"
                >
                  {m.cta}
                </Link>
                <Link
                  href={m.hub}
                  className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2.5 text-sm font-bold text-[#0b1f3a] transition hover:border-[#c9a227]/50"
                >
                  Full guide
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a] sm:text-2xl">
            Not sure which Mode?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#1c2230]/65">
            Use the homepage Concierge, search the catalog, or start with the
            closest Mode — you can always switch engines before checkout.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Ask the Concierge
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-[#0b1f3a]/15 px-5 py-3 text-sm font-bold text-[#0b1f3a]"
            >
              Read FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
