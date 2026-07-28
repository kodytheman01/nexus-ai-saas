import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { processEngineExecution } from "@/lib/process-engine";
import { inngest } from "@/lib/inngest";
import { runAfterResponse } from "@/lib/run-after-response";
import { sendIntakeEmail } from "@/lib/send-intake-email";
import { serializeAttribution, type AttributionData } from "@/lib/attribution";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const engineSlug = String(body.engineSlug || "").trim();
    const userInput = String(body.userInput || "").trim();
    const customerEmail = String(body.customerEmail || "").trim();
    const attribution: AttributionData =
      body.attribution && typeof body.attribution === "object" ? body.attribution : {};
    const attributionJson = serializeAttribution(attribution);

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

    const engine = await db.calculationEngine.findUnique({
      where: { slug: engineSlug },
    });

    if (!engine || !engine.isActive) {
      return NextResponse.json({ error: "Engine not found." }, { status: 404 });
    }

    const ephemeral = await db.ephemeralPayload.create({
      data: {
        engineSlug,
        userInput,
      },
    });

    // Email intake to admin when Gmail is configured (non-blocking)
    if (process.env.GMAIL_APP_PASSWORD) {
      runAfterResponse(async () => {
        await sendIntakeEmail({
          engineSlug,
          userInput,
          userEmail: customerEmail,
        });
      });
    }

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // Demo path: no Stripe key configured — create run and process immediately
    if (!process.env.STRIPE_SECRET_KEY) {
      const demoSessionId = `demo_${ephemeral.id}`;
      await db.engineRun.create({
        data: {
          stripeSessionId: demoSessionId,
          userEmail: customerEmail || "demo@local.dev",
          engineSlug,
          inputParameters: userInput,
          status: "pending",
          attribution: attributionJson,
        },
      });

      // Process after response so Netlify/serverless does not kill the worker mid-flight
      runAfterResponse(async () => {
        await processEngineExecution({
          stripeSessionId: demoSessionId,
          engineSlug,
          userInput,
        });
      });

      // Best-effort Inngest dispatch if available
      try {
        await inngest.send({
          name: "engine/payment.success",
          data: {
            stripeSessionId: demoSessionId,
            engineSlug,
            userInput,
            userEmail: customerEmail || "demo@local.dev",
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: engine.priceInUSD * 100,
            product_data: {
              name: engine.title,
              description: engine.description.slice(0, 400),
            },
          },
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/engine/${engine.slug}?canceled=1`,
      metadata: {
        ephemeralStorageId: ephemeral.id,
        engineSlug: engine.slug,
        attribution: attributionJson,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("Checkout error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
