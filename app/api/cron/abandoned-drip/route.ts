import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendAbandonedCheckoutEmail } from "@/lib/send-abandoned-drip";
import { displayTitle } from "@/lib/display";

/**
 * Fallback drip processor if Inngest sleep is unavailable.
 * Secure with CRON_SECRET header: Authorization: Bearer <CRON_SECRET>
 *
 * Netlify scheduled function / external cron can hit this hourly.
 */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "CRON_SECRET not configured" },
      { status: 503 },
    );
  }
  const auth = request.headers.get("authorization") || "";
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const twoHoursAgo = new Date(now - 2 * 60 * 60 * 1000);
  const dayAgo = new Date(now - 24 * 60 * 60 * 1000);

  let drip1 = 0;
  let drip2 = 0;

  const forDrip1 = await db.abandonedCheckout.findMany({
    where: {
      convertedAt: null,
      drip1SentAt: null,
      createdAt: { lte: twoHoursAgo },
    },
    take: 40,
  });

  for (const row of forDrip1) {
    const engine = await db.calculationEngine.findUnique({
      where: { slug: row.engineSlug },
      select: { title: true },
    });
    const ok = await sendAbandonedCheckoutEmail({
      to: row.email,
      engineTitle: engine?.title || row.engineSlug,
      engineSlug: row.engineSlug,
      step: 1,
    });
    if (ok) {
      await db.abandonedCheckout.update({
        where: { id: row.id },
        data: { drip1SentAt: new Date() },
      });
      drip1 += 1;
    }
  }

  const forDrip2 = await db.abandonedCheckout.findMany({
    where: {
      convertedAt: null,
      drip2SentAt: null,
      drip1SentAt: { not: null },
      createdAt: { lte: dayAgo },
    },
    take: 40,
  });

  for (const row of forDrip2) {
    const engine = await db.calculationEngine.findUnique({
      where: { slug: row.engineSlug },
      select: { title: true },
    });
    const ok = await sendAbandonedCheckoutEmail({
      to: row.email,
      engineTitle: displayTitle(engine?.title || row.engineSlug),
      engineSlug: row.engineSlug,
      step: 2,
    });
    if (ok) {
      await db.abandonedCheckout.update({
        where: { id: row.id },
        data: { drip2SentAt: new Date() },
      });
      drip2 += 1;
    }
  }

  return NextResponse.json({ ok: true, drip1, drip2 });
}
