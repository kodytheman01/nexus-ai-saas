import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { processEngineExecution } from "@/lib/process-engine";
import { runAfterResponse } from "@/lib/run-after-response";
import type { AttributionData } from "@/lib/attribution";
import { sendGA4Purchase, sendMetaPurchase } from "@/lib/server-conversions";

export async function POST(req: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 503 },
    );
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const body = await req.text();
  const headerStore = await headers();
  const signature = headerStore.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid signature";
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const engineSlug = session.metadata?.engineSlug;
    const ephemeralStorageId = session.metadata?.ephemeralStorageId;
    const customerEmail =
      session.customer_details?.email ||
      session.customer_email ||
      "unknown@user.com";

    if (!engineSlug || !ephemeralStorageId) {
      return NextResponse.json(
        { error: "Missing metadata on checkout session." },
        { status: 400 },
      );
    }

    const ephemeral = await db.ephemeralPayload.findUnique({
      where: { id: ephemeralStorageId },
    });

    if (!ephemeral) {
      return NextResponse.json(
        { error: "Ephemeral payload not found." },
        { status: 400 },
      );
    }

    const existing = await db.engineRun.findUnique({
      where: { stripeSessionId: session.id },
    });

    let attribution: AttributionData = {};
    try {
      attribution = session.metadata?.attribution
        ? (JSON.parse(session.metadata.attribution) as AttributionData)
        : {};
    } catch {
      attribution = {};
    }

    if (!existing) {
      await db.engineRun.create({
        data: {
          stripeSessionId: session.id,
          userEmail: customerEmail,
          engineSlug,
          inputParameters: ephemeral.userInput,
          status: "pending",
          attribution: session.metadata?.attribution || null,
          humanReview: session.metadata?.humanReview === "1",
        },
      });

      // Fire-and-forget server-side conversion events (survive ad blockers /
      // iOS tracking prevention). Never blocks or fails order fulfillment.
      runAfterResponse(async () => {
        const engine = await db.calculationEngine.findUnique({
          where: { slug: engineSlug },
          select: { title: true },
        });
        const purchaseEvent = {
          sessionId: session.id,
          engineSlug,
          engineTitle: engine?.title || engineSlug,
          amountUSD: (session.amount_total || 0) / 100,
          customerEmail,
          attribution,
        };
        await Promise.all([
          sendGA4Purchase(purchaseEvent),
          sendMetaPurchase(purchaseEvent),
        ]);
      });
    }

    try {
      await inngest.send({
        name: "engine/payment.success",
        data: {
          stripeSessionId: session.id,
          engineSlug,
          userInput: ephemeral.userInput,
          userEmail: customerEmail,
        },
      });
    } catch (err) {
      console.warn("Inngest unavailable, processing after response:", err);
      runAfterResponse(async () => {
        await processEngineExecution({
          stripeSessionId: session.id,
          engineSlug,
          userInput: ephemeral.userInput,
        });
      });
    }

    await db.abandonedCheckout
      .updateMany({
        where: {
          OR: [
            { stripeSessionId: session.id },
            { email: customerEmail, engineSlug, convertedAt: null },
          ],
        },
        data: { convertedAt: new Date() },
      })
      .catch(() => undefined);

    await db.ephemeralPayload.delete({ where: { id: ephemeral.id } }).catch(() => undefined);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
