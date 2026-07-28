"use client";

import { FormEvent, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

type ChatMsg = { role: "user" | "assistant"; content: string };
type Suggestion = { title: string; slug: string; priceInUSD: number };

const SESSION_KEY = "apex_support_session";

function getSessionId() {
  if (typeof window === "undefined") return "anon";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `s_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/**
 * Floating Apex Concierge — popup + expandable panel for concerns & special requests.
 */
export function SupportChatWidget() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "assistant",
      content:
        "Apex Concierge here. Ask about any deliverable, pricing, or special request — I’ll point you to the right engine.",
    },
  ]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || busy) return;

    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setInput("");
    setBusy(true);

    try {
      const res = await fetch("/api/support-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
      {open ? (
        <div
          id={panelId}
          className={`flex flex-col overflow-hidden rounded-2xl border border-[#0b1f3a]/15 bg-white shadow-2xl ${
            expanded ? "h-[min(88vh,720px)] w-[min(96vw,440px)]" : "h-[420px] w-[min(92vw,360px)]"
          }`}
          role="dialog"
          aria-label="Apex Concierge support chat"
        >
          <div className="flex items-center justify-between bg-[#0b1f3a] px-4 py-3 text-[#f7f5f0]">
            <div>
              <p className="text-sm font-bold tracking-tight">Apex Concierge</p>
              <p className="text-[10px] uppercase tracking-wider text-[#c9a227]">
                Concerns · Special requests
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
                    : "bg-white text-[#1c2230] shadow-sm border border-[#0b1f3a]/8"
                }`}
              >
                <p className="whitespace-pre-wrap">{m.content}</p>
              </div>
            ))}
            {suggestions.length > 0 ? (
              <div className="space-y-2 rounded-xl border border-[#c9a227]/25 bg-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a6d13]">
                  Suggested engines
                </p>
                {suggestions.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/engine/${s.slug}`}
                    className="block rounded-lg border border-[#0b1f3a]/8 px-2.5 py-2 text-xs hover:border-[#c9a227]/50"
                    onClick={() => setOpen(false)}
                  >
                    <span className="font-semibold text-[#0b1f3a]">{s.title}</span>
                    <span className="float-right font-mono text-[#0b1f3a]/70">
                      ${s.priceInUSD}
                    </span>
                  </Link>
                ))}
              </div>
            ) : null}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={send} className="border-t border-[#0b1f3a]/10 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything or describe a special request…"
                className="flex-1 rounded-lg border border-[#0b1f3a]/15 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#c9a227]/40"
                disabled={busy}
              />
              <button
                type="submit"
                disabled={busy || input.trim().length < 2}
                className="rounded-lg bg-[#0b1f3a] px-3 py-2 text-sm font-bold text-[#f7f5f0] disabled:opacity-40"
              >
                {busy ? "…" : "Send"}
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
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#c9a227] text-xs font-black text-[#0b1f3a]">
          ?
        </span>
        {open ? "Hide concierge" : "Need help?"}
      </button>
    </div>
  );
}
