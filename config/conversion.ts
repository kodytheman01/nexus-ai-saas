import { FLAGSHIP_ENGINES } from "@/config/flagship";

/** Primary paid Grant Mode landing — highest intent → highest CVR. */
export const GRANT_NARRATIVE_SLUG = "grant-proposal-narrative-generator";

/** Primary Notice Mode landing — landlord rent demand. */
export const NOTICE_PRIMARY_SLUG = "pay-or-quit-notice-drafter";

export const GRANT_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Grant Mode",
).map((f) => f.slug);

export const NOTICE_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Notice Mode" || f.badge === "Tenant Mode",
).map((f) => f.slug);

const GRANT_SLUG_SET = new Set(GRANT_FLAGSHIP_SLUGS);
const NOTICE_SLUG_SET = new Set(NOTICE_FLAGSHIP_SLUGS);

type ParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function param(sp: ParamSource, key: string): string {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? "";
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

/** True when this visit looks like paid / tagged Grant Mode traffic. */
export function isGrantPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  const medium = param(sp, "utm_medium").toLowerCase();
  const source = param(sp, "utm_source").toLowerCase();

  // Notice campaigns must not steal Grant landings
  if (
    campaign.includes("notice") ||
    campaign.includes("eviction") ||
    campaign.includes("landlord") ||
    campaign.includes("tenant")
  ) {
    return false;
  }

  if (campaign.includes("grant")) return true;
  if (GRANT_SLUG_SET.has(content)) return true;
  if (
    (medium.includes("video") || medium === "paid_social" || medium === "cpc") &&
    (campaign.includes("apex") || source.includes("meta") || source.includes("instagram"))
  ) {
    // Wave-1 grant kits use apex_wave1_grant; premium uses apex_wave1_premium
    if (campaign.includes("premium")) return false;
    if (campaign.includes("wave1") || campaign.includes("apex")) return true;
  }
  return false;
}

/** True when visit looks like paid / tagged Notice Mode traffic. */
export function isNoticePaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  const medium = param(sp, "utm_medium").toLowerCase();
  const source = param(sp, "utm_source").toLowerCase();

  if (
    campaign.includes("notice") ||
    campaign.includes("eviction") ||
    campaign.includes("landlord") ||
    campaign.includes("tenant") ||
    campaign.includes("lease")
  ) {
    return true;
  }
  if (NOTICE_SLUG_SET.has(content)) return true;
  if (
    (medium.includes("video") || medium === "paid_social" || medium === "cpc") &&
    (campaign.includes("rent") ||
      content.includes("notice") ||
      content.includes("pay-or-quit"))
  ) {
    return true;
  }
  // unused but kept for future Meta notice creatives
  void source;
  return false;
}

const ATTR_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "gclid",
  "fbclid",
] as const;

function withAttribution(
  slug: string,
  sp?: ParamSource,
): string {
  const u = new URLSearchParams();
  if (sp) {
    for (const key of ATTR_KEYS) {
      const v = param(sp, key);
      if (v) u.set(key, v);
    }
  }
  u.set("sample", "1");
  u.set("focus", "intake");
  return `/engine/${slug}?${u.toString()}`;
}

/** Deep-link path: narrative engine + sample intake + scroll to checkout. */
export function grantMoneyLandingPath(sp?: ParamSource): string {
  return withAttribution(GRANT_NARRATIVE_SLUG, sp);
}

/** Deep-link path: pay-or-quit + sample intake. */
export function noticeMoneyLandingPath(sp?: ParamSource): string {
  return withAttribution(NOTICE_PRIMARY_SLUG, sp);
}

export const GRANT_GO_PATH = "/go/grant";
export const NOTICE_GO_PATH = "/go/notice";
