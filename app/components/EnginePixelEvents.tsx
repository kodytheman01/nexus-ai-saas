"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/** Fire Meta/GA view events on engine PDPs for retargeting audiences. */
export function EnginePixelEvents({
  slug,
  name,
  priceInUSD,
}: {
  slug: string;
  name: string;
  priceInUSD: number;
}) {
  useEffect(() => {
    window.fbq?.("track", "ViewContent", {
      content_name: name,
      content_ids: [slug],
      content_type: "product",
      value: priceInUSD,
      currency: "USD",
    });
    window.gtag?.("event", "view_item", {
      currency: "USD",
      value: priceInUSD,
      items: [{ item_id: slug, item_name: name, price: priceInUSD }],
    });
  }, [slug, name, priceInUSD]);

  return null;
}
