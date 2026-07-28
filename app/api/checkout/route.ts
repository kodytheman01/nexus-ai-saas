import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { processEngineExecution } from "@/lib/process-engine";
import { inngest } from "@/lib/inngest";
import { runAfterResponse } from "@/lib/run-after-response";
import { sendIntakeEmail } from "@/lib/send-intake-email";
import { serializeAttribution, type AttributionData } from "@/lib/attribution";
import { HUMAN_REVIEW_USD } from "@/lib/offer";
import { displayTitle } from "@/lib/display";

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const engineSlug = String(body.engineSlug || "").trim();
    const userInput = String(body.userInput || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const attribution: AttributionData =
      body.attribution && typeof body.attribution === "object"
        ? body.attribution
        : {};
    const attributionJson = serializeAttribution(attribution);
    const humanReview = Boolean(body.humanReview);

    if (!engineSlug || !userInput) {
      return NextResponse.json(
        { error: "engineSlug and userInput are required." },
        { status: 400 },
      );
    }

    if (userInput.length < 10) {
      return NextResponse.json(
        { error: "Please provide a more detailed input (10+ characters)." },
        { status: 400 },
      );
    }

    if (!looksLikeEmail(customerEmail)) {
      return NextResponse.json(
        { error: "A valid email is required for delivery and support." },
        { status: 400 },
      );
    }

    const engine = await db.calculationEngine.findUnique({
      where: { slug: engineSlug },
    });

    if (!engine || !engine.isActive) {
      return NextResponse.json({ error: "Engine not found." }, { status: 404 });
    }

    const productName = displayTitle(engine.title);

    const ephemeral = await db.ephemeralPayload.create({
      data: {
        engineSlug,
        userInput,
      },
    });

    if (process.env.GMAIL_APP_PASSWORD) {
      runAfterResponse(async () => {
        await sendIntakeEmail({
          engineSlug,
          userInput,
          userEmail: customerEmail,
          message: humanReview
            ? `HUMAN REVIEW REQUESTED (+$${HUMAN_REVIEW_USD}). Please manually review the generated deliverable and email the client.`
            : undefined,
        });
      });
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    if (!process.env.STRIPE_SECRET_KEY) {
      const demoSessionId = `demo_${ephemeral.id}`;
      await db.engineRun.create({
        data: {
          stripeSessionId: demoSessionId,
          userEmail: customerEmail,
          engineSlug,
          inputParameters: userInput,
          status: "pending",
          attribution: attributionJson,
          humanReview,
        },
      });

      runAfterResponse(async () => {
        await processEngineExecution({
          stripeSessionId: demoSessionId,
          engineSlug,
          userInput,
        });
      });

      try {
        await inngest.send({
          name: "engine/payment.success",
          data: {
            stripeSessionId: demoSessionId,
            engineSlug,
            userInput,
            userEmail: customerEmail,
          },
        });
      } catch {
        // Inngest optional in demo mode
      }

      return NextResponse.json({
        url: `${origin}/success?session_id=${demoSessionId}`,
        demo: true,
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: engine.priceInUSD * 100,
          product_data: {
            name: productName,
            description: engine.description.slice(0, 400),
          },
        },
      },
    ];

    if (humanReview) {
      lineItems.push({
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: HUMAN_REVIEW_USD * 100,
          product_data: {
            name: "Human specialist review add-on",
            description:
              "Apex ops review of your generated deliverable within 1 business day. Email follow-up to the address used at checkout.",
          },
        },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: lineItems,
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/engine/${engine.slug}?canceled=1`,
      metadata: {
        ephemeralStorageId: ephemeral.id,
        engineSlug: engine.slug,
        attribution: attributionJson,
        humanReview: humanReview ? "1" : "0",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
