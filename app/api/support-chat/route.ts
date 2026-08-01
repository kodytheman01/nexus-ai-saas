import { NextResponse } from "next/server";
import OpenAI from "openai";
import { FLAGSHIP_SLUGS } from "@/config/flagship";
import { db } from "@/lib/db";
import { withBackoffOrFallback } from "@/lib/api-utils";
import { displayTitle, isGrantRelated } from "@/lib/display";

const FLAGSHIP_SET = new Set(FLAGSHIP_SLUGS);

/**
 * AI concierge: match visitor intent → live engines + navigation links.
 * Grounded in the catalog; never invents fake prices.
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

    // Load full active catalog (525+) — a take:500 cap previously dropped
    // Notice/Bid/Offer engines appended after the core 500.
    const engines = await db.calculationEngine.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        title: true,
        description: true,
        priceInUSD: true,
        category: true,
      },
      orderBy: { slug: "asc" },
    });

    const msg = message.toLowerCase();
    const tokens = msg
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2);

    const scored = engines
      .map((e) => {
        const name = displayTitle(e.title).toLowerCase();
        const hay = `${name} ${e.title} ${e.description} ${e.category} ${e.slug}`.toLowerCase();
        let score = tokens.reduce((s, t) => (hay.includes(t) ? s + 2 : s), 0);
        // Phrase boosts for common money intents
        if (/grant|foa|nofo|nonprofit|fund/.test(msg) && isGrantRelated(e)) {
          score += 6;
        }
        if (
          /pay.?or.?quit|evict|landlord|tenant|notice to vacate|rent demand|deposit itemiz|lease/.test(
            msg,
          ) &&
          (e.category === "landlord-notice" ||
            e.category === "tenant-letter" ||
            e.category === "landlord-ops" ||
            hay.includes("notice") ||
            hay.includes("tenant") ||
            hay.includes("landlord"))
        ) {
          score += 8;
        }
        if (
          /contractor|change.?order|scope of work|bid|gc |subcontractor|punch.?list/.test(
            msg,
          ) &&
          (e.category === "contractor-bid" ||
            hay.includes("contractor") ||
            hay.includes("change-order") ||
            hay.includes("scope"))
        ) {
          score += 8;
        }
        if (
          /job offer|offer letter|hiring|reject.*candidate|promotion letter|hr |internship/.test(
            msg,
          ) &&
          (e.category === "hr-offer" ||
            hay.includes("offer") ||
            hay.includes("rejection") ||
            hay.includes("promotion"))
        ) {
          // Prefer Offer Mode over cheaper core employment twins
          if (e.category === "hr-offer") score += 10;
          else score += 3;
        }
        if (/nda|non.?disclosure|confidential/.test(msg) && hay.includes("nda")) {
          score += 8;
        }
        if (/privacy|gdpr|ccpa/.test(msg) && hay.includes("privacy")) {
          score += 6;
        }
        if (/runway|burn.?rate|startup/.test(msg) && (hay.includes("runway") || hay.includes("burn"))) {
          score += 6;
        }
        if (/proposal|sales|quote|pitch/.test(msg) && hay.includes("proposal")) {
          score += 4;
        }
        if (FLAGSHIP_SET.has(e.slug)) score += 3;
        return { e, score };
      })
      .sort((a, b) => b.score - a.score || a.e.priceInUSD - b.e.priceInUSD);

    const shortlist = (
      scored[0]?.score > 0 ? scored.slice(0, 10) : scored.filter((s) => FLAGSHIP_SET.has(s.e.slug)).slice(0, 8)
    ).map(({ e }) => e);

    // If still empty somehow, fall back to flagships from full list
    const list =
      shortlist.length > 0
        ? shortlist
        : engines.filter((e) => FLAGSHIP_SET.has(e.slug)).slice(0, 8);

    const catalogBlock = list
      .map(
        (e) =>
          `- ${displayTitle(e.title)} ($${e.priceInUSD}) [${e.category}] /engine/${e.slug}?sample=1&focus=intake: ${e.description.slice(0, 140)}`,
      )
      .join("\n");

    const system = `You are Apex Concierge for Apex Capital Admin Services (apexcapitaladmin.com).
Your job: get the visitor to the RIGHT engine checkout as fast as possible.
Tone: professional, concise, helpful — no fluff.

You help with: what they need → which engine, pricing, Grant/Notice/Bid/Offer Modes, how Stripe checkout/delivery works, special requests.
Rules:
- Recommend only engines from the catalog snippet. Prefer Flagships and Mode money paths when relevant.
- Route by Mode: Grant (/go/grant), Notice (/go/notice), Tenant (/go/tenant), Bid (/go/bid), Offer (/go/offer), Policy (/go/policy), Collect (/go/collect), Lien (/go/lien), Eviction (/go/eviction), Creator (/go/creator), Deal (/go/deal). Prefer Mode engines over cheaper core twins when both exist.
- Always include the path exactly like /engine/{slug}?sample=1&focus=intake so sample intake is ready.
- Checkout is Stripe; delivery typically under 60 seconds (+ email when configured).
- Optional human specialist review is +$49.
- Outputs are informational drafts — not licensed legal/financial/medical/housing advice. Say "not legal advice" for notice/tenant/HR asks.
- Keep answers under 100 words. End with a clear next step ("Open the first link below" or similar).
- If nothing fits, say so and suggest emailing admin@apexcapitaladmin.com or browsing /modes.

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
      if (list.length === 0) {
        return `Try describing the deliverable in a few words (grant, NDA, budget, proposal), or email admin@apexcapitaladmin.com.`;
      }
      const top = list.slice(0, 3);
      return [
        `Closest fits for what you described:`,
        ...top.map(
          (e) =>
            `• ${displayTitle(e.title)} ($${e.priceInUSD}) — /engine/${e.slug}?sample=1&focus=intake`,
        ),
        `Tap a card below to open checkout with sample intake loaded.`,
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
            temperature: 0.35,
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
      suggestions: list.slice(0, 4).map((e) => ({
        title: displayTitle(e.title),
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
