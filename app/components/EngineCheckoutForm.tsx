"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  extractGAClientIdFromCookie,
  parseAttributionCookie,
  readCookie,
} from "@/lib/attribution";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

export function EngineCheckoutForm({
  slug,
  inputLabel,
  inputPlaceholder,
  priceInUSD,
}: {
  slug: string;
  inputLabel: string;
  inputPlaceholder: string;
  priceInUSD: number;
}) {
  const [userInput, setUserInput] = useState("");
  const [email, setEmail] = useState("");
  const [humanReview, setHumanReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => priceInUSD + (humanReview ? HUMAN_REVIEW_USD : 0),
    [priceInUSD, humanReview],
  );

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const cookies = document.cookie;
      const attribution = {
        ...parseAttributionCookie(cookies),
        gaClientId: extractGAClientIdFromCookie(cookies) || undefined,
        fbp: readCookie(cookies, "_fbp") || undefined,
        fbc: readCookie(cookies, "_fbc") || undefined,
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engineSlug: slug,
          userInput,
          customerEmail: email,
          attribution,
          humanReview,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/60">
          Email (required for delivery)
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-[#0b1f3a]/15 bg-white px-3 py-2.5 text-sm text-[#0b1f3a]"
        />
        <p className="mt-1 text-[11px] text-[#1c2230]/45">
          We email a copy of your deliverable and the success-page link.
        </p>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/60">
          {inputLabel}
        </label>
        <textarea
          required
          rows={7}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full rounded-lg border border-[#0b1f3a]/15 bg-[#f7f5f0] px-3 py-3 text-sm leading-relaxed text-[#0b1f3a] outline-none focus:ring-2 focus:ring-[#c9a227]/40"
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-[#c9a227]/35 bg-[#c9a227]/10 p-3">
        <input
          type="checkbox"
          checked={humanReview}
          onChange={(e) => setHumanReview(e.target.checked)}
          className="mt-1"
        />
        <span>
          <span className="block text-sm font-bold text-[#0b1f3a]">
            Add human specialist review — ${HUMAN_REVIEW_USD}
          </span>
          <span className="mt-0.5 block text-[11px] leading-relaxed text-[#1c2230]/65">
            After generation, Apex ops reviews your draft within 1 business day
            and emails notes. Recommended for grant filings, contracts, and
            board-facing docs. Does not create an attorney–client or CPA
            relationship.
          </span>
        </span>
      </label>

      {error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={submitting || userInput.trim().length < 10}
        className="w-full rounded-lg bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-[#f7f5f0] shadow-sm transition hover:bg-[#14335c] disabled:bg-[#0b1f3a]/30"
      >
        {submitting
          ? "Starting checkout..."
          : `Continue to secure checkout — $${total}`}
      </button>
      <p className="text-center text-[11px] text-[#1c2230]/45">
        Payments processed by Stripe. We never store card numbers.
      </p>
      <p className="text-center text-[11px] leading-relaxed text-[#1c2230]/50">
        By purchasing, you agree to our{" "}
        <Link
          href="/terms"
          className="underline decoration-[#c9a227] decoration-2 underline-offset-2 hover:text-[#0b1f3a]"
        >
          Terms
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline decoration-[#c9a227] decoration-2 underline-offset-2 hover:text-[#0b1f3a]"
        >
          Privacy Policy
        </Link>
        . Outputs are informational drafts — not licensed professional advice.
      </p>
    </form>
  );
}
