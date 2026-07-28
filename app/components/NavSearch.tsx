"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const HISTORY_KEY = "apex_search_history";

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return Array.isArray(parsed) ? parsed.filter((q) => typeof q === "string") : [];
  } catch {
    return [];
  }
}

/**
 * Sticky header search — always visible for fast engine lookup.
 * Submits to `/?q=...` and focuses the catalog results.
 */
export function NavSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHistory(loadHistory());
    const q = searchParams.get("q");
    if (q) setValue(q);
  }, [searchParams]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function go(query: string) {
    const q = query.trim();
    if (!q) {
      if (pathname === "/") {
        document.getElementById("catalog-search")?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }
    setOpen(false);
    if (pathname === "/") {
      router.replace(`/?q=${encodeURIComponent(q)}`);
      requestAnimationFrame(() => {
        document.getElementById("catalog-search")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } else {
      router.push(`/?q=${encodeURIComponent(q)}`);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    go(value);
  }

  return (
    <div ref={wrapRef} className="relative mx-3 hidden min-w-0 flex-1 md:block lg:mx-6">
      <form onSubmit={onSubmit} className="relative">
        <label htmlFor="nav-engine-search" className="sr-only">
          Search engines
        </label>
        <input
          id="nav-engine-search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search engines…"
          className="w-full rounded-lg border border-[#0b1f3a]/12 bg-[#f7f5f0] py-2 pl-3 pr-16 text-sm text-[#0b1f3a] outline-none placeholder:text-[#0b1f3a]/40 focus:border-[#c9a227]/50 focus:ring-2 focus:ring-[#c9a227]/25"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-[#0b1f3a] px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#f7f5f0]"
        >
          Go
        </button>
      </form>
      {open && history.length > 0 ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-[#0b1f3a]/10 bg-white shadow-lg">
          <p className="border-b border-[#0b1f3a]/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#0b1f3a]/40">
            Recent
          </p>
          <ul>
            {history.slice(0, 6).map((q) => (
              <li key={q}>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm text-[#0b1f3a] hover:bg-[#f7f5f0]"
                  onClick={() => {
                    setValue(q);
                    go(q);
                  }}
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/** Compact search icon + field for mobile header. */
export function NavSearchMobile() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}` : "/");
  }

  return (
    <form onSubmit={onSubmit} className="w-full md:hidden">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search engines…"
        className="w-full rounded-lg border border-[#0b1f3a]/12 bg-[#f7f5f0] px-3 py-2 text-sm text-[#0b1f3a] outline-none focus:ring-2 focus:ring-[#c9a227]/25"
      />
    </form>
  );
}
