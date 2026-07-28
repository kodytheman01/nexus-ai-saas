"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          engineSlug: slug,
          userInput,
          customerEmail: email,
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
          Email (optional in demo mode)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-lg border border-[#0b1f3a]/15 bg-white px-3 py-2.5 text-sm text-[#0b1f3a]"
        />
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
          : `Unlock deliverable — $${priceInUSD}`}
      </button>
      <p className="text-center text-[11px] leading-relaxed text-[#1c2230]/50">
        By purchasing, you agree to our{" "}
        <Link
          href="/terms"
          className="underline decoration-[#c9a227] decoration-2 underline-offset-2 hover:text-[#0b1f3a]"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="/privacy"
          className="underline decoration-[#c9a227] decoration-2 underline-offset-2 hover:text-[#0b1f3a]"
        >
          Privacy Policy
        </Link>
        .
      </p>
      <p className="text-[11px] leading-relaxed text-[#1c2230]/40">
        Without STRIPE_SECRET_KEY, checkout runs in local demo mode and
        generates immediately. With Stripe configured, payment is required
        first.
      </p>
    </form>
  );
}
