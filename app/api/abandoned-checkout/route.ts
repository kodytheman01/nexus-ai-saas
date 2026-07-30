import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { displayTitle } from "@/lib/display";

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Capture intent before Stripe so drip isn't limited to session creators.
 * Idempotent per email+engine while still open (not converted).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body.email || "").trim().toLowerCase();
    const engineSlug = String(body.engineSlug || "").trim();

    if (!looksLikeEmail(email) || !engineSlug) {
      return NextResponse.json({ error: "email and engineSlug required" }, { status: 400 });
    }

    const engine = await db.calculationEngine.findUnique({
      where: { slug: engineSlug },
      select: { title: true, isActive: true },
    });
    if (!engine?.isActive) {
      return NextResponse.json({ error: "Engine not found" }, { status: 404 });
    }

    const existing = await db.abandonedCheckout.findFirst({
      where: { email, engineSlug, convertedAt: null },
      orderBy: { createdAt: "desc" },
    });

    let abandonedId = existing?.id;
    if (!existing) {
      const created = await db.abandonedCheckout.create({
        data: { email, engineSlug },
      });
      abandonedId = created.id;
      try {
        await inngest.send({
          name: "checkout/abandoned.schedule",
          data: {
            abandonedId: created.id,
            stripeSessionId: "",
            email,
            engineSlug,
            engineTitle: displayTitle(engine.title),
          },
        });
      } catch {
        // Cron fallback still works
      }
    }

    return NextResponse.json({ ok: true, id: abandonedId });
  } catch (e) {
    console.error("abandoned-checkout", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
