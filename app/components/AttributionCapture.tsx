"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_DAYS,
  extractAttributionFromSearch,
} from "@/lib/attribution";

/**
 * Renders nothing. On every page load, if the URL carries ad-attribution
 * params (utm_*, gclid, fbclid — i.e. this visit came from a video ad,
 * search ad, or tagged social post), stash them in a first-party cookie so
 * the checkout form can attach them to the order later, even if the buyer
 * lands on one engine page and purchases a different one during the same
 * session.
 *
 * Uses a "last ad click wins" model: only overwrites the cookie when new
 * attribution params are actually present, so organic/direct revisits don't
 * wipe out the ad click that originally brought the buyer in.
 */
export function AttributionCapture() {
  useEffect(() => {
    const found = extractAttributionFromSearch(window.location.search);
    if (Object.keys(found).length === 0) return;

    // Mirror Meta Pixel's own _fbc cookie format so server-side Conversions
    // API events can match even if fbevents.js hasn't set it yet.
    if (found.fbclid && !document.cookie.includes("_fbc=")) {
      const fbc = `fb.1.${Date.now()}.${found.fbclid}`;
      document.cookie = `_fbc=${fbc}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
    }

    const payload = encodeURIComponent(
      JSON.stringify({ ...found, landedAt: new Date().toISOString() }),
    );
    const maxAge = ATTRIBUTION_MAX_AGE_DAYS * 24 * 60 * 60;
    document.cookie = `${ATTRIBUTION_COOKIE}=${payload}; path=/; max-age=${maxAge}; SameSite=Lax`;
  }, []);

  return null;
}
