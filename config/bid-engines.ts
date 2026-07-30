import type { EngineSeed } from "./engines";

const BID_GUARD =
  "CRITICAL: You produce DRAFT commercial documents only — not legal advice and not a licensed estimator opinion. Never invent unit prices, codes, or warranties. Prefer blanks like [Price] over hallucinated numbers. Include a short banner: 'Draft only — confirm scope, price, and terms before sending to a customer.'";

/** Bid Mode — contractor proposals, change orders, scopes. */
export const BID_ENGINES_SEED: EngineSeed[] = [
  {
    slug: "contractor-proposal-drafter",
    title: "Contractor Proposal / Bid Letter",
    description:
      "Draft a clear contractor proposal from scope, timeline, and price cues.",
    priceInUSD: 24,
    inputLabel:
      "Job type, property address, scope bullets, materials/labor notes, timeline, total or allowance, payment terms, company contact:",
    inputPlaceholder:
      "e.g., Kitchen remodel · 412 Oak St · demo, cabinets, quartz, tile backsplash · 3 weeks · $18,500 · 40% deposit · Apex Build Co · Sam 214-555-0100",
    aiSystemPrompt: `${BID_GUARD} Draft a contractor proposal in clean markdown: parties, property, scope of work, exclusions, timeline, price/allowances, payment schedule, change-order note, acceptance signature block, disclaimer.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
  {
    slug: "change-order-drafter",
    title: "Change Order Drafter",
    description:
      "Document scope changes, cost deltas, and schedule impact in a change-order draft.",
    priceInUSD: 19,
    inputLabel:
      "Original job reference, change description, added/removed work, cost delta, schedule impact, approval contacts:",
    inputPlaceholder:
      "e.g., Job #1042 kitchen · add pot filler + move sink 18in · +$1,250 · +2 days · owner Jordan Lee",
    aiSystemPrompt: `${BID_GUARD} Draft a change order: reference original agreement, describe change, cost/schedule impact, owner/contractor acknowledgment lines. Do not invent prices.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
  {
    slug: "scope-of-work-outline",
    title: "Scope of Work Outline",
    description:
      "Turn rough job notes into a structured scope-of-work outline with exclusions.",
    priceInUSD: 15,
    inputLabel:
      "Trade, rooms/areas, include list, exclude list, site constraints, punch-list expectations:",
    inputPlaceholder:
      "e.g., Interior paint · 3BR house · walls/ceilings · exclude cabinets · occupied home · final walkthrough",
    aiSystemPrompt: `${BID_GUARD} Produce a scope-of-work outline: inclusions, exclusions, assumptions, site constraints, acceptance criteria. Neutral professional tone.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
  {
    slug: "subcontractor-bid-request",
    title: "Subcontractor Bid Request (RFP Lite)",
    description:
      "Request bids from subs with clear scope, due date, and submission format.",
    priceInUSD: 15,
    inputLabel:
      "Trade needed, project address, scope summary, bid due date, insurance/license asks, GC contact:",
    inputPlaceholder:
      "e.g., Electrical · 88 Pine · panel upgrade + 6 circuits · bids due Fri 5pm · COI required · GC Sam",
    aiSystemPrompt: `${BID_GUARD} Draft a subcontractor bid request: project, scope, due date, required docs, questions contact, submission format.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
  {
    slug: "job-completion-punch-list",
    title: "Job Completion / Punch List Letter",
    description:
      "Close a job with remaining items, walkthrough notes, and final payment cues.",
    priceInUSD: 12,
    inputLabel:
      "Job address, remaining items, target completion date, final payment amount/status, contacts:",
    inputPlaceholder:
      "e.g., 12 Elm · touch-up paint living, replace outlet cover · complete by Fri · final $2,400 due on sign-off",
    aiSystemPrompt: `${BID_GUARD} Draft a completion / punch-list letter: remaining items, dates, final payment cue, walkthrough acknowledgment.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
  {
    slug: "materials-allowance-memo",
    title: "Materials Allowance Memo",
    description:
      "Clarify allowances, overage rules, and selection deadlines for a job.",
    priceInUSD: 12,
    inputLabel:
      "Allowance categories and amounts, selection deadline, overage billing rule, project reference:",
    inputPlaceholder:
      "e.g., Tile $8/sf · fixtures $1,200 · selections due Aug 15 · overages billed at cost +10%",
    aiSystemPrompt: `${BID_GUARD} Draft an allowance memo: categories, amounts, selection deadline, overage handling, owner acknowledgment.`,
    outputFormat: "markdown",
    category: "contractor-bid",
  },
];
