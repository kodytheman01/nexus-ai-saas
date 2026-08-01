import type { EngineSeed } from "./engines";

const LEGAL_GUARD =
  "CRITICAL: You produce DRAFT documents only — not legal advice and not a licensed filing. Never invent statutes, deadlines, or recorded-instrument language as fact. Prefer blanks like [Date] / [Amount] / [County]. Include a short banner: 'Draft only — confirm with licensed counsel before serving, recording, or filing.'";

const CREATOR_GUARD =
  "CRITICAL: You produce DRAFT commercial terms only — not entertainment counsel. Never invent exclusivity, union, or IP ownership rules as binding law. Prefer blanks. Banner: 'Draft only — have counsel review before signing.'";

const DEAL_GUARD =
  "CRITICAL: You produce DRAFT deal outlines only — not transactional counsel. Never invent closing conditions, securities terms, or regulatory filings as advice. Prefer blanks. Banner: 'Draft only — counsel review required before reliance.'";

/** Wave-2 Modes: Lien, Eviction, Creator, Deal — new Mode engines. */
export const EXPANSION_ENGINES_SEED: EngineSeed[] = [
  // —— Lien Mode ——
  {
    slug: "preliminary-notice-drafter",
    title: "Preliminary Notice Drafter",
    description:
      "Draft a preliminary / pre-lien notice scaffold from job, owner, and payment facts.",
    priceInUSD: 19,
    inputLabel:
      "Project address, owner/GC names, your trade/company, labor/materials description, contract amount or unpaid amount, first work date, notice recipient:",
    inputPlaceholder:
      "e.g., 412 Oak · Owner Jordan Lee · GC Apex Build · electrical rough-in · $8,400 unpaid · first work 2026-03-01 · send to owner + lender if known",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a preliminary / pre-lien notice outline in markdown: parties, property, work description, amounts, dates, delivery method blanks, and a hard note that state deadlines vary. Do not claim this perfects lien rights.`,
    outputFormat: "markdown",
    category: "lien-notice",
  },
  {
    slug: "mechanics-lien-claim-outline",
    title: "Mechanic's Lien Claim Outline",
    description:
      "Outline a mechanic's lien claim structure from unpaid labor/materials facts.",
    priceInUSD: 24,
    inputLabel:
      "Claimant, property, owner, GC (if any), unpaid amount, work dates, county/recording cues you know, prior notice dates:",
    inputPlaceholder:
      "e.g., Apex Electric LLC · 88 Pine · Owner Sam · GC Northstar · $12,200 · work Jan–Mar · prior prelim notice mailed Feb 10",
    aiSystemPrompt: `${LEGAL_GUARD} Produce a mechanic's lien claim OUTLINE (not a recordable instrument): claimant, property legal description blank, amount claimed, work period, owner/GC, verification/signature blanks, recording checklist cues. Emphasize counsel + county recorder requirements.`,
    outputFormat: "markdown",
    category: "lien-notice",
  },
  {
    slug: "lien-waiver-release-drafter",
    title: "Lien Waiver / Release Drafter",
    description:
      "Draft progress or final lien waiver / release language from payment facts.",
    priceInUSD: 15,
    inputLabel:
      "Waiver type (progress/final), payee, payer, job address, payment amount, through-date, conditional vs unconditional if known:",
    inputPlaceholder:
      "e.g., Progress waiver · Apex Electric · paid by GC Northstar · 88 Pine · $4,000 · through 2026-03-15 · conditional on clearance",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a lien waiver/release scaffold: parties, job, amount, through-date, conditional/unconditional blank, signature block. Warn that waiver forms are state-sensitive.`,
    outputFormat: "markdown",
    category: "lien-notice",
  },
  {
    slug: "intent-to-lien-notice",
    title: "Intent to Lien Notice",
    description:
      "Draft a notice of intent to lien / final demand before recording.",
    priceInUSD: 19,
    inputLabel:
      "Your company, property, owner/GC, unpaid amount, invoice refs, cure deadline you want to propose, prior notices:",
    inputPlaceholder:
      "e.g., Apex Electric · 412 Oak · Owner Jordan · $6,800 Inv #1042 · propose 10-day cure · prelim already sent",
    aiSystemPrompt: `${LEGAL_GUARD} Draft an intent-to-lien / final-demand notice: amount, invoices, cure window blank, consequence language carefully worded as draft only, delivery blanks.`,
    outputFormat: "markdown",
    category: "lien-notice",
  },

  // —— Eviction Mode ——
  {
    slug: "possession-demand-pack-outline",
    title: "Possession Demand Pack Outline",
    description:
      "Outline a possession / holdover demand pack from lease and default facts.",
    priceInUSD: 24,
    inputLabel:
      "Property, landlord, tenant, lease dates, default type (nonpay/holdover/other), amounts/dates, prior notices served:",
    inputPlaceholder:
      "e.g., 12 Elm #2 · LL Apex Housing · Tenant Rivera · nonpay $2,100 + late · pay-or-quit served 7 days ago",
    aiSystemPrompt: `${LEGAL_GUARD} Outline a possession demand pack: summary of tenancy, default, prior notices, demand for possession, exhibits checklist. Not a court form. State rules vary (TX/FL/CA cues as questions, not assertions).`,
    outputFormat: "markdown",
    category: "eviction-ops",
  },
  {
    slug: "eviction-filing-checklist",
    title: "Eviction Filing Checklist",
    description:
      "Educational checklist of common eviction filing steps and document gaps.",
    priceInUSD: 19,
    inputLabel:
      "State/county if known, tenancy type, notice history, amounts, whether counsel is involved:",
    inputPlaceholder:
      "e.g., Texas · Harris County · residential · pay-or-quit + 3-day · $1,850 rent · no attorney yet",
    aiSystemPrompt: `${LEGAL_GUARD} Produce an educational eviction filing checklist: notices, documents, court/clerk questions, service, hearing prep. Never invent filing fees or form numbers as fact. Urge local counsel.`,
    outputFormat: "markdown",
    category: "eviction-ops",
  },
  {
    slug: "eviction-service-log",
    title: "Eviction Service Log",
    description:
      "Build a service / delivery log so notice timing stays auditable.",
    priceInUSD: 12,
    inputLabel:
      "Documents served, method (post/mail/hand), dates/times, server name, recipient, photos/witness notes:",
    inputPlaceholder:
      "e.g., Pay-or-quit posted on door 2026-04-01 10:12am · mailed same day · photos on phone · server Sam",
    aiSystemPrompt: `${LEGAL_GUARD} Produce a clean service log table/outline: document, method, date/time, server, recipient, evidence. Emphasize accuracy; do not invent service rules.`,
    outputFormat: "markdown",
    category: "eviction-ops",
  },
  {
    slug: "court-calendar-brief",
    title: "Court Calendar Brief",
    description:
      "One-page hearing brief outline: facts, notices, ask, exhibits.",
    priceInUSD: 15,
    inputLabel:
      "Hearing date/court if known, parties, claim summary, notice timeline, amounts, exhibits list:",
    inputPlaceholder:
      "e.g., JP hearing Tue 9am · Apex Housing v Rivera · nonpay · notices: pay-or-quit Apr 1 · rent $1,850 · lease + ledger exhibits",
    aiSystemPrompt: `${LEGAL_GUARD} Draft a one-page court calendar brief outline: caption blanks, facts, notice timeline, relief requested, exhibit list, questions for counsel. Not a pleading.`,
    outputFormat: "markdown",
    category: "eviction-ops",
  },

  // —— Creator Mode ——
  {
    slug: "brand-deal-terms-drafter",
    title: "Brand Deal Terms Drafter",
    description:
      "Draft brand-deal / sponsored content terms from deliverables and fee facts.",
    priceInUSD: 24,
    inputLabel:
      "Brand, creator handle, deliverables (# posts/stories/reels), fee, usage window, exclusivity asks, timeline, FTC disclosure notes:",
    inputPlaceholder:
      "e.g., Brand GlowCo · @creator · 1 Reel + 3 Stories · $2,500 · 90-day paid usage · no category exclusivity · due Apr 15 · disclose #ad",
    aiSystemPrompt: `${CREATOR_GUARD} Draft brand-deal terms in markdown: parties, deliverables, fee/payment, timeline, usage rights, exclusivity blanks, FTC disclosure, cancellation, signatures.`,
    outputFormat: "markdown",
    category: "creator-ops",
  },
  {
    slug: "content-usage-license-drafter",
    title: "Content Usage License Drafter",
    description:
      "Draft a limited content usage / license grant for paid creative.",
    priceInUSD: 19,
    inputLabel:
      "Licensor, licensee, content description, platforms, territory, duration, exclusivity, fee, moral rights / credit:",
    inputPlaceholder:
      "e.g., Creator licenses Reel to GlowCo · IG/TikTok/ads · US · 6 months · non-exclusive · $1,000 · credit @handle",
    aiSystemPrompt: `${CREATOR_GUARD} Draft a limited usage license: grant scope, platforms, term, fee, restrictions, credit, takedown, signatures. Prefer limited grants over overbroad ownership claims.`,
    outputFormat: "markdown",
    category: "creator-ops",
  },
  {
    slug: "creator-deliverable-invoice",
    title: "Creator Deliverable Invoice",
    description:
      "Invoice draft for creator deliverables with usage and due-date cues.",
    priceInUSD: 12,
    inputLabel:
      "Creator legal/payee name, brand, deliverables completed, amount, due date, payment method, PO/campaign ref:",
    inputPlaceholder:
      "e.g., Rivera Media LLC · GlowCo Spring · 1 Reel delivered · $2,500 · Net 15 · ACH · Campaign SPR26",
    aiSystemPrompt: `${CREATOR_GUARD} Draft a professional invoice: bill-to, line items, usage note, due date, payment instructions blanks, late-fee blank (optional).`,
    outputFormat: "markdown",
    category: "creator-ops",
  },
  {
    slug: "creator-cancellation-notice",
    title: "Creator Cancellation Notice",
    description:
      "Draft a careful brand-deal cancellation / kill-fee notice.",
    priceInUSD: 15,
    inputLabel:
      "Parties, campaign, reason (high-level), kill fee or refund terms if agreed, effective date, remaining rights:",
    inputPlaceholder:
      "e.g., GlowCo cancels Apr reel · product delay · kill fee 50% of $2,500 · effective today · no further posts",
    aiSystemPrompt: `${CREATOR_GUARD} Draft a cancellation notice: reference agreement, effective date, fees/refunds blanks, content already posted, remaining obligations. Tone professional; urge counsel if disputed.`,
    outputFormat: "markdown",
    category: "creator-ops",
  },

  // —— Deal Mode ——
  {
    slug: "letter-of-intent-outline",
    title: "Letter of Intent (LOI) Outline",
    description:
      "Outline a non-binding LOI for a purchase, partnership, or asset deal.",
    priceInUSD: 24,
    inputLabel:
      "Deal type, parties, assets/business, proposed price or structure, exclusivity, diligence window, binding vs non-binding points, target close:",
    inputPlaceholder:
      "e.g., Asset purchase · Buyer Northstar · Seller Apex Shop · $180k assets · 30-day diligence · exclusivity 21 days · non-binding except confidentiality",
    aiSystemPrompt: `${DEAL_GUARD} Produce an LOI outline: parties, deal summary, price/structure blanks, diligence, exclusivity, binding vs non-binding sections, governing law blank, signature blocks. Mark which clauses are typically binding.`,
    outputFormat: "markdown",
    category: "deal-ops",
  },
  {
    slug: "term-sheet-outline",
    title: "Term Sheet Outline",
    description:
      "Outline a term sheet for investment, acquisition, or commercial partnership.",
    priceInUSD: 24,
    inputLabel:
      "Transaction type, parties, economics (price/%/valuation), governance, conditions, exclusivity, target close:",
    inputPlaceholder:
      "e.g., Seed investment · Investor Fund Z · $500k SAFE-style economics TBD · board observer · 45-day exclusivity",
    aiSystemPrompt: `${DEAL_GUARD} Produce a term-sheet outline with clear section headers and blanks. Label non-binding vs binding customs carefully. Not securities advice.`,
    outputFormat: "markdown",
    category: "deal-ops",
  },
];
