"use client";

import { openConcierge } from "./SupportChatWidget";

/** Homepage / catalog entry that opens the AI finder chat. */
export function FindEnginePrompt({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <div
      className={
        dark
          ? "rounded-lg border border-white/15 bg-white/5 p-4"
          : "rounded-lg border border-[#0b1f3a]/10 bg-white p-4 shadow-sm"
      }
    >
      <p
        className={
          dark
            ? "text-xs font-bold uppercase tracking-wider text-[#c9a227]"
            : "text-xs font-bold uppercase tracking-wider text-[#8a6d13]"
        }
      >
        Apex Concierge
      </p>
      <p
        className={
          dark
            ? "mt-1 text-sm font-semibold text-[#f7f5f0]"
            : "mt-1 text-sm font-semibold text-[#0b1f3a]"
        }
      >
        Not sure which engine? Describe what you need.
      </p>
      <p
        className={
          dark
            ? "mt-1 text-xs leading-relaxed text-white/55"
            : "mt-1 text-xs leading-relaxed text-[#1c2230]/60"
        }
      >
        Grant, notice, bid, offer, NDA — the site AI routes you to the right
        Mode checkout with sample intake.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openConcierge()}
          className={
            dark
              ? "rounded-lg bg-[#c9a227] px-4 py-2 text-xs font-bold text-[#0b1f3a] hover:bg-[#e0b93a]"
              : "rounded-lg bg-[#0b1f3a] px-4 py-2 text-xs font-bold text-[#f7f5f0] hover:bg-[#14335c]"
          }
        >
          Ask Concierge
        </button>
        <button
          type="button"
          onClick={() => openConcierge("I need a grant proposal narrative")}
          className={
            dark
              ? "rounded-lg border border-white/25 px-4 py-2 text-xs font-bold text-[#f7f5f0] hover:bg-white/10"
              : "rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a] hover:border-[#c9a227]/40"
          }
        >
          Grant
        </button>
        <button
          type="button"
          onClick={() => openConcierge("Pay or quit / rent demand notice")}
          className={
            dark
              ? "rounded-lg border border-white/25 px-4 py-2 text-xs font-bold text-[#f7f5f0] hover:bg-white/10"
              : "rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a] hover:border-[#c9a227]/40"
          }
        >
          Notice
        </button>
        <button
          type="button"
          onClick={() => openConcierge("Contractor proposal / bid letter")}
          className={
            dark
              ? "rounded-lg border border-white/25 px-4 py-2 text-xs font-bold text-[#f7f5f0] hover:bg-white/10"
              : "rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a] hover:border-[#c9a227]/40"
          }
        >
          Bid
        </button>
        <button
          type="button"
          onClick={() => openConcierge("Job offer letter draft")}
          className={
            dark
              ? "rounded-lg border border-white/25 px-4 py-2 text-xs font-bold text-[#f7f5f0] hover:bg-white/10"
              : "rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a] hover:border-[#c9a227]/40"
          }
        >
          Offer
        </button>
      </div>
    </div>
  );
}
