"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"pending" | "processing" | "completed" | "failed">(
    "pending",
  );
  const [output, setOutput] = useState("");
  const [engineSlug, setEngineSlug] = useState("deliverable");
  const [humanReview, setHumanReview] = useState(false);
  const [allowanceTokens, setAllowanceTokens] = useState(0);
  const [regenInput, setRegenInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [regenBusy, setRegenBusy] = useState(false);
  const conversionFired = useRef(false);

  useEffect(() => {
    if (!sessionId) return;

    const checkStatus = async () => {
      try {
        const res = await fetch(
          `/api/engine-status?session_id=${encodeURIComponent(sessionId)}`,
        );
        const data = await res.json();
        if (data.status === "completed") {
          setStatus("completed");
          setOutput(data.outputData || "");
          setAllowanceTokens(data.allowanceTokens ?? 0);
          setHumanReview(Boolean(data.humanReview));
          if (data.engineSlug) setEngineSlug(String(data.engineSlug));
          clearInterval(pollInterval);

          // Client-side purchase events only after a real Stripe Checkout
          // session (not demo_ / cs_test_mock_ unpaid overrides). Server-side
          // GA4/Meta events already fire from the Stripe webhook on
          // checkout.session.completed; shared eventID dedups Meta pixel vs CAPI.
          if (!conversionFired.current && data.paid === true) {
            conversionFired.current = true;
            const value = typeof data.priceInUSD === "number" ? data.priceInUSD : undefined;
            window.gtag?.("event", "purchase", {
              transaction_id: sessionId,
              currency: "USD",
              value,
              items: [{ item_id: data.engineSlug, item_name: data.engineTitle }],
            });
            window.fbq?.(
              "track",
              "Purchase",
              { value, currency: "USD", content_name: data.engineTitle },
              { eventID: sessionId },
            );
          }
        } else if (data.status === "failed") {
          setStatus("failed");
          setOutput(data.outputData || "");
          setAllowanceTokens(data.allowanceTokens ?? 0);
          clearInterval(pollInterval);
        } else if (data.status === "processing") {
          setStatus("processing");
        }
      } catch (err) {
        console.error("Polling failed:", err);
      }
    };

    const pollInterval = setInterval(checkStatus, 2000);
    checkStatus();
    return () => clearInterval(pollInterval);
  }, [sessionId]);

  async function regenerate() {
    if (!sessionId || regenInput.trim().length < 10) return;
    setRegenBusy(true);
    try {
      const res = await fetch("/api/regenerate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stripeSessionId: sessionId,
          newUserInput: regenInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Regenerate failed");
      setStatus("pending");
      setOutput("");
      setRegenBusy(false);
      // restart polling by reloading
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Regenerate failed");
      setRegenBusy(false);
    }
  }

  if (!sessionId) {
    return (
      <div className="mx-auto my-16 max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h3 className="font-bold text-red-800">Missing session</h3>
        <p className="mt-2 text-sm text-red-600">
          No checkout session id was found in the URL.
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
        >
          Back home
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto my-10 max-w-3xl rounded-lg border border-[#0b1f3a]/10 bg-white p-6 shadow-sm">
      {(status === "pending" || status === "processing") && (
        <div className="flex flex-col items-center justify-center space-y-4 py-16">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-[#c9a227]" />
          <h2 className="text-xl font-bold text-[#0b1f3a]">
            Running your engine...
          </h2>
          <p className="max-w-sm text-center text-sm text-[#1c2230]/60">
            Payment verified. Generating your deliverable now.
          </p>
        </div>
      )}

      {status === "failed" && (
        <div className="space-y-4 py-10 text-center">
          <h2 className="text-xl font-bold text-[#0b1f3a]">Generation failed</h2>
          <pre className="whitespace-pre-wrap rounded-lg bg-[#0b1f3a] p-4 text-left text-xs text-red-200">
            {output}
          </pre>
        </div>
      )}

      {status === "completed" && (
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-4 border-b border-[#0b1f3a]/10 pb-4">
            <div>
              <span className="rounded-full bg-[#c9a227]/10 px-2.5 py-0.5 text-xs font-semibold text-[#8a6d13]">
                Complete
              </span>
              <h1 className="mt-2 text-2xl font-bold text-[#0b1f3a]">
                Thank you — your deliverable is ready
              </h1>
              <p className="mt-1 text-xs text-[#1c2230]/55">
                Order ID:{" "}
                <span className="font-mono text-[#0b1f3a]">{sessionId}</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#1c2230]/65">
                Bookmark this page (or keep the email link) — it is how you
                reopen this deliverable. Stripe sends a payment receipt
                separately.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="rounded-lg border border-[#0b1f3a]/15 bg-white px-4 py-2 text-sm font-semibold text-[#0b1f3a] hover:bg-[#f7f5f0]"
              >
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={() => {
                  const blob = new Blob([output], {
                    type: "text/markdown;charset=utf-8",
                  });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${engineSlug}.md`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="rounded-lg bg-[#0b1f3a] px-4 py-2 text-sm font-semibold text-white hover:bg-[#14335c]"
              >
                Download .md
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#0b1f3a] bg-[#0b1f3a] p-5">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-white/90">
              {output}
            </pre>
          </div>

          <p className="rounded-lg border border-[#c9a227]/30 bg-[#c9a227]/10 px-3 py-2 text-xs leading-relaxed text-[#1c2230]/70">
            {humanReview ? (
              <>
                Human specialist review is on this order. Apex ops will email
                notes to your checkout address within 1 business day.
              </>
            ) : (
              <>
                A copy was emailed to your checkout address when generation
                finished (if mail is configured). Next time, add human review
                (+$49) for near-final filings. Drafts are informational — have a
                qualified professional review before regulated use.
              </>
            )}
          </p>

          <div className="flex flex-wrap gap-3 text-sm">
            <Link
              href="/grant-mode"
              className="rounded-lg bg-[#0b1f3a] px-4 py-2 font-semibold text-[#f7f5f0]"
            >
              Explore Grant Mode
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2 font-semibold text-[#0b1f3a]"
            >
              Back to catalog
            </Link>
          </div>

          {allowanceTokens > 0 ? (
            <div className="space-y-3 rounded-lg border border-[#0b1f3a]/10 bg-[#f7f5f0] p-4">
              <h3 className="text-sm font-bold text-[#0b1f3a]">
                One complimentary regeneration remaining
              </h3>
              <textarea
                rows={4}
                value={regenInput}
                onChange={(e) => setRegenInput(e.target.value)}
                placeholder="Correct your input and regenerate..."
                className="w-full rounded-lg border border-[#0b1f3a]/15 bg-white p-3 text-sm"
              />
              <button
                disabled={regenBusy || regenInput.trim().length < 10}
                onClick={regenerate}
                className="rounded-lg bg-[#0b1f3a] px-4 py-2 text-sm font-semibold text-white disabled:bg-[#0b1f3a]/30"
              >
                {regenBusy ? "Queuing..." : "Regenerate"}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl p-12 text-center text-sm text-[#1c2230]/50">
          Loading session...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
