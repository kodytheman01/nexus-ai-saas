"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type CatalogEngine = {
  slug: string;
  title: string;
  description: string;
  priceInUSD: number;
  category: string;
};

export function ClientCatalogView({
  initialEngines,
  categories,
}: {
  initialEngines: CatalogEngine[];
  categories: string[];
}) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return initialEngines.filter((eng) => {
      const catOk = activeCategory === "all" || eng.category === activeCategory;
      const q = search.toLowerCase();
      const searchOk =
        !q ||
        eng.title.toLowerCase().includes(q) ||
        eng.description.toLowerCase().includes(q);
      return catOk && searchOk;
    });
  }, [initialEngines, activeCategory, search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search engines..."
          className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none focus:ring-2 focus:ring-emerald-600/30"
        />
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold capitalize text-zinc-900 shadow-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="col-span-full rounded-xl border border-dashed border-zinc-300 bg-white py-16 text-center text-sm text-zinc-400">
            No engines match your filters.
          </div>
        ) : (
          filtered.map((engine) => (
            <button
              key={engine.slug}
              type="button"
              onClick={() => router.push(`/engine/${engine.slug}`)}
              className="rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-600/40 hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-sm font-bold leading-snug text-zinc-900">
                  {engine.title}
                </h3>
                <span className="shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  {engine.category}
                </span>
              </div>
              <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-zinc-500">
                {engine.description}
              </p>
              <div className="text-right font-mono text-sm font-black text-zinc-900">
                ${engine.priceInUSD}
                <span className="ml-1 text-[10px] font-bold uppercase text-zinc-400">
                  USD
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
