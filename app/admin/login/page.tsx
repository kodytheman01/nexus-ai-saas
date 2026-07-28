"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/engines";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      router.push(from);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4">
      <div className="flex items-center gap-2.5 self-center">
        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#0b1f3a] text-sm font-bold text-[#c9a227]">
          A
        </span>
        <div className="leading-tight">
          <div className="text-sm font-bold tracking-tight text-[#0b1f3a]">
            Apex Capital
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-[#0b1f3a]/50">
            Admin Services
          </div>
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        className="mt-8 space-y-3 rounded-lg border border-[#0b1f3a]/10 bg-white p-6 shadow-sm"
      >
        <h1 className="font-display text-lg font-semibold text-[#0b1f3a]">
          Restricted access
        </h1>
        <p className="text-xs text-[#1c2230]/60">
          Enter the administrator password to continue.
        </p>
        <input
          type="password"
          autoFocus
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full rounded-lg border border-[#0b1f3a]/15 px-3 py-2 text-sm"
        />
        {error ? <p className="text-xs text-red-600">{error}</p> : null}
        <button
          disabled={loading}
          className="w-full rounded-lg bg-[#0b1f3a] py-2.5 text-sm font-bold text-white disabled:bg-[#0b1f3a]/30"
        >
          {loading ? "Verifying..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
