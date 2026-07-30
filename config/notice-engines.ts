import type { EngineSeed } from "./engines";

const LEGAL_GUARD =
  "CRITICAL: You produce DRAFT documents only — not legal advice. Laws vary by state and city. Always include a short banner: 'Draft only — not legal advice. Confirm statutory wording, notice periods, and service method with local counsel before serving or filing.' Never invent case citations or claim a notice is court-ready. Prefer clear blanks like [Tenant Name] over hallucinated facts.";

/** Notice Mode + Tenant Mode — seeded alongside the main Apex catalog. */
export const NOTICE_ENGINES_SEED: EngineSeed[] = [
  {
    slug: "pay-or-quit-notice-drafter",
    title: "Pay or Quit / Rent Demand Notice",
    description:
      "Draft a pay-or-quit or rent-demand notice from lease facts, amount owed, and property details.",
    priceInUSD: 24,
    inputLabel:
      "Lease facts: tenant name(s), property address, rent owed, period unpaid, payment instructions, owner/agent contact:",
    inputPlaceholder:
      "e.g., Tenant: Jordan Lee · 412 Oak St #2, Dallas TX · $1,850 unpaid for June · pay via Zelle to owner@… · Agent: Sam Rivera 214-555-0100",
    aiSystemPrompt: `${LEGAL_GUARD} You draft landlord rent-demand / pay-or-quit style notices in clean markdown. Structure: header, parties, property, amount/period, demand (pay or quit), payment instructions, contact, service notes reminder, disclaimer. Do not invent statutory day counts — write CONFIRM LOCAL DEADLINE.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "notice-to-vacate-drafter",
    title: "Notice to Vacate / Non-Renewal",
    description:
      "Generate a notice to vacate or non-renewal draft with move-out date and key-return cues.",
    priceInUSD: 19,
    inputLabel:
      "Tenancy type, address, termination date, reason category (non-renewal / end of term), key return instructions:",
    inputPlaceholder:
      "e.g., Month-to-month · 88 Pine Ave · vacate by Aug 31 5pm · non-renewal · return keys to office",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a notice to vacate / non-renewal letter. Include effective date, vacate time, forwarding address request, deposit accounting cue, and CONFIRM LOCAL NOTICE PERIOD.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "lease-renewal-offer-letter",
    title: "Lease Renewal Offer Letter",
    description:
      "Offer a renewal term, new rent, and response deadline in one professional letter draft.",
    priceInUSD: 19,
    inputLabel:
      "Current lease end, proposed term, new rent, amenities changes, response deadline:",
    inputPlaceholder:
      "e.g., Ends Sep 30 · offer 12 months · $1,950/mo (was $1,850) · respond by Aug 15",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a lease renewal offer letter: greeting, property, new term/rent, any changes, acceptance deadline, contact. Neutral professional tone.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "entry-notice-drafter",
    title: "Entry / Inspection Notice",
    description:
      "Draft an entry or inspection notice with date, time window, and purpose.",
    priceInUSD: 12,
    inputLabel: "Address, entry date, time window, purpose, contact phone:",
    inputPlaceholder:
      "e.g., 12 Elm · Aug 8 · 10am–12pm · HVAC inspection · 214-555-0199",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a polite entry/inspection notice. Include date, window, purpose, contact, and reminder to confirm local advance-notice rules.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "security-deposit-itemization-letter",
    title: "Security Deposit Itemization Letter",
    description:
      "Itemize deposit deductions and return balance timing in an accounting letter draft.",
    priceInUSD: 19,
    inputLabel:
      "Original deposit, move-out date, line-item deductions with amounts, forwarding address if known:",
    inputPlaceholder:
      "e.g., Deposit $1,800 · moved out Jul 1 · carpet $220 · wall repair $150 · cleaning $95 · balance to mail",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a deposit itemization letter with original deposit, deductions table, balance, and CONFIRM STATUTORY RETURN DEADLINE. Fair, itemized language.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "lease-violation-cure-notice",
    title: "Lease Violation / Cure Notice",
    description:
      "Draft a lease-violation notice describing the issue and requested cure.",
    priceInUSD: 19,
    inputLabel:
      "Violation description, lease clause if known, cure requested, cure deadline cue:",
    inputPlaceholder:
      "e.g., Unauthorized pet · clause 12 · remove pet or add pet addendum · cure within local period",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a lease violation / cure notice. State facts, requested cure, and CONFIRM LOCAL CURE PERIOD. Avoid threatening illegal fees.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "tenant-repair-request-letter",
    title: "Tenant Repair / Habitability Request",
    description:
      "Document a dated written repair or habitability request for your paper trail.",
    priceInUSD: 15,
    inputLabel:
      "Issue description, when first reported, address, preferred fix window, your contact:",
    inputPlaceholder:
      "e.g., Bathroom ceiling leak since Jun 12 · Unit 4B · please schedule within 7 days · cell …",
    aiSystemPrompt: `${LEGAL_GUARD} You draft TENANT-side repair request letters. Firm, factual, dated. Include history of prior reports if given. No advice to withhold rent unless user asks — and even then add strong legal warning.`,
    outputFormat: "markdown",
    category: "tenant-letter",
  },
  {
    slug: "tenant-rent-withholding-notice",
    title: "Tenant Rent Withholding / Escrow Notice (Caution Draft)",
    description:
      "Cautious scaffold for habitability-related notices — with hard legal warnings. Not advice.",
    priceInUSD: 24,
    inputLabel:
      "Habitability issue, prior repair requests, dates, what you are proposing (cure / escrow / other — confirm legality locally):",
    inputPlaceholder:
      "e.g., No heat 3 weeks · emailed landlord Jul 1 and Jul 10 · seeking written cure plan",
    aiSystemPrompt: `${LEGAL_GUARD} EXTRA WARNING: Rent withholding/escrow is illegal or heavily restricted in many jurisdictions. Always open with a large WARNING block telling the user to contact legal aid or an attorney before acting. Produce a cautious notice scaffold only — never encourage illegal withholding.`,
    outputFormat: "markdown",
    category: "tenant-letter",
  },
  {
    slug: "roommate-agreement-outline",
    title: "Roommate Agreement Outline",
    description:
      "Outline rent split, utilities, chores, guests, quiet hours, and exit rules.",
    priceInUSD: 15,
    inputLabel:
      "Number of roommates, rent total/shares, utilities, house rules priorities:",
    inputPlaceholder:
      "e.g., 3 roommates · $2,400 rent · equal share · rotating chores · no overnight guests >3 nights",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a roommate agreement OUTLINE in markdown sections (rent, utilities, deposits, chores, guests, quiet hours, damage, exit notice). Not a substitute for the primary lease.`,
    outputFormat: "markdown",
    category: "tenant-letter",
  },
  {
    slug: "tenant-move-out-checklist",
    title: "Tenant Move-Out Checklist",
    description:
      "Generate a move-out punch list to improve deposit-return odds.",
    priceInUSD: 12,
    inputLabel:
      "Unit type, known issues, move-out date, whether photos/video planned:",
    inputPlaceholder:
      "e.g., 1BR apartment · small nail holes · move Aug 31 · will photo every room",
    aiSystemPrompt: `${LEGAL_GUARD} Produce a practical tenant move-out checklist: clean, patch, appliances, photos, keys, utilities, forwarding address, walkthrough tips.`,
    outputFormat: "markdown",
    category: "tenant-letter",
  },
  {
    slug: "lease-break-request-letter",
    title: "Lease Break / Early Termination Request",
    description:
      "Draft an early-termination request with reason, dates, and negotiation cues.",
    priceInUSD: 19,
    inputLabel:
      "Lease end date, requested exit date, reason, any military/job relocation facts, proposed solution:",
    inputPlaceholder:
      "e.g., Lease to Dec · need Sep 15 exit · job relocation to Austin · offer 1 month buyout discussion",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a tenant lease-break request letter: polite, factual, propose options (buyout, replacement tenant) without claiming legal entitlement unless user states a known clause (e.g., military).`,
    outputFormat: "markdown",
    category: "tenant-letter",
  },
  {
    slug: "landlord-welcome-packet-outline",
    title: "New Tenant Welcome Packet Outline",
    description:
      "Outline a welcome packet: contacts, payment, maintenance, rules, emergency.",
    priceInUSD: 15,
    inputLabel: "Property type, payment method, emergency contacts, key rules:",
    inputPlaceholder:
      "e.g., Duplex · rent via portal · emergency plumber list · quiet hours 10pm",
    aiSystemPrompt: `${LEGAL_GUARD} Outline a landlord welcome packet sections for new tenants. Operational, friendly, clear.`,
    outputFormat: "markdown",
    category: "landlord-ops",
  },
  {
    slug: "rent-increase-notice-drafter",
    title: "Rent Increase Notice Draft",
    description:
      "Draft a rent-increase notice with effective date and new amount — confirm local caps.",
    priceInUSD: 19,
    inputLabel:
      "Current rent, new rent, effective date, tenancy type, any local rent-control unknowns:",
    inputPlaceholder:
      "e.g., $1,700 → $1,800 effective Oct 1 · month-to-month · not sure about local caps",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a rent increase notice. Emphasize CONFIRM LOCAL NOTICE PERIOD AND ANY RENT CAPS / CONTROL. Neutral tone.`,
    outputFormat: "markdown",
    category: "landlord-notice",
  },
  {
    slug: "maintenance-work-order-brief",
    title: "Maintenance Work-Order Brief",
    description:
      "Turn a tenant complaint into a clear work-order brief for vendors.",
    priceInUSD: 12,
    inputLabel: "Issue, unit, urgency, access notes, preferred vendor type:",
    inputPlaceholder:
      "e.g., AC not cooling · Unit 2 · high urgency · lockbox code … · HVAC tech",
    aiSystemPrompt: `${LEGAL_GUARD} Produce a maintenance work-order brief: symptom, location, urgency, access, safety notes, vendor checklist. Not a licensed engineering assessment.`,
    outputFormat: "markdown",
    category: "landlord-ops",
  },
];
