import type { Metadata } from "next";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Vision",
  description:
    "Why Apex Capital Admin Services exists — give people time back for what they love by simplifying everyday admin drafts for grants, notices, bids, and offers.",
  alternates: { canonical: `${appUrl}/vision` },
};

const pillars = [
  {
    title: "Simplify the grind",
    body: "Blank pages, deadlines, and admin friction steal evenings. Apex turns intake into a structured first draft so the heavy lift takes minutes, not nights.",
  },
  {
    title: "Time for what you want",
    body: "Life is short. We want operators, landlords, grant writers, contractors, and founders spending more hours on craft, family, and ambition — not formatting letters.",
  },
  {
    title: "Honest tools",
    body: "Drafts, not guarantees. No fake testimonials. Clear pricing. Optional human review. Confirm with a professional before you serve, file, or send.",
  },
  {
    title: "A factory that scales good",
    body: "Eleven Modes today — and growing. 500+ engines. The same Stripe-secured delivery muscle — so impact can grow without becoming a spammy marketplace of empty promises.",
  },
];

export default function VisionPage() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 70% 50% at 20% 10%, #c9a227 0%, transparent 55%), radial-gradient(ellipse 50% 40% at 90% 80%, #14335c 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:py-22">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Apex Capital Admin Services
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            Time back for what you love.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Too much of life gets spent doing what we need — admin, paperwork,
            blank-page deadlines — instead of what we want. Apex exists to
            shrink that gap: structured drafts for grants, notices, bids, and
            offers, so people reclaim hours for the work and life that matter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/modes"
              className="rounded-lg bg-[#c9a227] px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
            >
              Explore Modes
            </Link>
            <Link
              href="/platform"
              className="rounded-lg border border-white/25 bg-white/5 px-5 py-3 text-sm font-bold text-[#f7f5f0] transition hover:bg-white/10"
            >
              See the platform
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            The problem we refuse to accept
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#1c2230]/70">
            Every deadline that starts with a blank document steals attention
            from the thing you actually came to do — serve tenants fairly, win
            funding for a community, bid a job well, hire the right person, or
            simply get home earlier. Tools should give time back. They should
            not invent miracles or sell lessons in shame.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#1c2230]/70">
            Apex is building the admin draft layer for that world: fast,
            specialist-shaped, Stripe-secured, and honest about what a draft is.
          </p>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            How we show up
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5"
              >
                <h3 className="font-display text-lg font-semibold text-[#0b1f3a]">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/70">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a] sm:text-2xl">
            Start with one draft. Keep the rest of your day.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#1c2230]/65">
            Pick the Mode that matches your deadline. Load the sample. Swap your
            facts. Pay on Stripe. Get the structure — then spend your time on
            what you actually want.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/go/grant"
              className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
            >
              Grant
            </Link>
            <Link
              href="/go/notice"
              className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
            >
              Notice
            </Link>
            <Link
              href="/go/bid"
              className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
            >
              Bid
            </Link>
            <Link
              href="/go/offer"
              className="rounded-lg bg-[#0b1f3a] px-4 py-2.5 text-sm font-bold text-[#f7f5f0]"
            >
              Offer
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
