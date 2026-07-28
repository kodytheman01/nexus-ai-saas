import { NextResponse } from "next/server";
import OpenAI from "openai";
import { db } from "@/lib/db";
import { withBackoffOrFallback } from "@/lib/api-utils";

/**
 * Lightweight AI concierge for customer concerns + special requests.
 * Grounded in the live engine catalog; never invents fake prices.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const message = String(body.message || "").trim().slice(0, 2000);
    const sessionId = String(body.sessionId || "anon").slice(0, 80);
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    if (message.length < 2) {
      return NextResponse.json({ error: "Message required." }, { status: 400 });
    }

    await db.supportMessage
      .create({
        data: { sessionId, role: "user", content: message },
      })
      .catch(() => undefined);

    const engines = await db.calculationEngine.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        title: true,
        description: true,
        priceInUSD: true,
        category: true,
      },
      take: 500,
    });

    // Rank a shortlist by keyword overlap so the model stays focused.
    const tokens = message
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);
    const scored = engines
      .map((e) => {
        const hay = `${e.title} ${e.description} ${e.category}`.toLowerCase();
        const score = tokens.reduce((s, t) => (hay.includes(t) ? s + 1 : s), 0);
        return { e, score };
      })
      .sort((a, b) => b.score - a.score);

    const shortlist = (scored[0]?.score ? scored.slice(0, 12) : scored.slice(0, 8)).map(
      ({ e }) => e,
    );

    const catalogBlock = shortlist
      .map(
        (e) =>
          `- ${e.title} ($${e.priceInUSD}) [${e.category}] /engine/${e.slug}: ${e.description.slice(0, 160)}`,
      )
      .join("\n");

    const system = `You are Apex Concierge for Apex Capital Admin Services (apexcapitaladmin.com).
Tone: professional, concise, institutional — navy/gold brand energy without fluff.
You help with: which engine to use, pricing, how checkout/delivery works, special requests, and general concerns.
Rules:
- Recommend only engines from the catalog snippet below. Link as /engine/{slug}.
- Checkout is Stripe; delivery is typically under 60 seconds via on-page deliverable (+ email when configured).
- Outputs are informational / structural — not licensed legal/financial/medical advice.
- For special custom work, collect the request and suggest the closest engine OR email admin@apexcapitaladmin.com.
- Keep answers under 120 words unless listing options.
- If unsure, say so and point to search on the homepage.

Catalog shortlist:
${catalogBlock}`;

    const prior = history
      .filter(
        (h: { role?: string; content?: string }) =>
          h &&
          (h.role === "user" || h.role === "assistant") &&
          typeof h.content === "string",
      )
      .map((h: { role: string; content: string }) => ({
        role: h.role as "user" | "assistant",
        content: h.content.slice(0, 1000),
      }));

    const fallback = () => {
      if (shortlist.length === 0) {
        return `I can help you find the right engine. Try the search bar on the homepage, or email admin@apexcapitaladmin.com with your special request.`;
      }
      const top = shortlist.slice(0, 3);
      return [
        `Based on what you described, these engines are the closest fits:`,
        ...top.map(
          (e) => `• ${e.title} ($${e.priceInUSD}) — /engine/${e.slug}`,
        ),
        `Checkout is secured by Stripe; delivery is typically under 60 seconds. For a custom special request, email admin@apexcapitaladmin.com.`,
      ].join("\n");
    };

    let reply: string;
    if (!process.env.OPENAI_API_KEY) {
      reply = fallback();
    } else {
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      reply = await withBackoffOrFallback(
        async () => {
          const completion = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL_MINI || "gpt-4o-mini",
            temperature: 0.4,
            messages: [
              { role: "system", content: system },
              ...prior,
              { role: "user", content: message },
            ],
          });
          return (
            completion.choices[0]?.message?.content?.trim() || fallback()
          );
        },
        fallback,
        { label: "support-chat", maxAttempts: 3, fallbackOnAnyError: true },
      );
    }

    await db.supportMessage
      .create({
        data: { sessionId, role: "assistant", content: reply },
      })
      .catch(() => undefined);

    return NextResponse.json({
      reply,
      suggestions: shortlist.slice(0, 4).map((e) => ({
        title: e.title,
        slug: e.slug,
        priceInUSD: e.priceInUSD,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Support chat failed";
    console.error("support-chat error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
