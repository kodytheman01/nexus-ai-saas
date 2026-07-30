/** FOA / NOFO coverage checklist — grant specialist trust signal. */
export const FOA_COVERAGE_CHECKLIST: { section: string; tip: string }[] = [
  { section: "Cover / Abstract", tip: "Problem, population, ask amount, period of performance" },
  { section: "Statement of Need", tip: "Local data + disparity vs. state/national" },
  { section: "Goals & Objectives", tip: "SMART; link each goal to activities" },
  { section: "Project Design / Work Plan", tip: "Milestones by year; who does what" },
  { section: "Organizational Capacity", tip: "Staff roles, prior awards, fiscal controls" },
  { section: "Partnerships", tip: "MOUs / letters — roles clearly stated" },
  { section: "Evaluation", tip: "Indicators, data sources, reporting cadence" },
  { section: "Budget Narrative", tip: "Line items aligned to activities (use budget engine)" },
  { section: "Sustainability", tip: "Continuation after award period" },
  { section: "Appendices", tip: "Resumes, LOIs, org chart, rate docs" },
];

export const GRANT_PAIRINGS: Record<
  string,
  { label: string; slug: string; why: string }[]
> = {
  "grant-proposal-narrative-generator": [
    {
      label: "Grant Proposal Outline",
      slug: "grant-proposal-outline-generator",
      why: "Map FOA sections before drafting prose",
    },
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Pair narrative with budget narrative language",
    },
  ],
  "grant-proposal-outline-generator": [
    {
      label: "Grant Proposal Narrative",
      slug: "grant-proposal-narrative-generator",
      why: "Fill sections after the outline is locked",
    },
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Budget narrative next to the outline",
    },
  ],
  "nonprofit-budget-allocation-calculator": [
    {
      label: "Grant Proposal Narrative",
      slug: "grant-proposal-narrative-generator",
      why: "Align story to the allocation",
    },
    {
      label: "Grant Compliance Checklist",
      slug: "grant-compliance-reporting-checklist",
      why: "Stay audit-ready after award",
    },
  ],
  "grant-compliance-reporting-checklist": [
    {
      label: "Nonprofit Budget Allocation",
      slug: "nonprofit-budget-allocation-calculator",
      why: "Keep spend narrative consistent with reports",
    },
  ],
};

export const ENTITY = {
  legalName: "Apex Capital Admin Services",
  region: "Texas, USA",
  email: "admin@apexcapitaladmin.com",
  phone: "(214) 506-3083",
  phoneHref: "tel:+12145063083",
  supportHours: "Mon–Fri, 9am–5pm Central",
  humanReviewSla: "Within 1 business day of generation",
  retention:
    "Order records (email, engine, deliverable reference) are kept as needed for support, accounting, and legal obligations. Intake text is retained only as long as needed to generate, deliver, and support your order, then may be deleted or anonymized.",
};

/** Housing / landlord-tenant — required on Notice Mode surfaces. */
export const HOUSING_LEGAL_DISCLAIMER =
  "Drafts only — not legal advice and not a substitute for an attorney. Landlord-tenant laws vary by state and city. Confirm notices, timelines, and required language with local counsel or a licensed housing professional before you serve or file anything.";

/** Alias used by Notice Mode pages. */
export const LEGAL_DISCLAIMER = HOUSING_LEGAL_DISCLAIMER;

export const NOTICE_PRE_SERVE_CHECKLIST: { section: string; tip: string }[] = [
  {
    section: "Notice period",
    tip: "Confirm statutory / local days for pay-or-quit, vacate, or cure",
  },
  {
    section: "Required wording",
    tip: "Match any mandatory state or city language before serving",
  },
  {
    section: "Service method",
    tip: "Personal delivery, certified mail, posting — follow local rules",
  },
  {
    section: "Counsel check",
    tip: "Have an attorney or housing professional review when stakes are high",
  },
];

export type EnginePairing = { label: string; slug: string; why: string };

export const NOTICE_PAIRINGS: Record<string, EnginePairing[]> = {
  "pay-or-quit-notice-drafter": [
    {
      label: "Security Deposit Itemization",
      slug: "security-deposit-itemization-letter",
      why: "If tenancy ends, itemize deposit next",
    },
    {
      label: "Lease Violation / Cure",
      slug: "lease-violation-cure-notice",
      why: "Non-rent breaches need a different draft",
    },
  ],
  "notice-to-vacate-drafter": [
    {
      label: "Security Deposit Itemization",
      slug: "security-deposit-itemization-letter",
      why: "Pair vacate with deposit accounting",
    },
    {
      label: "Pay or Quit Notice",
      slug: "pay-or-quit-notice-drafter",
      why: "Unpaid rent path if that is the issue",
    },
  ],
  "security-deposit-itemization-letter": [
    {
      label: "Notice to Vacate",
      slug: "notice-to-vacate-drafter",
      why: "Close the tenancy paperwork loop",
    },
  ],
};

export const BID_PAIRINGS: Record<string, EnginePairing[]> = {
  "contractor-proposal-drafter": [
    {
      label: "Change Order",
      slug: "change-order-drafter",
      why: "Scope shifts after the bid is signed",
    },
    {
      label: "Scope of Work Outline",
      slug: "scope-of-work-outline",
      why: "Tighten inclusions before pricing",
    },
  ],
  "change-order-drafter": [
    {
      label: "Contractor Proposal",
      slug: "contractor-proposal-drafter",
      why: "Refresh the base proposal if needed",
    },
    {
      label: "Punch List Letter",
      slug: "job-completion-punch-list",
      why: "Close remaining items at the end",
    },
  ],
};

export const OFFER_PAIRINGS: Record<string, EnginePairing[]> = {
  "job-offer-letter-drafter": [
    {
      label: "Candidate Rejection",
      slug: "offer-rejection-letter",
      why: "Close other candidates cleanly",
    },
    {
      label: "Internship Offer",
      slug: "internship-offer-letter",
      why: "Different track for interns",
    },
  ],
  "offer-rejection-letter": [
    {
      label: "Job Offer Letter",
      slug: "job-offer-letter-drafter",
      why: "Send the chosen candidate next",
    },
  ],
};

/** Success-page upsells — related engines + human-review nudge. */
export function getSuccessUpsells(engineSlug: string): EnginePairing[] {
  return (
    GRANT_PAIRINGS[engineSlug] ??
    NOTICE_PAIRINGS[engineSlug] ??
    BID_PAIRINGS[engineSlug] ??
    OFFER_PAIRINGS[engineSlug] ??
    []
  );
}
