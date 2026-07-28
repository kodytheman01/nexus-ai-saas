"use client";

import { FormEvent, useEffect, useState } from "react";

type EngineRow = {
  slug: string;
  title: string;
  description: string;
  priceInUSD: number;
  category: string;
  outputFormat: string;
};

const emptyForm = {
  slug: "",
  title: "",
  description: "",
  priceInUSD: 19,
  inputLabel: "",
  inputPlaceholder: "",
  aiSystemPrompt: "",
  outputFormat: "markdown",
  category: "automation",
};

export default function AdminEnginesPage() {
  const [engines, setEngines] = useState<EngineRow[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const res = await fetch("/api/admin/engines");
    if (res.ok) setEngines(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/engines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMessage("Engine saved.");
      setForm(emptyForm);
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-zinc-900">
        Engine Admin
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Add or update engines without redeploying code.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <form
          onSubmit={onSubmit}
          className="space-y-3 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:col-span-1"
        >
          {(
            [
              ["slug", "Slug"],
              ["title", "Title"],
              ["description", "Description"],
              ["inputLabel", "Input label"],
              ["inputPlaceholder", "Placeholder"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {label}
              </label>
              <input
                required={key === "slug" || key === "title"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Price USD
              </label>
              <input
                type="number"
                value={form.priceInUSD}
                onChange={(e) =>
                  setForm({ ...form, priceInUSD: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Format
              </label>
              <select
                value={form.outputFormat}
                onChange={(e) =>
                  setForm({ ...form, outputFormat: e.target.value })
                }
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
              >
                <option value="markdown">markdown</option>
                <option value="json">json</option>
                <option value="code">code</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Category
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              AI system prompt
            </label>
            <textarea
              required
              rows={5}
              value={form.aiSystemPrompt}
              onChange={(e) =>
                setForm({ ...form, aiSystemPrompt: e.target.value })
              }
              className="w-full rounded-lg border border-zinc-200 bg-zinc-950 px-3 py-2 font-mono text-xs text-emerald-300"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-bold text-white disabled:bg-zinc-300"
          >
            {loading ? "Saving..." : "Save engine"}
          </button>
          {message ? (
            <p className="text-center text-xs text-zinc-500">{message}</p>
          ) : null}
        </form>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm lg:col-span-2">
          <div className="border-b border-zinc-100 px-5 py-4">
            <h2 className="font-bold text-zinc-900">
              Live engines ({engines.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="p-3">Engine</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Format</th>
                </tr>
              </thead>
              <tbody>
                {engines.map((eng) => (
                  <tr key={eng.slug} className="border-t border-zinc-100">
                    <td className="p-3">
                      <div className="font-semibold text-zinc-900">
                        {eng.title}
                      </div>
                      <div className="font-mono text-[11px] text-zinc-400">
                        {eng.slug}
                      </div>
                    </td>
                    <td className="p-3 capitalize">{eng.category}</td>
                    <td className="p-3 font-mono">${eng.priceInUSD}</td>
                    <td className="p-3 font-mono uppercase text-zinc-500">
                      {eng.outputFormat}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
