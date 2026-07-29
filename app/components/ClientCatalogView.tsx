"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { displayTitle, isGrantRelated } from "@/lib/display";
import { FLAGSHIP_SLUGS } from "@/config/flagship";

export type CatalogEngine = {
  slug: string;
  title: string;
  description: string;
  priceInUSD: number;
  category: string;
};

const HISTORY_KEY = "apex_search_history";
const MAX_HISTORY = 12;
const FLAGSHIP_SET = new Set(FLAGSHIP_SLUGS);

function loadHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter((q) => typeof q === "string") : [];
  } catch {
    return [];
  }
}

function pushHistory(query: string) {
  const next = [
    query,
    ...loadHistory().filter((q) => q.toLowerCase() !== query.toLowerCase()),
  ].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
  return next;
}

export function ClientCatalogView({
  initialEngines,
  categories,
}: {
  initialEngines: CatalogEngine[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    const q = searchParams.get("q");
    if (q != null) {
      setSearch(q);
      if (q.trim().length >= 2) {
        const count = initialEngines.filter((eng) => {
          const hay = `${eng.title} ${eng.description} ${eng.category} ${eng.slug}`.toLowerCase();
          return hay.includes(q.toLowerCase());
        }).length;
        setHistory(pushHistory(q.trim()));
        void fetch("/api/search-log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: q.trim(),
            resultCount: count,
            source: "nav",
          }),
        }).catch(() => undefined);
      }
    }
  }, [searchParams, initialEngines]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setHistoryOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const filtered = useMemo(() => {
    return initialEngines.filter((eng) => {
      let catOk = true;
      if (activeCategory === "grants") {
        catOk = isGrantRelated(eng);
      } else if (activeCategory === "flagships") {
        catOk = FLAGSHIP_SET.has(eng.slug);
      } else if (activeCategory !== "all") {
        catOk = eng.category === activeCategory;
      }
      const q = search.toLowerCase().trim();
      const name = displayTitle(eng.title).toLowerCase();
      const searchOk =
        !q ||
        name.includes(q) ||
        eng.title.toLowerCase().includes(q) ||
        eng.description.toLowerCase().includes(q) ||
        eng.category.toLowerCase().includes(q) ||
        eng.slug.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [initialEngines, activeCategory, search]);

  function logSearch(query: string, resultCount: number) {
    const q = query.trim();
    if (q.length < 2) return;
    setHistory(pushHistory(q));
    void fetch("/api/search-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, resultCount, source: "catalog" }),
    }).catch(() => undefined);
  }

  function onSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const q = value.trim();
      if (q.length < 2) return;
      const count = initialEngines.filter((eng) => {
        const hay = `${eng.title} ${eng.description} ${eng.category} ${eng.slug}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }).length;
      logSearch(q, count);
    }, 700);
  }

  return (
    <div id="catalog-search" className="scroll-mt-28 space-y-6">
      <div className="flex flex-wrap gap-2">
        {[
          { id: "all", label: "All" },
          { id: "flagships", label: "Flagships" },
          { id: "grants", label: "Grants & nonprofit" },
          ...categories.map((c) => ({ id: c, label: c })),
        ].map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setActiveCategory(chip.id)}
            className={`rounded-full px-3 py-1.5 text-xs font-bold capitalize transition ${
              activeCategory === chip.id
                ? "bg-[#0b1f3a] text-[#c9a227]"
                : "border border-[#0b1f3a]/15 bg-white text-[#0b1f3a]/70 hover:border-[#c9a227]/40"
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div ref={wrapRef} className="relative flex-1">
          <label htmlFor="engine-search" className="sr-only">
            Search engines
          </label>
          <input
            id="engine-search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setHistoryOpen(true)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                logSearch(search, filtered.length);
                setHistoryOpen(false);
              }
            }}
            placeholder="Search what you need — grant, NDA, invoice, runway…"
            className="w-full rounded-lg border border-[#0b1f3a]/15 bg-white px-4 py-3 text-sm text-[#0b1f3a] shadow-sm outline-none focus:ring-2 focus:ring-[#c9a227]/40"
            autoComplete="off"
          />
          {historyOpen && history.length > 0 ? (
            <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-[#0b1f3a]/10 bg-white shadow-lg">
              <p className="border-b border-[#0b1f3a]/5 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/40">
                Recent searches
              </p>
              <ul>
                {history.map((q) => (
                  <li key={q}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-[#0b1f3a] hover:bg-[#f7f5f0]"
                      onClick={() => {
                        setSearch(q);
                        onSearchChange(q);
                        setHistoryOpen(false);
                      }}
                    >
                      <span>{q}</span>
                      <span className="text-[10px] uppercase tracking-wide text-[#0b1f3a]/35">
                        reuse
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="rounded-lg border border-[#0b1f3a]/15 bg-white px-4 py-3 text-sm font-semibold capitalize text-[#0b1f3a] shadow-sm sm:hidden"
        >
          <option value="all">All categories</option>
          <option value="flagships">Flagships</option>
          <option value="grants">Grants &amp; nonprofit</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-xs text-[#1c2230]/45">
        Showing {filtered.length} of {initialEngines.length} engines
        {search.trim() ? ` for “${search.trim()}”` : ""}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-[#0b1f3a]/20 bg-white px-6 py-16 text-center">
            <p className="font-display text-lg font-semibold text-[#0b1f3a]">
              No engines match that search
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#1c2230]/55">
              Try Flagships, Grants &amp; nonprofit, clear the search, or ask Apex
              Concierge (bottom-right) for a special request.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("flagships");
                }}
                className="rounded-lg bg-[#0b1f3a] px-4 py-2 text-xs font-bold text-[#f7f5f0]"
              >
                Show Flagships
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("grants");
                }}
                className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a]"
              >
                Show Grants &amp; nonprofit
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
                className="rounded-lg border border-[#0b1f3a]/15 px-4 py-2 text-xs font-bold text-[#0b1f3a]"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          filtered.map((engine) => {
            const name = displayTitle(engine.title);
            const flagship = FLAGSHIP_SET.has(engine.slug);
            return (
              <Link
                key={engine.slug}
                href={`/engine/${engine.slug}`}
                className="block rounded-lg border border-[#0b1f3a]/10 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#c9a227]/50 hover:shadow-md"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-sm font-bold leading-snug text-[#0b1f3a]">
                    {name}
                  </h3>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    {flagship ? (
                      <span className="rounded-full bg-[#0b1f3a] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#c9a227]">
                        Flagship
                      </span>
                    ) : null}
                    <span className="rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#8a6d13]">
                      {engine.category}
                    </span>
                  </div>
                </div>
                <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[#1c2230]/60">
                  {engine.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-[#0b1f3a]/40">
                    Sample on page →
                  </span>
                  <div className="font-mono text-sm font-bold text-[#0b1f3a]">
                    ${engine.priceInUSD}
                    <span className="ml-1 text-[10px] font-bold uppercase text-[#1c2230]/40">
                      USD
                    </span>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
