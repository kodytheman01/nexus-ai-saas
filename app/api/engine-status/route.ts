import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json(
      { error: "Missing session_id parameter" },
      { status: 400 },
    );
  }

  try {
    const run = await db.engineRun.findUnique({
      where: { stripeSessionId: sessionId },
      select: {
        status: true,
        outputData: true,
        engineSlug: true,
        allowanceTokens: true,
        engine: { select: { title: true, priceInUSD: true } },
      },
    });

    if (!run) {
      return NextResponse.json({ status: "pending" });
    }

    return NextResponse.json({
      status: run.status,
      engineSlug: run.engineSlug,
      outputData: run.outputData,
      allowanceTokens: run.allowanceTokens,
      engineTitle: run.engine?.title,
      priceInUSD: run.engine?.priceInUSD,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Status lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
