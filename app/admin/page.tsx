"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Health = {
  database: boolean;
  engineCount: number;
  pendingHumanReviews: number;
  completedRunsLast7d: number;
  failedRunsLast7d?: number;
  recentFailures?: {
    stripeSessionId: string;
    engineSlug: string;
    createdAt: string;
    preview: string;
  }[];
  stripeMode: string;
  env: Record<string, boolean>;
};

type ReviewRow = {
  id: string;
  stripeSessionId: string;
  userEmail: string;
  engineSlug: string;
  engineTitle: string;
  priceInUSD?: number;
  status: string;
  createdAt: string;
  outputPreview: string;
  hasOutput: boolean;
};

export default function AdminHomePage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    void (async () => {
      try {
        const [h, r] = await Promise.all([
          fetch("/api/admin/health").then((res) => res.json()),
          fetch("/api/admin/reviews").then((res) => res.json()),
        ]);
        if (h.error) throw new Error(h.error);
        if (r.error) throw new Error(r.error);
        setHealth(h);
        setReviews(Array.isArray(r) ? r : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ops");
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Ops dashboard
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold text-[#0b1f3a]">
            Daily control panel
          </h1>
          <p className="mt-1 text-sm text-[#1c2230]/60">
            Check human reviews once per business day. Confirm env health before
            spending ad budget.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link
            href="/admin/engines"
            className="rounded-lg border border-[#0b1f3a]/15 px-3 py-2 font-semibold text-[#0b1f3a]"
          >
            Engines
          </Link>
          <Link
            href="/grant-mode"
            className="rounded-lg bg-[#0b1f3a] px-3 py-2 font-semibold text-[#f7f5f0]"
          >
            View Grant Mode
          </Link>
        </div>
      </div>

      {error ? (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            label: "Engines live",
            value: health ? String(health.engineCount) : "…",
          },
          {
            label: "Human reviews (open)",
            value: health ? String(health.pendingHumanReviews) : "…",
          },
          {
            label: "Completed (7d)",
            value: health ? String(health.completedRunsLast7d) : "…",
          },
          {
            label: "Failed (7d)",
            value: health ? String(health.failedRunsLast7d ?? 0) : "…",
          },
          {
            label: "Stripe mode",
            value: health?.stripeMode || "…",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-lg border border-[#0b1f3a]/10 bg-white p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/45">
              {card.label}
            </p>
            <p className="mt-1 font-mono text-2xl font-bold text-[#0b1f3a]">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Connection health
        </h2>
        <p className="mt-1 text-xs text-[#1c2230]/55">
          Booleans only — secrets are never shown. Set missing vars in Netlify →
          Environment variables, then redeploy.
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {health
            ? [
                ["Database", health.database],
                ...Object.entries(health.env).map(([k, v]) => [k, v] as const),
              ].map(([k, ok]) => (
                <li
                  key={String(k)}
                  className="flex items-center justify-between rounded border border-[#0b1f3a]/10 px-3 py-2 text-sm"
                >
                  <span className="font-mono text-xs text-[#0b1f3a]">{k}</span>
                  <span
                    className={`text-xs font-bold uppercase ${
                      ok ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    {ok ? "OK" : "Missing"}
                  </span>
                </li>
              ))
            : (
              <li className="text-sm text-[#1c2230]/50">Loading…</li>
            )}
        </ul>
      </section>

      <section className="mt-10 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Search Console (step 2)
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-[#1c2230]/75">
          <li>
            Open{" "}
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noreferrer"
              className="font-semibold underline decoration-[#c9a227] underline-offset-2"
            >
              Google Search Console
            </a>{" "}
            → Add property → URL prefix →{" "}
            <code className="rounded bg-white px-1">https://apexcapitaladmin.com</code>
          </li>
          <li>
            Choose HTML tag verification → copy the{" "}
            <code className="rounded bg-white px-1">content=&quot;…&quot;</code>{" "}
            token only.
          </li>
          <li>
            Netlify → Site → Environment variables → set{" "}
            <code className="rounded bg-white px-1">GOOGLE_SITE_VERIFICATION</code>{" "}
            → Trigger deploy.
          </li>
          <li>
            After deploy, click Verify in Search Console → Sitemaps → submit{" "}
            <code className="rounded bg-white px-1">
              https://apexcapitaladmin.com/sitemap.xml
            </code>
          </li>
        </ol>
        <p className="mt-3 text-xs text-[#1c2230]/55">
          Status here:{" "}
          {health?.env.GOOGLE_SITE_VERIFICATION
            ? "token present in this environment"
            : "token not set yet (expected until you add it in Netlify)"}
        </p>
      </section>

      <section className="mt-10 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Failed generations (webhook / engine)
        </h2>
        <p className="mt-1 text-xs text-[#1c2230]/55">
          Recent failed EngineRuns — check Stripe webhook delivery and OpenAI
          quota if these spike.
        </p>
        {!health?.recentFailures?.length ? (
          <p className="mt-4 text-sm text-[#1c2230]/50">No recent failures.</p>
        ) : (
          <ul className="mt-4 space-y-2">
            {health.recentFailures.map((f) => (
              <li
                key={f.stripeSessionId}
                className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-900"
              >
                <p className="font-mono">
                  {f.engineSlug} · {f.stripeSessionId.slice(0, 28)}…
                </p>
                <p className="mt-1 opacity-80">{f.preview}</p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Human review queue
        </h2>
        <p className="mt-1 text-xs text-[#1c2230]/55">
          Daily rhythm: open this list → email notes to the customer within 1
          business day → mark done in your inbox/CRM.
        </p>
        {reviews.length === 0 ? (
          <p className="mt-4 text-sm text-[#1c2230]/50">
            No human-review orders yet. After the first +$49 add-on purchase,
            rows appear here.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {reviews.map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-[#0b1f3a]">
                      {r.engineTitle}
                    </p>
                    <p className="mt-0.5 text-xs text-[#1c2230]/60">
                      {r.userEmail} · {r.status} ·{" "}
                      {new Date(r.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <a
                    href={`/success?session_id=${encodeURIComponent(r.stripeSessionId)}`}
                    className="text-xs font-semibold text-[#0b1f3a] underline underline-offset-2"
                  >
                    Open deliverable
                  </a>
                </div>
                {r.hasOutput ? (
                  <pre className="mt-3 max-h-32 overflow-auto whitespace-pre-wrap rounded bg-[#0b1f3a] p-3 font-mono text-[10px] text-white/80">
                    {r.outputPreview}
                  </pre>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10 rounded-lg border border-[#0b1f3a]/10 bg-white p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Ads readiness (step 3)
        </h2>
        <ul className="mt-3 space-y-2 text-sm text-[#1c2230]/75">
          <li>500 standard MP4s + 500 launch kits are on this machine.</li>
          <li>~41 premium creatives ready for higher-spend tests.</li>
          <li>
            Launch path: pick a Grant Mode kit from{" "}
            <code className="rounded bg-[#f7f5f0] px-1">ad-launch-kits/</code>{" "}
            → upload to Meta/TikTok/YouTube with the included UTM URL.
          </li>
          <li>
            Instagram Graph publish still needs Business tokens + public video
            URLs (see{" "}
            <code className="rounded bg-[#f7f5f0] px-1">.env.example</code>).
          </li>
        </ul>
      </section>

      <section className="mt-10 rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 p-5">
        <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
          Daily ops checklist
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-[#1c2230]/75">
          <li>Open this page → clear human review queue.</li>
          <li>Reply to support / Concierge escalations at admin@apexcapitaladmin.com.</li>
          <li>After any real order, optionally add an anonymized win in config/wins.ts.</li>
          <li>Only then scale paid ads.</li>
        </ol>
      </section>
    </div>
  );
}
