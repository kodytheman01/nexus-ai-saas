"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  extractGAClientIdFromCookie,
  parseAttributionCookie,
  readCookie,
} from "@/lib/attribution";
import { HUMAN_REVIEW_USD } from "@/lib/offer";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const DRAFT_KEY = (slug: string) => `apex_intake_draft_${slug}`;
const EMAIL_KEY = "apex_checkout_email";
const MIN_INTAKE = 40;

export function EngineCheckoutForm({
  slug,
  inputLabel,
  inputPlaceholder,
  priceInUSD,
  intakeExample,
}: {
  slug: string;
  inputLabel: string;
  inputPlaceholder: string;
  priceInUSD: number;
  intakeExample?: string;
}) {
  const searchParams = useSearchParams();
  const wantsSample =
    searchParams.get("sample") === "1" || searchParams.get("sample") === "true";
  const canceled = searchParams.get("canceled") === "1";

  const [userInput, setUserInput] = useState("");
  const [email, setEmail] = useState("");
  const [humanReview, setHumanReview] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [usedSample, setUsedSample] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => priceInUSD + (humanReview ? HUMAN_REVIEW_USD : 0),
    [priceInUSD, humanReview],
  );

  const intakeOk = userInput.trim().length >= MIN_INTAKE;
  const ready = intakeOk && email.trim().includes("@");

  // Hydrate: restored draft (cancel) → sample → empty
  useEffect(() => {
    if (hydrated) return;
    let nextInput = "";
    let nextEmail = "";
    let sample = false;
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY(slug));
      const savedEmail = sessionStorage.getItem(EMAIL_KEY);
      if (savedEmail) nextEmail = savedEmail;
      if (canceled && saved && saved.trim().length >= 10) {
        nextInput = saved;
      } else if (wantsSample && intakeExample) {
        nextInput = intakeExample;
        sample = true;
      } else if (intakeExample && !saved) {
        // Auto-load specialist sample so every engine starts strong
        nextInput = intakeExample;
        sample = true;
      } else if (saved) {
        nextInput = saved;
      }
    } catch {
      if (intakeExample) {
        nextInput = intakeExample;
        sample = true;
      }
    }
    setUserInput(nextInput);
    setEmail(nextEmail);
    setUsedSample(sample);
    setHydrated(true);
  }, [hydrated, slug, canceled, wantsSample, intakeExample]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (userInput.trim().length >= 10) {
        sessionStorage.setItem(DRAFT_KEY(slug), userInput);
      }
      if (email.trim().includes("@")) {
        sessionStorage.setItem(EMAIL_KEY, email.trim());
      }
    } catch {
      // ignore quota / private mode
    }
  }, [userInput, email, slug, hydrated]);

  useEffect(() => {
    if (searchParams.get("focus") !== "intake") return;
    requestAnimationFrame(() => {
      document
        .getElementById("intake")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [searchParams]);

  function applySample() {
    if (!intakeExample) return;
    setUserInput(intakeExample);
    setUsedSample(true);
    setShowExample(false);
    setError("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!intakeOk) {
      setError(
        `Add a bit more detail (${MIN_INTAKE}+ characters) or tap “Use sample intake”.`,
      );
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      window.fbq?.("track", "InitiateCheckout", {
        content_ids: [slug],
        content_type: "product",
        value: total,
        currency: "USD",
      });
      window.gtag?.("event", "begin_checkout", {
        currency: "USD",
        value: total,
        items: [{ item_id: slug, price: priceInUSD }],
      });

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

  if (!hydrated) {
    return (
      <div className="rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-4 text-sm text-[#1c2230]/50">
        Loading intake…
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {intakeExample ? (
        <div className="rounded-lg border border-[#c9a227]/40 bg-[#c9a227]/10 p-3">
          <p className="text-xs font-bold text-[#0b1f3a]">
            Specialist sample loaded — swap your facts
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-[#1c2230]/65">
            Every engine starts with a filled example. Edit names, dates, and
            amounts, add email, pay.
            {usedSample ? " Sample is in the box below." : ""}
            {canceled ? " Your prior draft was restored after cancel." : ""}
          </p>
          <button
            type="button"
            onClick={applySample}
            className="mt-2 w-full rounded-lg bg-[#c9a227] px-3 py-2.5 text-sm font-bold text-[#0b1f3a] transition hover:bg-[#e0b93a]"
          >
            {usedSample ? "Reload sample intake" : "Use sample intake — 1 tap"}
          </button>
        </div>
      ) : null}

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
        <div className="mb-1 flex items-center justify-between gap-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0b1f3a]/60">
            {inputLabel}
          </label>
          {intakeExample ? (
            <button
              type="button"
              onClick={() => setShowExample((v) => !v)}
              className="text-[11px] font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-2"
            >
              {showExample ? "Hide example" : "See good intake example"}
            </button>
          ) : null}
        </div>
        {showExample && intakeExample ? (
          <div className="mb-2 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-3">
            <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#1c2230]/75">
              {intakeExample}
            </pre>
            <button
              type="button"
              onClick={applySample}
              className="mt-2 text-[11px] font-bold text-[#0b1f3a] underline underline-offset-2"
            >
              Use this as a starting point
            </button>
          </div>
        ) : null}
        <textarea
          required
          rows={7}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-full rounded-lg border border-[#0b1f3a]/15 bg-[#f7f5f0] px-3 py-3 text-sm leading-relaxed text-[#0b1f3a] outline-none focus:ring-2 focus:ring-[#c9a227]/40"
        />
        <p className="mt-1.5 text-[11px] leading-relaxed text-[#8a6d13]">
          Aim for {MIN_INTAKE}+ characters of real facts. Do not paste SSNs,
          medical PHI, passwords, API keys, or other secrets.
        </p>
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
            and emails notes. Recommended for filings, notices, contracts, and
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
        disabled={submitting || !ready}
        className="w-full rounded-lg bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-[#f7f5f0] shadow-sm transition hover:bg-[#14335c] disabled:bg-[#0b1f3a]/30"
      >
        {submitting
          ? "Starting checkout..."
          : ready
            ? `Continue to secure checkout — $${total}`
            : !intakeOk
              ? "Add more intake detail (or reload sample)"
              : "Add your email to continue"}
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
