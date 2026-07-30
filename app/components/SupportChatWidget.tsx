"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { displayTitle } from "@/lib/display";

type ChatMsg = { role: "user" | "assistant"; content: string };
type Suggestion = { title: string; slug: string; priceInUSD: number };

const SESSION_KEY = "apex_support_session";
export const OPEN_CONCIERGE_EVENT = "apex-open-concierge";

const QUICK_PROMPTS = [
  "I need a grant proposal narrative",
  "Pay or quit / rent demand notice",
  "Tenant repair request letter",
  "Nonprofit budget allocation",
  "Mutual NDA for a vendor",
  "Notice to vacate",
];

function getSessionId() {
  if (typeof window === "undefined") return "anon";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Open the floating concierge from anywhere (homepage CTA, etc.). */
export function openConcierge(prompt?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent(OPEN_CONCIERGE_EVENT, { detail: { prompt } }),
  );
}

/**
 * Floating Apex Concierge — describe what you need; get engines + navigation.
 */
export function SupportChatWidget() {
  const panelId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Tell me what you need — grant narrative, NDA, budget, proposal, privacy policy, runway… I’ll route you to the right engine and checkout.",
    },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pendingSend = useRef<string | null>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [messages, open, suggestions]);

  useEffect(() => {
    function onOpen(e: Event) {
      const detail = (e as CustomEvent<{ prompt?: string }>).detail;
      setOpen(true);
      setExpanded(true);
      if (detail?.prompt?.trim()) {
        pendingSend.current = detail.prompt.trim();
      }
    }
    window.addEventListener(OPEN_CONCIERGE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONCIERGE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open || busy) return;
    const text = pendingSend.current;
    if (!text) return;
    pendingSend.current = null;
    void sendText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- one-shot queue from openConcierge()
  }, [open, busy]);

  async function sendText(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const nextHistory = [
      ...messages,
      { role: "user" as const, content: trimmed },
    ];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);
    setSuggestions([]);

    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId: getSessionId(),
          history: nextHistory.slice(0, -1),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Chat failed");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: data.reply || "How else can I help?" },
      ]);
      setSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (err) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            err instanceof Error
              ? `I hit a snag (${err.message}). Email admin@apexcapitaladmin.com and we’ll help directly.`
              : "Something went wrong. Email admin@apexcapitaladmin.com.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function send(e?: FormEvent) {
    e?.preventDefault();
    await sendText(input);
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          id={panelId}
          className={`flex flex-col overflow-hidden rounded-2xl border border-[#0b1f3a]/15 bg-white shadow-2xl ${
            expanded
              ? "h-[min(88vh,720px)] w-[min(96vw,440px)]"
              : "h-[460px] w-[min(92vw,360px)]"
          }`}
          role="dialog"
          aria-label="Apex Concierge — find an engine"
        >
          <div className="flex items-center justify-between bg-[#0b1f3a] px-4 py-3 text-[#f7f5f0]">
            <div>
              <p className="text-sm font-bold tracking-tight">Apex Concierge</p>
              <p className="text-[10px] uppercase tracking-wider text-[#c9a227]">
                Find your engine · Navigate · Checkout help
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                aria-label={expanded ? "Collapse chat" : "Expand chat"}
              >
                {expanded ? "Collapse" : "Expand"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-1 text-[11px] font-semibold text-white/70 hover:bg-white/10 hover:text-white"
                aria-label="Close chat"
              >
                Close
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f5f0] px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`max-w-[90%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "ml-auto bg-[#0b1f3a] text-[#f7f5f0]"
                    : "border border-[#0b1f3a]/8 bg-white text-[#1c2230] shadow-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}

            {messages.length <= 1 ? (
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    disabled={busy}
                    onClick={() => void sendText(p)}
                    className="rounded-full border border-[#0b1f3a]/15 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0b1f3a] hover:border-[#c9a227]/50"
                  >
                    {p}
                  </button>
                ))}
              </div>
            ) : null}

            {suggestions.length > 0 ? (
              <div className="space-y-2 rounded-xl border border-[#c9a227]/25 bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                  Go straight to checkout
                </p>
                {suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/engine/${s.slug}?sample=1&focus=intake`}
                    className="block rounded-lg border border-[#0b1f3a]/8 px-2.5 py-2.5 text-xs transition hover:border-[#c9a227]/50 hover:bg-[#f7f5f0]"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-semibold text-[#0b1f3a]">
                      {displayTitle(s.title)}
                    </span>
                    <span className="mt-0.5 block text-[10px] text-[#1c2230]/55">
                      Sample intake ready · ${s.priceInUSD} · Stripe
                    </span>
                  </Link>
                ))}
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  <Link
                    href="/grant-mode"
                    className="text-[11px] font-semibold text-[#0b1f3a] underline decoration-[#c9a227] underline-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    Grant Mode →
                  </Link>
                  <Link
                    href="/notice-mode"
                    className="text-[11px] font-semibold text-[#0b1f3a] underline decoration-[#c9a227] underline-offset-2"
                    onClick={() => setOpen(false)}
                  >
                    Notice Mode →
                  </Link>
                </div>
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={send}
            className="border-t border-[#0b1f3a]/10 bg-white p-3"
          >
            <label htmlFor="apex-concierge-input" className="sr-only">
              What are you looking for?
            </label>
            <div className="flex gap-2">
              <input
                id="apex-concierge-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="What are you looking for?"
                className="flex-1 rounded-lg border border-[#0b1f3a]/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c9a227]/40"
                disabled={busy}
                autoComplete="off"
              />
              <button
                type="submit"
                disabled={busy || input.trim().length < 2}
                className="rounded-lg bg-[#0b1f3a] px-3 py-2 text-sm font-bold text-[#f7f5f0] disabled:opacity-40"
              >
                {busy ? "…" : "Find"}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex items-center gap-2 rounded-full bg-[#0b1f3a] px-4 py-3 text-sm font-bold text-[#f7f5f0] shadow-lg ring-1 ring-[#c9a227]/40 transition hover:bg-[#14335c]"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a227] text-[10px] font-black text-[#0b1f3a]">
          AI
        </span>
        {open ? "Hide finder" : "Find an engine"}
      </button>
    </div>
  );
}
