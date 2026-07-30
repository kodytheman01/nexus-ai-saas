/**
 * Flagship engines — the 10 we push hardest for conversion.
 * Samples are illustrative (anonymized scenarios), not claimed client endorsements.
 */

export type FlagshipEngine = {
  slug: string;
  badge: string;
  hook: string;
  scenarioTitle: string;
  scenarioBody: string;
  sampleExcerpt: string;
  whatYouGet: string[];
};

export const FLAGSHIP_ENGINES: FlagshipEngine[] = [
  {
    slug: "grant-proposal-narrative-generator",
    badge: "Grant Mode",
    hook: "Turn program facts into a funder-ready narrative draft in minutes.",
    scenarioTitle: "Scenario: Regional nonprofit seeking workforce grant",
    scenarioBody:
      "A 12-person nonprofit needed a first-pass narrative for a state workforce grant. They fed program metrics, population served, and outcomes — and received a structured draft to refine with their grant writer.",
    sampleExcerpt: `## Need Statement
The [County] workforce corridor faces a measurable advanced-manufacturing skills gap. Employer surveys (n=42, [Year]) report technician roles open an average of 93 days. Residents without industry credentials are [X]% of the working-age population (ACS [Year]).

## Goals & Measurable Objectives (SMART)
1. Enroll 80 adult learners in a 16-week technician pathway within 12 months of award.
2. Achieve ≥70% credential completion among enrolled participants.
3. Place ≥55% of completers into related employment within 90 days of completion.

## Approach / Project Design
- Cohort-based instruction with employer advisory input on curriculum
- Wraparound supports (childcare referrals, transit stipends) to reduce attrition for working adults
- Quarterly learning reviews with partners; continuous improvement log

## Evaluation
Pre/post skills assessments; credential attainment; employment placement tracked quarterly and reported to the funder with data definitions and source systems documented.

## Sustainability note
Employer cash/in-kind commitments and tuition recovery pathways sustain cohorts beyond the award period.`,
    whatYouGet: [
      "Funder-style narrative sections (need, SMART goals, approach, evaluation)",
      "Editable draft language tailored to your inputs",
      "One complimentary regeneration if intake needs correction",
      "Optional human review for near-final filings",
    ],
  },
  {
    slug: "grant-proposal-outline-generator",
    badge: "Grant Mode",
    hook: "Get a section-by-section outline before you write a single paragraph.",
    scenarioTitle: "Scenario: First-time applicant organizing a federal FOA",
    scenarioBody:
      "A municipal partner used the outline engine to map required sections against their FOA checklist — reducing “blank page” time before bringing in a specialist reviewer.",
    sampleExcerpt: `## FOA-aligned outline (illustrative)

1. Cover / Abstract — problem, population, ask amount, period of performance
2. Statement of Need — local data, disparity vs. state/national, urgency
3. Goals & Measurable Objectives — SMART; link each to activities
4. Project Design & Work Plan — year-1 / year-2 milestones; Gantt cues
5. Organizational Capacity — staff roles, prior awards, fiscal controls
6. Partnerships & Letters of Support — roles, MOUs, employer advisors
7. Evaluation Plan — indicators, data sources, reporting cadence
8. Budget Narrative — personnel, fringe, travel, supplies, contractual, other; align to SF-424A-style categories
9. Sustainability / Continuation — post-award funding model
10. Appendices checklist — resumes, LOIs, org chart, indirect rate docs

### Evidence to gather next
- [ ] Labor market data citations
- [ ] Partner letters (drafted)
- [ ] Prior outcome tables
- [ ] Match documentation (if required)`,
    whatYouGet: [
      "FOA-aligned section outline",
      "Suggested evidence to gather per section",
      "Budget narrative category prompts",
    ],
  },
  {
    slug: "grant-compliance-reporting-checklist",
    badge: "Grant Mode",
    hook: "Stay audit-ready with a reporting checklist built from your award terms.",
    scenarioTitle: "Scenario: Mid-cycle compliance scramble",
    scenarioBody:
      "A program manager mapped reporting deadlines and evidence folders before a site visit — using the checklist as an internal control list, then verifying against the award letter.",
    sampleExcerpt: `## Award control calendar
- [ ] Period of performance dates logged in shared calendar
- [ ] Quarterly progress report due dates + owners
- [ ] Financial report / drawdown schedule
- [ ] Prior-approval triggers documented (budget transfers, key personnel)

## Participant & eligibility file
- [ ] Eligibility criteria from award / program guide
- [ ] Intake forms retained; PII access limited
- [ ] Attendance / effort documentation

## Financial evidence pack
- [ ] Timesheets / effort certifications
- [ ] Procurement records (quotes, approvals)
- [ ] Match / cost-share evidence with valuation method
- [ ] Invoice ↔ ledger reconciliation sample

## Site-visit readiness
- [ ] Org chart + fiscal policies folder
- [ ] Outcome data dictionary + export
- [ ] Corrective-action log (if prior findings)`,
    whatYouGet: [
      "Compliance checklist tailored to your award description",
      "Evidence pack reminders",
      "Pre-site-visit readiness cues",
    ],
  },
  {
    slug: "nonprofit-budget-allocation-calculator",
    badge: "Grant Mode",
    hook: "Allocate program vs. admin dollars with a transparent worksheet narrative.",
    scenarioTitle: "Scenario: Board asking “where does the money go?”",
    scenarioBody:
      "Leadership produced a clean allocation narrative for board review before attaching detailed spreadsheets from finance.",
    sampleExcerpt: `## Allocation Summary (illustrative)
- Program delivery: 72%
- Personnel (program): 48% of total
- Direct participant supports: 14%
- Admin / overhead: 18%
- Fundraising: 10%

## Budget narrative cues
Personnel maps to grant-allowable roles with %FTE stated. Participant supports (stipends, transit) tied to enrollment targets. Overhead kept within funder-typical ranges; method of allocation (direct / shared) noted for finance review.

## Board talking points
1. Program share vs. peer benchmarks
2. Sensitivity if enrollment misses by 15%
3. What is restricted vs. unrestricted`,
    whatYouGet: [
      "Allocation breakdown from your inputs",
      "Board-friendly narrative summary",
      "Flags where ratios look atypical",
    ],
  },
  {
    slug: "nda-generator",
    badge: "Ops Essential",
    hook: "Draft a working NDA structure for mutual or one-way disclosure talks.",
    scenarioTitle: "Scenario: Vendor diligence before sharing product roadmap",
    scenarioBody:
      "A founder generated a draft NDA frame to send counsel — not as final legal advice, but as a structured starting point covering purpose, term, and exclusions.",
    sampleExcerpt: `## Parties & Purpose
Disclosing Party / Receiving Party enter this agreement to evaluate a potential commercial relationship regarding [project].

## Confidential Information
Includes non-public technical, commercial, and financial information marked confidential or reasonably understood as confidential.

## Exclusions
Information that is public, independently developed, or rightfully received from a third party without duty of confidentiality.

## Term
Obligations survive for [X] years after disclosure.

## Return / destruction
Upon request, Receiving Party returns or destroys CI and certifies destruction, except archival copies required by law.`,
    whatYouGet: [
      "Structured NDA draft sections",
      "Customizable term / purpose language",
      "Counsel-ready starting point (not a substitute for an attorney)",
    ],
  },
  {
    slug: "sales-proposal-generator",
    badge: "Revenue",
    hook: "Produce a client proposal skeleton with scope, pricing logic, and next steps.",
    scenarioTitle: "Scenario: Agency closing a mid-market retainer",
    scenarioBody:
      "Sales used the engine to assemble a first proposal draft overnight, then refined pricing with the account lead.",
    sampleExcerpt: `## Executive Summary
We will deliver [outcome] for [client] over [timeline].

## Scope
- Discovery & requirements
- Implementation milestones
- Reporting cadence

## Investment
Phase 1: $[X]
Phase 2: $[Y]

## Next Steps
1. Confirm scope
2. Kickoff within 5 business days
3. First deliverable checkpoint`,
    whatYouGet: [
      "Proposal narrative + scope blocks",
      "Pricing / phase structure",
      "Clear next-step CTA",
    ],
  },
  {
    slug: "freelance-client-proposal-generator",
    badge: "Revenue",
    hook: "Win clearer freelance work with scope boundaries and payment terms drafted fast.",
    scenarioTitle: "Scenario: Independent consultant scoping a 6-week engagement",
    scenarioBody:
      "A consultant turned a discovery call into a written proposal the same day — then negotiated from a complete draft instead of a blank email.",
    sampleExcerpt: `## Deliverables
1. Strategy memo
2. Implementation checklist
3. 2 revision rounds

## Timeline
Week 1–2 discovery · Week 3–5 build · Week 6 handoff

## Payment
50% to start · 50% on delivery`,
    whatYouGet: [
      "Scope + deliverables list",
      "Timeline and revision policy",
      "Payment structure language",
    ],
  },
  {
    slug: "startup-runway-and-burn-rate-calculator",
    badge: "Capital Ops",
    hook: "Translate cash, burn, and hiring plans into a runway narrative.",
    scenarioTitle: "Scenario: Pre-seed team preparing an investor update",
    scenarioBody:
      "Founders input cash balance and monthly burn to generate a runway explanation for their monthly update email.",
    sampleExcerpt: `## Runway Snapshot
Cash on hand: $[X]
Net burn: $[Y]/mo
Implied runway: ~[Z] months

## Sensitivities
- Hire two roles: runway shrinks by ~[N] months
- 15% revenue lift: extends runway by ~[M] months

## Actions
Prioritize cash collection, defer non-critical software, set hiring freeze gates.`,
    whatYouGet: [
      "Runway / burn narrative",
      "Sensitivity talking points",
      "Action checklist for ops",
    ],
  },
  {
    slug: "privacy-policy-generator",
    badge: "Compliance Draft",
    hook: "Generate a website privacy policy draft aligned to your data practices.",
    scenarioTitle: "Scenario: Launching a new marketing site with Stripe checkout",
    scenarioBody:
      "Ops generated a policy draft covering payments, analytics, and contact forms — then had counsel review before publish.",
    sampleExcerpt: `## Information We Collect
Account/contact details, order information, and usage analytics.

## How We Use Information
To fulfill orders, provide support, improve the service, and meet legal obligations.

## Sharing
Processors such as payment and analytics providers under contractual safeguards.

## Your Choices
Access, correction, and deletion requests via the contact email below.`,
    whatYouGet: [
      "Sectioned privacy policy draft",
      "Placeholders for processors you actually use",
      "Counsel review recommended before relying on it",
    ],
  },
  {
    slug: "ironclad-contract-factory",
    badge: "Ops Essential",
    hook: "Assemble a contract skeleton for services work with key commercial clauses.",
    scenarioTitle: "Scenario: Productizing a services agreement",
    scenarioBody:
      "A small firm produced a first-pass services agreement structure for attorney markup instead of starting from a random internet template.",
    sampleExcerpt: `## Services & Deliverables
## Fees & Payment
## Term & Termination
## IP Ownership
## Confidentiality
## Limitation of Liability
## Governing Law`,
    whatYouGet: [
      "Commercial clause skeleton",
      "Intake-driven customization",
      "Attorney markup starting point",
    ],
  },
  // —— Notice Mode (landlords) ——
  {
    slug: "pay-or-quit-notice-drafter",
    badge: "Notice Mode",
    hook: "Draft a pay-or-quit / rent demand notice from your lease facts in minutes.",
    scenarioTitle: "Scenario: Small landlord, 10 days unpaid rent",
    scenarioBody:
      "An owner with two duplexes needed a first-pass rent demand before calling counsel. They entered lease dates, amount owed, and property address — and got structured notice language to review against state rules.",
    sampleExcerpt: `## Pay or Quit — Draft (illustrative)

TO: [Tenant Name(s)]
PROPERTY: [Street], [City], [State] [ZIP]
LEASE DATED: [Date]

You are hereby notified that rent in the amount of $[Amount] is past due for the period [Start]–[End].

DEMAND: Pay the full amount owed OR quit and surrender the premises within the time required by applicable law (confirm local deadline).

PAYMENT INSTRUCTIONS: [Method / address]
OWNER/AGENT: [Name] · [Phone] · [Email]

This draft is not legal advice. Confirm statutory wording and service method for your jurisdiction.`,
    whatYouGet: [
      "Structured rent-demand / pay-or-quit draft",
      "Fields mapped from your intake",
      "Reminder to verify state/city timelines",
      "Optional human review before you serve",
    ],
  },
  {
    slug: "notice-to-vacate-drafter",
    badge: "Notice Mode",
    hook: "Generate a clear notice to vacate / non-renewal draft from your dates.",
    scenarioTitle: "Scenario: Month-to-month ending",
    scenarioBody:
      "A landlord ending a month-to-month needed clean non-renewal language and a move-out date line — without starting from a blank Word doc.",
    sampleExcerpt: `## Notice to Vacate — Draft (illustrative)

Effective [Date], tenancy at [Address] will terminate. Please vacate and return keys by [Time] on [Date].
Forwarding address requested for deposit accounting.
State/city notice period: CONFIRM LOCALLY.`,
    whatYouGet: [
      "Vacate / non-renewal draft",
      "Key return + deposit cue lines",
      "Jurisdiction confirmation checklist",
    ],
  },
  {
    slug: "lease-renewal-offer-letter",
    badge: "Notice Mode",
    hook: "Offer a renewal term, rent, and deadline in one clean letter draft.",
    scenarioTitle: "Scenario: Renewal with modest increase",
    scenarioBody:
      "Owner wanted a professional renewal offer with new rent and response deadline before peak season.",
    sampleExcerpt: `## Lease Renewal Offer — Draft

We offer to renew your lease at [Address] for [Term] beginning [Start] at $[New Rent]/mo.
Please accept in writing by [Deadline].`,
    whatYouGet: ["Renewal offer draft", "Rent + term + deadline block"],
  },
  {
    slug: "entry-notice-drafter",
    badge: "Notice Mode",
    hook: "Draft an entry / inspection notice with date, window, and purpose.",
    scenarioTitle: "Scenario: HVAC inspection",
    scenarioBody:
      "Property manager needed a polite entry notice with a 24–48h window cue for local rules.",
    sampleExcerpt: `## Entry Notice — Draft

We will enter [Address] on [Date] between [Start]–[End] for [Purpose].
Contact: [Phone].`,
    whatYouGet: ["Entry notice draft", "Purpose + time window fields"],
  },
  {
    slug: "security-deposit-itemization-letter",
    badge: "Notice Mode",
    hook: "Itemize deductions and return timing in a deposit accounting draft.",
    scenarioTitle: "Scenario: Move-out damage dispute risk",
    scenarioBody:
      "Landlord needed a clear itemization letter before mailing the deposit balance.",
    sampleExcerpt: `## Deposit Itemization — Draft

Original deposit: $[X]
Deductions: [Line items]
Balance due to tenant: $[Y] by [Date — confirm statute].`,
    whatYouGet: ["Itemization draft", "Deadline reminder to verify statute"],
  },
  // —— Tenant Mode ——
  {
    slug: "tenant-repair-request-letter",
    badge: "Tenant Mode",
    hook: "Document habitability / repair requests in a dated written draft.",
    scenarioTitle: "Scenario: Persistent leak",
    scenarioBody:
      "Tenant needed a firm, dated repair request to create a paper trail before escalation.",
    sampleExcerpt: `## Repair Request — Draft

I request repair of [Issue] at [Address], first reported [Date].
Please confirm schedule within [X] days.`,
    whatYouGet: ["Repair request draft", "Paper-trail dated structure"],
  },
  {
    slug: "tenant-rent-withholding-notice",
    badge: "Tenant Mode",
    hook: "Draft careful rent-withholding / escrow language — with strong legal warnings.",
    scenarioTitle: "Scenario: Unresolved habitability claim",
    scenarioBody:
      "Tenant exploring options needed a first-pass notice structure and a clear warning to get local legal aid.",
    sampleExcerpt: `## Notice — Draft ONLY

WARNING: Rent withholding is illegal or restricted in many places. This is not advice.
Issue: [Habitability claim]. Requested cure by [Date].`,
    whatYouGet: [
      "Cautious notice scaffold",
      "Hardcoded legal warning block",
      "Prompt to contact legal aid / counsel",
    ],
  },
  {
    slug: "roommate-agreement-outline",
    badge: "Tenant Mode",
    hook: "Outline rent split, chores, guests, and move-out rules for roommates.",
    scenarioTitle: "Scenario: Three roommates, one lease",
    scenarioBody:
      "Group needed a shared-house outline before anyone moved in.",
    sampleExcerpt: `## Roommate Outline
Rent share · utilities · quiet hours · guests · security deposit · exit notice.`,
    whatYouGet: ["Roommate agreement outline", "Conflict-prevention sections"],
  },
  {
    slug: "tenant-move-out-checklist",
    badge: "Tenant Mode",
    hook: "Generate a move-out checklist to protect deposit return odds.",
    scenarioTitle: "Scenario: First apartment exit",
    scenarioBody:
      "Renter wanted a punch-list before walkthrough photos.",
    sampleExcerpt: `## Move-Out Checklist
Clean · patch · photos · keys · forwarding address · utilities.`,
    whatYouGet: ["Move-out checklist draft", "Photo / keys reminders"],
  },
  {
    slug: "lease-break-request-letter",
    badge: "Tenant Mode",
    hook: "Draft a lease-break / early termination request with reasons and dates.",
    scenarioTitle: "Scenario: Job relocation",
    scenarioBody:
      "Tenant needed a professional early-termination request letter draft.",
    sampleExcerpt: `## Early Termination Request — Draft
Request to terminate lease at [Address] effective [Date] due to [Reason].
Propose [Buyout / replacement / military clause — confirm eligibility].`,
    whatYouGet: ["Lease-break request draft", "Negotiation cue lines"],
  },
  // —— Bid Mode (contractors) ——
  {
    slug: "contractor-proposal-drafter",
    badge: "Bid Mode",
    hook: "Turn job notes into a clean contractor proposal draft in minutes.",
    scenarioTitle: "Scenario: Kitchen remodel bid due Friday",
    scenarioBody:
      "A small GC needed a first-pass proposal with scope, timeline, and payment schedule before sending to the homeowner.",
    sampleExcerpt: `## Proposal — Draft (illustrative)

TO: [Owner]
PROPERTY: [Address]
SCOPE: [Bullets]
EXCLUSIONS: [List]
TIMELINE: [Weeks]
PRICE: $[Amount] · Deposit [X]%
CHANGE ORDERS: Written approval required.

Draft only — confirm price and terms before sending.`,
    whatYouGet: [
      "Structured proposal draft",
      "Scope / exclusions / payment cues",
      "Optional human review before customer send",
    ],
  },
  {
    slug: "change-order-drafter",
    badge: "Bid Mode",
    hook: "Document scope changes, cost deltas, and schedule impact clearly.",
    scenarioTitle: "Scenario: Owner adds a pot filler mid-job",
    scenarioBody:
      "GC needed a change order the owner could sign the same day — without reinventing the template.",
    sampleExcerpt: `## Change Order — Draft
Original job: [Ref]
Change: [Description]
Cost impact: $[Delta]
Schedule: +[Days]
Owner / contractor acknowledgment lines.`,
    whatYouGet: ["Change-order draft", "Cost + schedule impact block"],
  },
  {
    slug: "scope-of-work-outline",
    badge: "Bid Mode",
    hook: "Structure inclusions, exclusions, and assumptions before you price.",
    scenarioTitle: "Scenario: Interior paint bid",
    scenarioBody:
      "Painter wanted a tight SOW outline so the homeowner knew what was in and out.",
    sampleExcerpt: `## Scope Outline
Inclusions · Exclusions · Assumptions · Acceptance criteria.`,
    whatYouGet: ["SOW outline", "Exclusion prompts"],
  },
  // —— Offer Mode (HR) ——
  {
    slug: "job-offer-letter-drafter",
    badge: "Offer Mode",
    hook: "Draft a professional offer letter from role and compensation facts.",
    scenarioTitle: "Scenario: Ops Analyst hire this week",
    scenarioBody:
      "A lean People team needed a clean offer letter draft before counsel/HR final pass.",
    sampleExcerpt: `## Offer Letter — Draft (illustrative)

Dear [Candidate],
We are pleased to offer [Title] starting [Date] at $[Comp].
Benefits overview · contingencies · acceptance deadline · signatures.

Draft only — employment counsel review recommended.`,
    whatYouGet: [
      "Offer letter structure",
      "Comp / start / contingency blocks",
      "Optional human review before send",
    ],
  },
  {
    slug: "offer-rejection-letter",
    badge: "Offer Mode",
    hook: "Close other candidates with a respectful rejection draft.",
    scenarioTitle: "Scenario: Final-round runners-up",
    scenarioBody:
      "Hiring manager needed a brief, non-discriminatory rejection after the offer went out.",
    sampleExcerpt: `## Rejection — Draft
Thank you for interviewing for [Role]. We selected another candidate.
Optional keep-warm line. Contact: [Email].`,
    whatYouGet: ["Respectful rejection draft", "Keep-warm optional line"],
  },
  {
    slug: "internal-promotion-letter",
    badge: "Offer Mode",
    hook: "Confirm promotion, title, and compensation change in one letter.",
    scenarioTitle: "Scenario: Associate → Senior Associate",
    scenarioBody:
      "Manager wanted a formal promotion letter before payroll updated.",
    sampleExcerpt: `## Promotion Letter — Draft
New title · effective date · compensation · reporting · acknowledgment.`,
    whatYouGet: ["Promotion letter draft", "Effective-date + comp block"],
  },
];

export const FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.map((f) => f.slug);

export function getFlagship(slug: string): FlagshipEngine | undefined {
  return FLAGSHIP_ENGINES.find((f) => f.slug === slug);
}

