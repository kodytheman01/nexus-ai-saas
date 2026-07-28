import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { displayTitle } from "@/lib/display";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const runs = await db.engineRun.findMany({
      where: { humanReview: true },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        stripeSessionId: true,
        userEmail: true,
        engineSlug: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        outputData: true,
        engine: { select: { title: true, priceInUSD: true } },
      },
    });

    return NextResponse.json(
      runs.map((r) => ({
        id: r.id,
        stripeSessionId: r.stripeSessionId,
        userEmail: r.userEmail,
        engineSlug: r.engineSlug,
        engineTitle: r.engine?.title
          ? displayTitle(r.engine.title)
          : r.engineSlug,
        priceInUSD: r.engine?.priceInUSD,
        status: r.status,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        outputPreview: (r.outputData || "").slice(0, 400),
        hasOutput: Boolean(r.outputData),
      })),
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Reviews lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
