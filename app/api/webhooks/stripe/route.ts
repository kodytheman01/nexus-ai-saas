import { NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { processEngineExecution } from "@/lib/process-engine";
import { runAfterResponse } from "@/lib/run-after-response";

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

    if (!existing) {
      await db.engineRun.create({
        data: {
          stripeSessionId: session.id,
          userEmail: customerEmail,
          engineSlug,
          inputParameters: ephemeral.userInput,
          status: "pending",
        },
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

    await db.ephemeralPayload.delete({ where: { id: ephemeral.id } }).catch(() => undefined);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
