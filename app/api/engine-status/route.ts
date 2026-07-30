import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { displayTitle } from "@/lib/display";
import { HUMAN_REVIEW_USD } from "@/lib/offer";
import { isConfirmedStripeCheckoutSession } from "@/lib/stripe-session";

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
        humanReview: true,
        engine: { select: { title: true, priceInUSD: true } },
      },
    });

    if (!run) {
      return NextResponse.json({
        status: "pending",
        paid: isConfirmedStripeCheckoutSession(sessionId),
      });
    }

    const basePrice = run.engine?.priceInUSD ?? 0;
    const totalValue = basePrice + (run.humanReview ? HUMAN_REVIEW_USD : 0);
    // Demo / checkout-override runs complete without Stripe money — never treat as paid.
    const paid = isConfirmedStripeCheckoutSession(sessionId);

    return NextResponse.json({
      status: run.status,
      engineSlug: run.engineSlug,
      outputData: run.outputData,
      allowanceTokens: run.allowanceTokens,
      engineTitle: run.engine?.title
        ? displayTitle(run.engine.title)
        : undefined,
      priceInUSD: totalValue,
      humanReview: run.humanReview,
      paid,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Status lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
