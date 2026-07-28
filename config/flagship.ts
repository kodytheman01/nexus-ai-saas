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
The [County] workforce corridor continues to face a measurable skills gap in advanced manufacturing. Local employers report unfilled technician roles averaging 90+ days open, while residents lack access to cohort-based credential pathways.

## Project Goals
1. Enroll 80 adult learners in a 16-week technician pathway within 12 months.
2. Achieve an 70% credential completion rate.
3. Place at least 55% of completers into related employment within 90 days.

## Approach
Cohort-based instruction, employer advisory input, and wraparound supports (childcare referrals, transit stipends) reduce attrition for working adults.

## Evaluation
Pre/post skills assessments, credential attainment, and employment placement tracked quarterly and reported to the funder.`,
    whatYouGet: [
      "Funder-style narrative sections (need, goals, approach, evaluation)",
      "Editable draft language tailored to your inputs",
      "One complimentary regeneration if intake needs correction",
    ],
  },
  {
    slug: "grant-proposal-outline-generator",
    badge: "Grant Mode",
    hook: "Get a section-by-section outline before you write a single paragraph.",
    scenarioTitle: "Scenario: First-time applicant organizing a federal FOA",
    scenarioBody:
      "A municipal partner used the outline engine to map required sections against their FOA checklist — reducing “blank page” time before bringing in a specialist reviewer.",
    sampleExcerpt: `1. Cover / Abstract
2. Statement of Need (data + local context)
3. Goals & Measurable Objectives
4. Project Design & Work Plan (timeline + milestones)
5. Organizational Capacity
6. Partnerships & Letters of Support
7. Evaluation Plan
8. Budget Narrative (aligned to line items)
9. Sustainability / Continuation Plan
10. Appendices checklist`,
    whatYouGet: [
      "FOA-aligned section outline",
      "Suggested evidence to gather per section",
      "Budget narrative prompts",
    ],
  },
  {
    slug: "grant-compliance-reporting-checklist",
    badge: "Grant Mode",
    hook: "Stay audit-ready with a reporting checklist built from your award terms.",
    scenarioTitle: "Scenario: Mid-cycle compliance scramble",
    scenarioBody:
      "A program manager mapped reporting deadlines and evidence folders before a site visit — using the checklist as an internal control list, then verifying against the award letter.",
    sampleExcerpt: `## Reporting Cadence
- [ ] Quarterly progress report due dates logged
- [ ] Financial drawdown / expenditure evidence filed
- [ ] Participant eligibility documentation retained
- [ ] Match / cost-share evidence (if applicable)
- [ ] Prior approval requests tracked

## Evidence Pack
- [ ] Signed timesheets / effort documentation
- [ ] Procurement records
- [ ] Outcome data exports with definitions`,
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
    sampleExcerpt: `## Allocation Summary
- Program delivery: 72%
- Personnel (program): 48% of total
- Direct participant supports: 14%
- Admin / overhead: 18%
- Fundraising: 10%

## Notes
Overhead kept within funder-typical ranges; personnel mapped to grant-allowable roles.`,
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
Obligations survive for [X] years after disclosure.`,
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
];

export const FLAGSHIP_SLUGS = FLAGSHIP_ENGINES.map((f) => f.slug);

export function getFlagship(slug: string): FlagshipEngine | undefined {
  return FLAGSHIP_ENGINES.find((f) => f.slug === slug);
}
