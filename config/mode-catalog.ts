/**
 * Single source of truth for advertising Modes + engines inside them.
 * Used by /modes page, Mode hubs, ad kit export, and marketing docs.
 */

export type ModeId =
  | "grant"
  | "notice"
  | "tenant"
  | "bid"
  | "offer"
  | "policy"
  | "collect"
  | "lien"
  | "eviction"
  | "creator"
  | "deal";

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
  id: ModeId;
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
    tagline: "Landlord letters — structured from your lease facts",
    audience: "Landlords · PMs · TX/FL/CA packs",
    goPath: "/go/notice",
    hubPath: "/notice-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Not legal advice. Confirm local rules before you serve.",
    modeHook: "Unpaid rent. Blank notice. Deadline tonight.",
    hashtags:
      "#ApexCapital #NoticeMode #Landlord #PropertyManagement #PayOrQuit",
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
    ],
  },
  {
    id: "tenant",
    name: "Tenant Mode",
    tagline: "Repair, deposit, and lease-exit drafts for renters",
    audience: "Tenants · roommates · renter advocates",
    goPath: "/go/tenant",
    hubPath: "/tenant-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Not legal advice. Confirm local tenant protections before you withhold rent or break a lease.",
    modeHook: "Leak still not fixed. Need it in writing — tonight.",
    hashtags:
      "#ApexCapital #TenantMode #TenantRights #Renter #Habitability",
    engines: [
      {
        slug: "tenant-repair-request-letter",
        title: "Tenant Repair Request",
        price: 15,
        hook: "Dated habitability / repair request in writing.",
        audience: "Tenants",
        isPrimary: true,
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
  {
    id: "policy",
    name: "Policy Mode",
    tagline: "PIPs, handbook sections, and people-ops policy drafts",
    audience: "HR · managers · people ops · compliance",
    goPath: "/go/policy",
    hubPath: "/policy-mode",
    priceRange: "$10–$15",
    disclaimer:
      "Drafts only — not employment counsel. Have HR/counsel review before issuing a PIP or publishing policy.",
    modeHook: "Missed deadlines. Need a fair PIP — not a rant in Slack.",
    hashtags: "#ApexCapital #PolicyMode #HR #PIP #PeopleOps #Handbook",
    engines: [
      {
        slug: "performance-improvement-plan-pip-generator",
        title: "Performance Improvement Plan (PIP)",
        price: 15,
        hook: "Clear expectations, timeline, support, and review checkpoints.",
        audience: "HR · managers",
        isPrimary: true,
      },
      {
        slug: "performance-review-write-up-generator",
        title: "Performance Review Write-Up",
        price: 15,
        hook: "Balanced strengths, growth areas, and next steps.",
        audience: "Managers · HR",
      },
      {
        slug: "employee-handbook-section-generator",
        title: "Employee Handbook Section",
        price: 10,
        hook: "One clean policy section ready for handbook review.",
        audience: "HR · compliance",
      },
      {
        slug: "remote-work-policy-generator",
        title: "Remote Work Policy",
        price: 12,
        hook: "Core hours, tools, and expectations for hybrid teams.",
        audience: "People ops",
      },
      {
        slug: "employee-onboarding-checklist-generator",
        title: "Employee Onboarding Checklist",
        price: 10,
        hook: "Day-1 through day-30 checklist so nothing slips.",
        audience: "HR · managers",
      },
      {
        slug: "hr-compliance-checklist-generator",
        title: "HR Compliance Checklist",
        price: 12,
        hook: "Ops checklist scaffold — confirm with counsel for your state.",
        audience: "HR · compliance",
      },
    ],
  },
  {
    id: "collect",
    name: "Collect Mode",
    tagline: "Unpaid invoices → firm demand drafts and collection ops",
    audience: "Freelancers · agencies · SMB finance · ops",
    goPath: "/go/collect",
    hubPath: "/collect-mode",
    priceRange: "$12–$19",
    disclaimer:
      "Drafts only — not legal advice or debt-collection licensing. Have counsel review before sending demand letters.",
    modeHook: "Invoice 60 days late. Two soft emails. Need a real demand.",
    hashtags:
      "#ApexCapital #CollectMode #Invoice #AccountsReceivable #DemandLetter",
    engines: [
      {
        slug: "demand-letter-for-unpaid-invoice-generator",
        title: "Demand Letter for Unpaid Invoice",
        price: 12,
        hook: "Firm, professional demand citing amount, due date, and prior notices.",
        audience: "Freelancers · SMB finance",
        isPrimary: true,
      },
      {
        slug: "cease-and-desist-letter-drafter",
        title: "Cease and Desist Letter",
        price: 19,
        hook: "Careful C&D scaffold — counsel review required before send.",
        audience: "Owners · counsel",
      },
      {
        slug: "invoice-to-payment-reconciliation-automation-designer",
        title: "Invoice → Payment Reconciliation Plan",
        price: 15,
        hook: "Design the ops flow from invoice to cash application.",
        audience: "Finance ops",
      },
    ],
  },
  {
    id: "lien",
    name: "Lien Mode",
    tagline: "Prelim notices, lien outlines, waivers — paper trail for unpaid work",
    audience: "Trades · GCs · suppliers",
    goPath: "/go/lien",
    hubPath: "/lien-mode",
    priceRange: "$15–$24",
    disclaimer:
      "Drafts only — not legal advice. Lien deadlines and forms are state-specific; counsel/recorder review required before serving or recording.",
    modeHook: "Job done. Invoice ignored. Need a prelim notice — tonight.",
    hashtags: "#ApexCapital #LienMode #Contractors #MechanicsLien #Construction",
    engines: [
      {
        slug: "preliminary-notice-drafter",
        title: "Preliminary Notice",
        price: 19,
        hook: "Pre-lien / prelim notice scaffold from job and payment facts.",
        audience: "Trades · suppliers",
        isPrimary: true,
      },
      {
        slug: "mechanics-lien-claim-outline",
        title: "Mechanic's Lien Claim Outline",
        price: 24,
        hook: "Claim outline — not a recordable instrument by itself.",
        audience: "Trades · GCs",
      },
      {
        slug: "lien-waiver-release-drafter",
        title: "Lien Waiver / Release",
        price: 15,
        hook: "Progress or final waiver language from payment facts.",
        audience: "Trades · GCs",
      },
      {
        slug: "intent-to-lien-notice",
        title: "Intent to Lien Notice",
        price: 19,
        hook: "Final-demand style notice before you escalate to counsel.",
        audience: "Trades · suppliers",
      },
    ],
  },
  {
    id: "eviction",
    name: "Eviction Mode",
    tagline: "Possession packs, filing checklists, service logs, hearing briefs",
    audience: "Landlords · PMs · housing ops",
    goPath: "/go/eviction",
    hubPath: "/eviction-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Not legal advice. Eviction procedure is highly local. Confirm notices, forms, and service with counsel before filing.",
    modeHook: "Notice period done. Still no payment. Need the filing pack organized.",
    hashtags: "#ApexCapital #EvictionMode #Landlord #PropertyManagement #Housing",
    engines: [
      {
        slug: "possession-demand-pack-outline",
        title: "Possession Demand Pack Outline",
        price: 24,
        hook: "Organize the possession demand pack from lease + notice facts.",
        audience: "Landlords · PMs",
        isPrimary: true,
      },
      {
        slug: "eviction-filing-checklist",
        title: "Eviction Filing Checklist",
        price: 19,
        hook: "Educational filing checklist — local forms still required.",
        audience: "Landlords · PMs",
      },
      {
        slug: "eviction-service-log",
        title: "Eviction Service Log",
        price: 12,
        hook: "Auditable log of what was served, when, and how.",
        audience: "Landlords · PMs",
      },
      {
        slug: "court-calendar-brief",
        title: "Court Calendar Brief",
        price: 15,
        hook: "One-page hearing brief outline: facts, notices, exhibits.",
        audience: "Landlords · counsel-prep",
      },
    ],
  },
  {
    id: "creator",
    name: "Creator Mode",
    tagline: "Brand deals, usage licenses, invoices, cancellation notices",
    audience: "Creators · agencies · brand marketers",
    goPath: "/go/creator",
    hubPath: "/creator-mode",
    priceRange: "$12–$24",
    disclaimer:
      "Drafts only — not entertainment or IP counsel. Have counsel review before signing or canceling deals.",
    modeHook: "Brand wants a Reel next week. Terms still live in DMs.",
    hashtags: "#ApexCapital #CreatorMode #BrandDeal #Influencer #UGC",
    engines: [
      {
        slug: "brand-deal-terms-drafter",
        title: "Brand Deal Terms",
        price: 24,
        hook: "Deliverables, fee, usage, disclosure — in one draft.",
        audience: "Creators · agencies",
        isPrimary: true,
      },
      {
        slug: "content-usage-license-drafter",
        title: "Content Usage License",
        price: 19,
        hook: "Limited paid-usage grant — platforms, term, fee.",
        audience: "Creators · brands",
      },
      {
        slug: "creator-deliverable-invoice",
        title: "Creator Deliverable Invoice",
        price: 12,
        hook: "Invoice the deliverable with due date and usage note.",
        audience: "Creators",
      },
      {
        slug: "creator-cancellation-notice",
        title: "Creator Cancellation Notice",
        price: 15,
        hook: "Careful kill-fee / cancel notice when a deal dies.",
        audience: "Creators · brands",
      },
    ],
  },
  {
    id: "deal",
    name: "Deal Mode",
    tagline: "LOIs, term sheets, NDAs, closing checklists — first-pass deal ops",
    audience: "Founders · brokers · buyers · partnership ops",
    goPath: "/go/deal",
    hubPath: "/deal-mode",
    priceRange: "$11–$24",
    disclaimer:
      "Drafts only — not transactional or securities counsel. Binding terms need licensed review.",
    modeHook: "Handshake yesterday. LOI still blank this morning.",
    hashtags: "#ApexCapital #DealMode #LOI #TermSheet #MAndA",
    engines: [
      {
        slug: "letter-of-intent-outline",
        title: "Letter of Intent (LOI) Outline",
        price: 24,
        hook: "Non-binding LOI outline with binding-clause cues.",
        audience: "Buyers · founders",
        isPrimary: true,
      },
      {
        slug: "term-sheet-outline",
        title: "Term Sheet Outline",
        price: 24,
        hook: "Economics and conditions — outlined, not closed.",
        audience: "Founders · investors",
      },
      {
        slug: "nda-generator",
        title: "NDA Generator",
        price: 12,
        hook: "Mutual or one-way NDA draft for diligence talks.",
        audience: "Founders · ops",
      },
      {
        slug: "real-estate-closing-checklist-generator",
        title: "Real Estate Closing Checklist",
        price: 11,
        hook: "Closing-day checklist for a financed purchase path.",
        audience: "Buyers · brokers",
      },
      {
        slug: "nonprofit-partnership-mou-outline-generator",
        title: "Nonprofit Partnership MOU Outline",
        price: 16,
        hook: "Shared-goals MOU outline for program partners.",
        audience: "Nonprofits",
      },
      {
        slug: "channel-partner-agreement-outline-generator",
        title: "Channel Partner Agreement Outline",
        price: 22,
        hook: "Reseller / channel economics outlined before counsel.",
        audience: "Sales ops · founders",
      },
    ],
  },
];

export function getModeAdPack(id: ModeId): ModeAdPack | undefined {
  return MODE_AD_CATALOG.find((m) => m.id === id);
}

export function modePrimarySlug(id: ModeId): string | undefined {
  const pack = getModeAdPack(id);
  return pack?.engines.find((e) => e.isPrimary)?.slug ?? pack?.engines[0]?.slug;
}

export function allModeGoPaths(): string[] {
  return MODE_AD_CATALOG.map((m) => m.goPath);
}

export function allModeHubPaths(): string[] {
  return MODE_AD_CATALOG.map((m) => m.hubPath);
}

export function engineLanding(slug: string, modeId: string): string {
  return `https://apexcapitaladmin.com/engine/${slug}?sample=1&focus=intake&utm_source=instagram&utm_medium=reel&utm_campaign=apex_${modeId}_engine&utm_content=${slug}`;
}

export function modeLanding(goPath: string, modeId: string): string {
  return `https://apexcapitaladmin.com${goPath}?utm_source=instagram&utm_medium=reel&utm_campaign=apex_${modeId}_mode&utm_content=mode-overview`;
}
