import { createHash } from "crypto";
import type { AttributionData } from "@/lib/attribution";

/**
 * Server-side conversion events fired from the Stripe webhook, i.e. after a
 * payment is confirmed to have actually happened. This is deliberately
 * separate from (and complementary to) any client-side pixel firing on the
 * success page: server-side events survive ad blockers and iOS tracking
 * prevention, which is where most ad-spend attribution is normally lost.
 *
 * Both functions are no-ops (log + return) if their required env vars are
 * missing, and never throw — a broken tracking integration must never break
 * order fulfillment.
 */

type PurchaseEvent = {
  sessionId: string;
  engineSlug: string;
  engineTitle: string;
  amountUSD: number;
  customerEmail?: string;
  attribution: AttributionData;
};

export async function sendGA4Purchase(event: PurchaseEvent): Promise<void> {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const apiSecret = process.env.GA4_API_SECRET;

  if (!measurementId || !apiSecret) return;

  const clientId = event.attribution.gaClientId || `${Date.now()}.${Math.floor(Math.random() * 1e9)}`;

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name: "purchase",
              params: {
                transaction_id: event.sessionId,
                currency: "USD",
                value: event.amountUSD,
                items: [
                  {
                    item_id: event.engineSlug,
                    item_name: event.engineTitle,
                    price: event.amountUSD,
                    quantity: 1,
                  },
                ],
                source: event.attribution.utm_source,
                medium: event.attribution.utm_medium,
                campaign: event.attribution.utm_campaign,
              },
            },
          ],
        }),
      },
    );
    if (!res.ok) {
      console.warn("GA4 Measurement Protocol non-OK response:", res.status, await res.text());
    }
  } catch (err) {
    console.warn("GA4 server-side purchase event failed:", err);
  }
}

export async function sendMetaPurchase(event: PurchaseEvent): Promise<void> {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_TOKEN;

  if (!pixelId || !accessToken) return;

  const userData: Record<string, string | string[]> = {};
  if (event.customerEmail) {
    userData.em = [
      createHash("sha256").update(event.customerEmail.trim().toLowerCase()).digest("hex"),
    ];
  }
  if (event.attribution.fbp) userData.fbp = event.attribution.fbp;
  if (event.attribution.fbc) userData.fbc = event.attribution.fbc;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${accessToken}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: [
            {
              event_name: "Purchase",
              event_time: Math.floor(Date.now() / 1000),
              event_id: event.sessionId, // must match the client-side eventID for pixel+CAPI dedup
              action_source: "website",
              event_source_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com"}/engine/${event.engineSlug}`,
              user_data: userData,
              custom_data: {
                currency: "USD",
                value: event.amountUSD,
                content_name: event.engineTitle,
                content_ids: [event.engineSlug],
              },
            },
          ],
        }),
      },
    );
    if (!res.ok) {
      console.warn("Meta Conversions API non-OK response:", res.status, await res.text());
    }
  } catch (err) {
    console.warn("Meta server-side purchase event failed:", err);
  }
}
