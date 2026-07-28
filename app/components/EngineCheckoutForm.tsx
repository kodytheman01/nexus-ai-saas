"use client";

import { FormEvent, useState } from "react";

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
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-600">
          Email (optional in demo mode)
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-zinc-600">
          {inputLabel}
        </label>
        <textarea
          required
          rows={7}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-3 text-sm leading-relaxed text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-600/30"
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
        className="w-full rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:bg-zinc-300"
      >
        {submitting
          ? "Starting checkout..."
          : `Unlock asset — $${priceInUSD}`}
      </button>
      <p className="text-[11px] leading-relaxed text-zinc-400">
        Without STRIPE_SECRET_KEY, checkout runs in local demo mode and
        generates immediately. With Stripe configured, payment is required
        first.
      </p>
    </form>
  );
}
