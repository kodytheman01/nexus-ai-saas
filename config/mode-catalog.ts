/**
 * Single source of truth for advertising Modes + engines inside them.
 * Used by /modes page, ad kit export, and marketing docs.
 */

export type ModeEngineAd = {
  slug: string;
  title: string;
  price: number;
  hook: string;
  audience: string;
  /** Primary money path for this Mode */
  isPrimary?: boolean;
};

export type ModeAdPack = {
  id: "grant" | "notice" | "bid" | "offer";
  name: string;
  tagline: string;
  audience: string;
  goPath: string;
  hubPath: string;
  priceRange: string;
  disclaimer: string;
  modeHook: string;
  hashtags: string;
  engines: ModeEngineAd[];
};

export const MODE_AD_CATALOG: ModeAdPack[] = [
  {
    id: "grant",
    name: "Grant Mode",
    tagline: "Blank FOA → funder-style first-pass draft",
    audience: "Grant writers · nonprofits · municipal partners",
    goPath: "/go/grant",
    hubPath: "/grant-mode",
    priceRange: "$19–$24",
    disclaimer:
      "Drafts only — not a funding guarantee. Verify against the live FOA before submit.",
    modeHook: "FOA due Friday. Need statement still empty.",
    hashtags: "#ApexCapital #GrantMode #Nonprofit #GrantWriting #FOA",
    engines: [
      {
        slug: "grant-proposal-narrative-generator",
        title: "Grant Proposal Narrative",
        price: 24,
        hook: "Turn program facts into a funder-style narrative in minutes.",
        audience: "Grant writers on a deadline",
        isPrimary: true,
      },
      {
        slug: "grant-proposal-outline-generator",
        title: "Grant Proposal Outline",
        price: 19,
        hook: "Section-by-section FOA outline before you write a paragraph.",
        audience: "First-time applicants",
      },
      {
        slug: "nonprofit-budget-allocation-calculator",
        title: "Nonprofit Budget Allocation",
        price: 19,
        hook: "Program vs admin dollars — transparent budget narrative language.",
        audience: "Nonprofit finance + program leads",
      },
      {
        slug: "grant-compliance-reporting-checklist",
        title: "Grant Compliance Checklist",
        price: 19,
        hook: "Stay audit-ready with a reporting checklist from your award terms.",
        audience: "Post-award ops",
      },
    ],
  },
  {
    id: "notice",
    name: "Notice Mode",
    tagline: "Landlord & tenant letters — structured from your lease facts",
    audience: "Landlords · PMs · tenants · TX/FL/CA packs",
    goPath: "/go/notice",
    hubPath: "/notice-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Not legal advice. Confirm local rules before you serve or withhold rent.",
    modeHook: "Unpaid rent. Blank notice. Deadline tonight.",
    hashtags:
      "#ApexCapital #NoticeMode #Landlord #PropertyManagement #TenantRights",
    engines: [
      {
        slug: "pay-or-quit-notice-drafter",
        title: "Pay or Quit / Rent Demand",
        price: 24,
        hook: "Late rent → structured pay-or-quit draft from lease facts.",
        audience: "Landlords · PMs",
        isPrimary: true,
      },
      {
        slug: "notice-to-vacate-drafter",
        title: "Notice to Vacate / Non-Renewal",
        price: 19,
        hook: "Clear vacate / non-renewal draft from your dates.",
        audience: "Landlords · PMs",
      },
      {
        slug: "lease-renewal-offer-letter",
        title: "Lease Renewal Offer",
        price: 19,
        hook: "Term, rent, and deadline in one renewal letter draft.",
        audience: "Landlords · PMs",
      },
      {
        slug: "rent-increase-notice-drafter",
        title: "Rent Increase Notice",
        price: 19,
        hook: "Structured rent-increase notice draft — confirm local caps.",
        audience: "Landlords · PMs",
      },
      {
        slug: "lease-violation-cure-notice",
        title: "Lease Violation / Cure Notice",
        price: 19,
        hook: "Document the violation and cure window in writing.",
        audience: "Landlords · PMs",
      },
      {
        slug: "entry-notice-drafter",
        title: "Entry / Inspection Notice",
        price: 12,
        hook: "Date, window, and purpose — entry notice draft.",
        audience: "Landlords · PMs",
      },
      {
        slug: "security-deposit-itemization-letter",
        title: "Security Deposit Itemization",
        price: 19,
        hook: "Itemize deductions and return timing clearly.",
        audience: "Landlords · PMs",
      },
      {
        slug: "landlord-welcome-packet-outline",
        title: "New Tenant Welcome Packet",
        price: 15,
        hook: "Outline a welcome packet so move-in isn’t chaos.",
        audience: "Landlords · PMs",
      },
      {
        slug: "maintenance-work-order-brief",
        title: "Maintenance Work-Order Brief",
        price: 12,
        hook: "Turn a repair call into a clean work-order brief.",
        audience: "Landlords · PMs",
      },
      {
        slug: "tenant-repair-request-letter",
        title: "Tenant Repair Request",
        price: 15,
        hook: "Dated habitability / repair request in writing.",
        audience: "Tenants",
      },
      {
        slug: "tenant-rent-withholding-notice",
        title: "Rent Withholding / Escrow Notice",
        price: 24,
        hook: "Caution draft only — strong local-law confirmation required.",
        audience: "Tenants",
      },
      {
        slug: "lease-break-request-letter",
        title: "Lease Break Request",
        price: 19,
        hook: "Early termination request with reasons and dates.",
        audience: "Tenants",
      },
      {
        slug: "tenant-move-out-checklist",
        title: "Tenant Move-Out Checklist",
        price: 12,
        hook: "Checklist to protect deposit return odds.",
        audience: "Tenants",
      },
      {
        slug: "roommate-agreement-outline",
        title: "Roommate Agreement Outline",
        price: 15,
        hook: "Rent split, chores, guests, move-out rules — outlined.",
        audience: "Roommates · tenants",
      },
    ],
  },
  {
    id: "bid",
    name: "Bid Mode",
    tagline: "Job notes → proposal, change order, or scope draft",
    audience: "GCs · trades · estimators · field ops",
    goPath: "/go/bid",
    hubPath: "/bid-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Drafts only — not a licensed estimate. Confirm scope, price, and terms before sending.",
    modeHook: "Customer wants the bid tomorrow. Scope is still in Notes.",
    hashtags: "#ApexCapital #BidMode #Contractor #Construction #Proposal",
    engines: [
      {
        slug: "contractor-proposal-drafter",
        title: "Contractor Proposal / Bid Letter",
        price: 24,
        hook: "Turn job notes into a clean proposal draft in minutes.",
        audience: "GCs · trades",
        isPrimary: true,
      },
      {
        slug: "change-order-drafter",
        title: "Change Order",
        price: 19,
        hook: "Scope change, cost delta, schedule impact — in writing.",
        audience: "GCs · trades",
      },
      {
        slug: "scope-of-work-outline",
        title: "Scope of Work Outline",
        price: 15,
        hook: "Inclusions, exclusions, assumptions before you price.",
        audience: "Estimators · PMs",
      },
      {
        slug: "subcontractor-bid-request",
        title: "Subcontractor Bid Request",
        price: 15,
        hook: "Ask subs for bids with clear scope and due date.",
        audience: "GCs",
      },
      {
        slug: "job-completion-punch-list",
        title: "Job Completion / Punch List",
        price: 12,
        hook: "Close the job: remaining items + final payment cues.",
        audience: "GCs · trades",
      },
      {
        slug: "materials-allowance-memo",
        title: "Materials Allowance Memo",
        price: 12,
        hook: "Allowances, overages, selection deadlines — clarified.",
        audience: "GCs · owners",
      },
    ],
  },
  {
    id: "offer",
    name: "Offer Mode",
    tagline: "Hire, promote, or close candidates with clear letter drafts",
    audience: "HR · founders · people ops",
    goPath: "/go/offer",
    hubPath: "/offer-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Drafts only — not employment counsel. Have HR/counsel review before sending.",
    modeHook: "You hired them. The offer letter is still a Google Doc ghost.",
    hashtags: "#ApexCapital #OfferMode #HR #Hiring #PeopleOps",
    engines: [
      {
        slug: "job-offer-letter-drafter",
        title: "Job Offer Letter",
        price: 24,
        hook: "Role, pay, start date — professional offer draft fast.",
        audience: "HR · founders",
        isPrimary: true,
      },
      {
        slug: "offer-rejection-letter",
        title: "Candidate Rejection Letter",
        price: 12,
        hook: "Respectful close after interviews — no invented feedback.",
        audience: "HR · recruiters",
      },
      {
        slug: "internal-promotion-letter",
        title: "Internal Promotion Letter",
        price: 19,
        hook: "New title, effective date, compensation — confirmed in writing.",
        audience: "HR · managers",
      },
      {
        slug: "internship-offer-letter",
        title: "Internship Offer Letter",
        price: 15,
        hook: "Dates, hours, pay — internship offer draft.",
        audience: "HR · program leads",
      },
      {
        slug: "offer-rescind-notice",
        title: "Offer Rescind Notice",
        price: 19,
        hook: "Careful withdrawal draft — counsel review strongly advised.",
        audience: "HR · counsel",
      },
    ],
  },
];

export function getModeAdPack(id: ModeAdPack["id"]): ModeAdPack | undefined {
  return MODE_AD_CATALOG.find((m) => m.id === id);
}

export function engineLanding(slug: string, modeId: string): string {
  return `https://apexcapitaladmin.com/engine/${slug}?sample=1&focus=intake&utm_source=instagram&utm_medium=reel&utm_campaign=apex_${modeId}_engine&utm_content=${slug}`;
}

export function modeLanding(goPath: string, modeId: string): string {
  return `https://apexcapitaladmin.com${goPath}?utm_source=instagram&utm_medium=reel&utm_campaign=apex_${modeId}_mode&utm_content=mode-overview`;
}
