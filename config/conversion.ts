import { FLAGSHIP_ENGINES } from "@/config/flagship";
import { modePrimarySlug, type ModeId } from "@/config/mode-catalog";

/** Primary paid Grant Mode landing — highest intent → highest CVR. */
export const GRANT_NARRATIVE_SLUG = "grant-proposal-narrative-generator";

/** Primary Notice Mode landing — landlord rent demand. */
export const NOTICE_PRIMARY_SLUG = "pay-or-quit-notice-drafter";

/** Primary Tenant Mode landing — repair request. */
export const TENANT_PRIMARY_SLUG = "tenant-repair-request-letter";

/** Primary Bid Mode landing — contractor proposal. */
export const BID_PRIMARY_SLUG = "contractor-proposal-drafter";

/** Primary Offer Mode landing — job offer letter. */
export const OFFER_PRIMARY_SLUG = "job-offer-letter-drafter";

/** Primary Policy Mode landing — PIP. */
export const POLICY_PRIMARY_SLUG = "performance-improvement-plan-pip-generator";

/** Primary Collect Mode landing — unpaid invoice demand. */
export const COLLECT_PRIMARY_SLUG = "demand-letter-for-unpaid-invoice-generator";

/** Primary Lien Mode landing — preliminary notice. */
export const LIEN_PRIMARY_SLUG = "preliminary-notice-drafter";

/** Primary Eviction Mode landing — possession pack. */
export const EVICTION_PRIMARY_SLUG = "possession-demand-pack-outline";

/** Primary Creator Mode landing — brand deal terms. */
export const CREATOR_PRIMARY_SLUG = "brand-deal-terms-drafter";

/** Primary Deal Mode landing — LOI outline. */
export const DEAL_PRIMARY_SLUG = "letter-of-intent-outline";

export const GRANT_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Grant Mode",
).map((f) => f.slug);

export const NOTICE_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Notice Mode",
).map((f) => f.slug);

export const TENANT_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Tenant Mode",
).map((f) => f.slug);

export const BID_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Bid Mode",
).map((f) => f.slug);

export const OFFER_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Offer Mode",
).map((f) => f.slug);

export const POLICY_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Policy Mode",
).map((f) => f.slug);

export const COLLECT_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Collect Mode",
).map((f) => f.slug);

export const LIEN_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Lien Mode",
).map((f) => f.slug);

export const EVICTION_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Eviction Mode",
).map((f) => f.slug);

export const CREATOR_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Creator Mode",
).map((f) => f.slug);

export const DEAL_FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.filter(
  (f) => f.badge === "Deal Mode",
).map((f) => f.slug);

const GRANT_SLUG_SET = new Set(GRANT_FLAGSHIP_SLUGS);
const NOTICE_SLUG_SET = new Set(NOTICE_FLAGSHIP_SLUGS);
const TENANT_SLUG_SET = new Set(TENANT_FLAGSHIP_SLUGS);
const BID_SLUG_SET = new Set(BID_FLAGSHIP_SLUGS);
const OFFER_SLUG_SET = new Set(OFFER_FLAGSHIP_SLUGS);
const POLICY_SLUG_SET = new Set(POLICY_FLAGSHIP_SLUGS);
const COLLECT_SLUG_SET = new Set(COLLECT_FLAGSHIP_SLUGS);
const LIEN_SLUG_SET = new Set(LIEN_FLAGSHIP_SLUGS);
const EVICTION_SLUG_SET = new Set(EVICTION_FLAGSHIP_SLUGS);
const CREATOR_SLUG_SET = new Set(CREATOR_FLAGSHIP_SLUGS);
const DEAL_SLUG_SET = new Set(DEAL_FLAGSHIP_SLUGS);

type ParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function param(sp: ParamSource, key: string): string {
  if (sp instanceof URLSearchParams) return sp.get(key) ?? "";
  const v = sp[key];
  if (Array.isArray(v)) return v[0] ?? "";
  return v ?? "";
}

function campaignHintsNotice(campaign: string): boolean {
  return (
    (campaign.includes("notice") ||
      campaign.includes("landlord") ||
      campaign.includes("lease")) &&
    !campaign.includes("eviction") &&
    !campaign.includes("lien")
  );
}

function campaignHintsLien(campaign: string): boolean {
  return (
    campaign.includes("lien") ||
    campaign.includes("prelim") ||
    campaign.includes("mechanic")
  );
}

function campaignHintsEviction(campaign: string): boolean {
  return (
    campaign.includes("eviction") ||
    campaign.includes("possession") ||
    campaign.includes("unlawful_detainer") ||
    campaign.includes("ud_")
  );
}

function campaignHintsCreator(campaign: string): boolean {
  return (
    campaign.includes("creator") ||
    campaign.includes("brand_deal") ||
    campaign.includes("brand-deal") ||
    campaign.includes("influencer") ||
    campaign.includes("ugc")
  );
}

function campaignHintsDeal(campaign: string): boolean {
  return (
    campaign.includes("deal") ||
    campaign.includes("loi") ||
    campaign.includes("term_sheet") ||
    campaign.includes("term-sheet") ||
    campaign.includes("manda")
  );
}

function campaignHintsTenant(campaign: string): boolean {
  return (
    campaign.includes("tenant") ||
    campaign.includes("renter") ||
    campaign.includes("habitability") ||
    campaign.includes("roommate")
  );
}

function campaignHintsBid(campaign: string): boolean {
  return (
    campaign.includes("bid") ||
    campaign.includes("contractor") ||
    campaign.includes("change-order") ||
    campaign.includes("change_order")
  );
}

function campaignHintsOffer(campaign: string): boolean {
  return (
    campaign.includes("offer") ||
    campaign.includes("hiring") ||
    campaign.includes("job-offer")
  );
}

function campaignHintsPolicy(campaign: string): boolean {
  return (
    campaign.includes("policy") ||
    campaign.includes("pip") ||
    campaign.includes("handbook") ||
    campaign.includes("people-ops") ||
    campaign.includes("people_ops")
  );
}

function campaignHintsCollect(campaign: string): boolean {
  return (
    campaign.includes("collect") ||
    campaign.includes("invoice") ||
    campaign.includes("demand") ||
    campaign.includes("receivable") ||
    campaign.includes("ar_")
  );
}

/** True when this visit looks like paid / tagged Grant Mode traffic. */
export function isGrantPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  const medium = param(sp, "utm_medium").toLowerCase();
  const source = param(sp, "utm_source").toLowerCase();

  if (
    campaignHintsNotice(campaign) ||
    campaignHintsTenant(campaign) ||
    campaignHintsBid(campaign) ||
    campaignHintsOffer(campaign) ||
    campaignHintsPolicy(campaign) ||
    campaignHintsCollect(campaign) ||
    campaignHintsLien(campaign) ||
    campaignHintsEviction(campaign) ||
    campaignHintsCreator(campaign) ||
    campaignHintsDeal(campaign)
  ) {
    return false;
  }

  if (campaign.includes("grant")) return true;
  if (GRANT_SLUG_SET.has(content)) return true;
  if (
    (medium.includes("video") || medium === "paid_social" || medium === "cpc") &&
    (campaign.includes("apex") || source.includes("meta") || source.includes("instagram"))
  ) {
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

  if (
    campaignHintsTenant(campaign) ||
    campaignHintsBid(campaign) ||
    campaignHintsOffer(campaign) ||
    campaignHintsPolicy(campaign) ||
    campaignHintsCollect(campaign) ||
    campaignHintsLien(campaign) ||
    campaignHintsEviction(campaign) ||
    campaignHintsCreator(campaign) ||
    campaignHintsDeal(campaign)
  ) {
    return false;
  }

  if (campaignHintsNotice(campaign)) return true;
  if (NOTICE_SLUG_SET.has(content)) return true;
  if (
    (medium.includes("video") || medium === "paid_social" || medium === "cpc") &&
    (campaign.includes("rent") ||
      content.includes("notice") ||
      content.includes("pay-or-quit"))
  ) {
    return true;
  }
  return false;
}

export function isTenantPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsTenant(campaign)) return true;
  if (TENANT_SLUG_SET.has(content)) return true;
  if (
    content.includes("tenant") ||
    content.includes("repair-request") ||
    content.includes("roommate")
  ) {
    return true;
  }
  return false;
}

export function isBidPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsBid(campaign)) return true;
  if (BID_SLUG_SET.has(content)) return true;
  if (content.includes("contractor") || content.includes("bid")) return true;
  return false;
}

export function isOfferPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsPolicy(campaign) || campaignHintsCollect(campaign)) {
    return false;
  }
  if (campaignHintsOffer(campaign)) return true;
  if (OFFER_SLUG_SET.has(content)) return true;
  if (content.includes("offer") || content.includes("hiring")) return true;
  return false;
}

export function isPolicyPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsPolicy(campaign)) return true;
  if (POLICY_SLUG_SET.has(content)) return true;
  if (content.includes("pip") || content.includes("handbook")) return true;
  return false;
}

export function isCollectPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsCollect(campaign)) return true;
  if (COLLECT_SLUG_SET.has(content)) return true;
  if (content.includes("invoice") || content.includes("demand")) return true;
  return false;
}

export function isLienPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsLien(campaign)) return true;
  if (LIEN_SLUG_SET.has(content)) return true;
  if (content.includes("lien") || content.includes("prelim")) return true;
  return false;
}

export function isEvictionPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsEviction(campaign)) return true;
  if (EVICTION_SLUG_SET.has(content)) return true;
  if (content.includes("eviction") || content.includes("possession")) return true;
  return false;
}

export function isCreatorPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsCreator(campaign)) return true;
  if (CREATOR_SLUG_SET.has(content)) return true;
  if (content.includes("creator") || content.includes("brand-deal")) return true;
  return false;
}

export function isDealPaidTraffic(sp: ParamSource): boolean {
  const campaign = param(sp, "utm_campaign").toLowerCase();
  const content = param(sp, "utm_content").toLowerCase();
  if (campaignHintsDeal(campaign)) return true;
  if (DEAL_SLUG_SET.has(content)) return true;
  if (content.includes("loi") || content.includes("term-sheet")) return true;
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

function withAttribution(slug: string, sp?: ParamSource): string {
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

const PRIMARY_BY_MODE: Record<ModeId, string> = {
  grant: GRANT_NARRATIVE_SLUG,
  notice: NOTICE_PRIMARY_SLUG,
  tenant: TENANT_PRIMARY_SLUG,
  bid: BID_PRIMARY_SLUG,
  offer: OFFER_PRIMARY_SLUG,
  policy: POLICY_PRIMARY_SLUG,
  collect: COLLECT_PRIMARY_SLUG,
  lien: LIEN_PRIMARY_SLUG,
  eviction: EVICTION_PRIMARY_SLUG,
  creator: CREATOR_PRIMARY_SLUG,
  deal: DEAL_PRIMARY_SLUG,
};

export function modeMoneyLandingPath(modeId: ModeId, sp?: ParamSource): string {
  const slug = modePrimarySlug(modeId) ?? PRIMARY_BY_MODE[modeId];
  return withAttribution(slug, sp);
}

export function grantMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("grant", sp);
}

export function noticeMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("notice", sp);
}

export function tenantMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("tenant", sp);
}

export function bidMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("bid", sp);
}

export function offerMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("offer", sp);
}

export function policyMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("policy", sp);
}

export function collectMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("collect", sp);
}

export function lienMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("lien", sp);
}

export function evictionMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("eviction", sp);
}

export function creatorMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("creator", sp);
}

export function dealMoneyLandingPath(sp?: ParamSource): string {
  return modeMoneyLandingPath("deal", sp);
}

export const GRANT_GO_PATH = "/go/grant";
export const NOTICE_GO_PATH = "/go/notice";
export const TENANT_GO_PATH = "/go/tenant";
export const BID_GO_PATH = "/go/bid";
export const OFFER_GO_PATH = "/go/offer";
export const POLICY_GO_PATH = "/go/policy";
export const COLLECT_GO_PATH = "/go/collect";
export const LIEN_GO_PATH = "/go/lien";
export const EVICTION_GO_PATH = "/go/eviction";
export const CREATOR_GO_PATH = "/go/creator";
export const DEAL_GO_PATH = "/go/deal";
