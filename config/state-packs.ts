/**
 * Notice Mode state packs — TX / FL / CA.
 * Educational UX only. Never claim statutory completeness.
 */

export type NoticeStateCode = "TX" | "FL" | "CA";

export type StatePack = {
  code: NoticeStateCode;
  name: string;
  tagline: string;
  /** Shown on notice engine pages when ?state=XX */
  localLawCues: { section: string; tip: string }[];
  /** Suggested intake lines to paste into forms */
  intakeHints: string[];
  primaryEngines: string[];
};

export const NOTICE_STATE_PACKS: Record<NoticeStateCode, StatePack> = {
  TX: {
    code: "TX",
    name: "Texas",
    tagline: "Confirm Property Code notice periods and service method before you serve.",
    localLawCues: [
      {
        section: "Rent demand timing",
        tip: "Texas pay-or-quit / eviction timelines are statute-driven — confirm current Property Code days for your notice type (do not guess).",
      },
      {
        section: "Service",
        tip: "Personal delivery, mail, and posting rules differ by notice type and court — verify with local counsel or JP court clerk guidance.",
      },
      {
        section: "City overlays",
        tip: "Some Texas cities add habitability / registration rules. Check city ordinances for the property address.",
      },
      {
        section: "Deposit returns",
        tip: "Texas has statutory deposit accounting windows — confirm the current deadline before mailing itemization.",
      },
    ],
    intakeHints: [
      "State: TX · County: [County] · City: [City]",
      "Property type: single-family / duplex / multifamily",
      "Lease dated: [Date] · Monthly rent: $[X] · Period unpaid: [Start]–[End]",
      "Service planned: [hand / certified mail / posting — confirm allowed]",
    ],
    primaryEngines: [
      "pay-or-quit-notice-drafter",
      "notice-to-vacate-drafter",
      "security-deposit-itemization-letter",
      "lease-violation-cure-notice",
    ],
  },
  FL: {
    code: "FL",
    name: "Florida",
    tagline: "Florida notice forms and day counts are specific — confirm before serving.",
    localLawCues: [
      {
        section: "Three-day vs other notices",
        tip: "Florida distinguishes notice types and day-count rules. Confirm the correct notice for nonpayment vs other breaches.",
      },
      {
        section: "Weekends / holidays",
        tip: "How days are counted can exclude weekends/holidays for some notices — verify current statute practice.",
      },
      {
        section: "County practice",
        tip: "Clerks and local counsel often have preferred forms — use drafts as a starting point only.",
      },
      {
        section: "Deposit / claim",
        tip: "Florida deposit claim timelines are statutory — confirm before withholding or mailing.",
      },
    ],
    intakeHints: [
      "State: FL · County: [County] · City: [City]",
      "Notice type intended: nonpayment / vacate / cure (confirm)",
      "Amount owed: $[X] · Period: [Start]–[End]",
      "Delivery method planned: [confirm allowed for this notice]",
    ],
    primaryEngines: [
      "pay-or-quit-notice-drafter",
      "notice-to-vacate-drafter",
      "lease-violation-cure-notice",
      "security-deposit-itemization-letter",
    ],
  },
  CA: {
    code: "CA",
    name: "California",
    tagline: "Statewide + city/rent-control overlays — counsel review is strongly advised.",
    localLawCues: [
      {
        section: "Statewide + local",
        tip: "California notices interact with statewide tenant protections and local rent ordinances. Confirm both.",
      },
      {
        section: "Just cause / rent control cities",
        tip: "Many CA cities add just-cause and relocation rules. Never assume a statewide template is enough.",
      },
      {
        section: "Notice language",
        tip: "Some CA notices require specific statutory language — have counsel verify wording before service.",
      },
      {
        section: "Deposit itemization",
        tip: "California deposit return and itemization windows are strict — confirm current Civil Code deadlines.",
      },
    ],
    intakeHints: [
      "State: CA · City: [City] · County: [County]",
      "Rent-controlled or just-cause jurisdiction?: [Yes/No/Unknown — confirm]",
      "Lease type: fixed-term / month-to-month · Amount owed: $[X]",
      "Any prior notices served?: [Dates / types]",
    ],
    primaryEngines: [
      "pay-or-quit-notice-drafter",
      "notice-to-vacate-drafter",
      "security-deposit-itemization-letter",
      "tenant-repair-request-letter",
    ],
  },
};

export const NOTICE_STATE_CODES = Object.keys(
  NOTICE_STATE_PACKS,
) as NoticeStateCode[];

export function parseNoticeState(
  value: string | string[] | undefined,
): NoticeStateCode | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  const code = raw.trim().toUpperCase() as NoticeStateCode;
  return code in NOTICE_STATE_PACKS ? code : null;
}
