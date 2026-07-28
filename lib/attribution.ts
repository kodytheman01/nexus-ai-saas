/**
 * Shared first-party ad attribution helpers.
 *
 * Flow: a visitor lands with ?utm_source=...&gclid=...&fbclid=... on any page
 * (homepage or a specific engine page from a video ad) -> `AttributionCapture`
 * (client component) stores it in the `apex_attr` cookie -> `EngineCheckoutForm`
 * reads that cookie plus the `_ga`/`_fbp`/`_fbc` cookies set by GA4/Meta Pixel
 * and sends them to `/api/checkout` -> stored as Stripe session metadata and
 * on the `EngineRun` row -> used at webhook time to fire server-side GA4
 * Measurement Protocol + Meta Conversions API purchase events for attribution
 * that survives ad blockers.
 */

export const ATTRIBUTION_COOKIE = "apex_attr";
export const ATTRIBUTION_MAX_AGE_DAYS = 30;

const TRACKED_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

export type AttributionData = Partial<Record<(typeof TRACKED_PARAMS)[number], string>> & {
  gaClientId?: string;
  fbp?: string;
  fbc?: string;
  landedAt?: string;
};

export function extractAttributionFromSearch(search: string): AttributionData {
  const params = new URLSearchParams(search);
  const out: AttributionData = {};
  for (const key of TRACKED_PARAMS) {
    const value = params.get(key);
    if (value) out[key] = value.slice(0, 200);
  }
  return out;
}

export function readCookie(cookieString: string, name: string): string | null {
  const match = cookieString
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`));
  if (!match) return null;
  const value = match.slice(name.length + 1);
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseAttributionCookie(cookieString: string): AttributionData {
  const raw = readCookie(cookieString, ATTRIBUTION_COOKIE);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as AttributionData;
  } catch {
    return {};
  }
}

/** GA4 cookie format: `GA1.1.<clientIdPart>.<timestampPart>` -> client_id is the last two segments. */
export function extractGAClientIdFromCookie(cookieString: string): string | null {
  const raw = readCookie(cookieString, "_ga");
  if (!raw) return null;
  const match = raw.match(/GA\d\.\d\.(\d+\.\d+)/);
  return match ? match[1] : null;
}

/** Serialize + truncate for safe storage in a Stripe metadata value (500 char limit). */
export function serializeAttribution(data: AttributionData): string {
  const json = JSON.stringify(data);
  return json.length > 490 ? json.slice(0, 490) : json;
}
