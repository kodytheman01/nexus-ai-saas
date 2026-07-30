/**
 * Example intakes shown on engine pages so specialists know what "good input" looks like.
 */
export function getIntakeExample(opts: {
  slug: string;
  category: string;
  inputPlaceholder: string;
}): string {
  const bySlug: Record<string, string> = {
    "grant-proposal-narrative-generator": `Organization: Riverbend Workforce Alliance (501(c)(3)), serving 3 rural counties.
Funder / opportunity: State workforce development grant (adult credential pathway).
Population: Adults 18–54 without industry credentials; high manufacturing vacancy rates.
Need (with data): Employers report tech roles open 90+ days; local completion rates lag state average by 12 pts.
Program: 16-week technician cohort, employer advisory board, wraparound supports (childcare referrals, transit stipends).
Goals: Enroll 80 learners / 12 months; 70% credential completion; 55% placed in related jobs within 90 days.
Evidence we can provide: county labor stats, MOUs with 4 employers, prior cohort outcomes.
Ask: Draft need, goals, approach, and evaluation narrative sections.`,

    "grant-proposal-outline-generator": `FOA / RFP: Federal workforce FOA (illustrative) — narrative + budget narrative required.
Org capacity: 12 FT staff, 8 years operating history, prior state awards totaling $1.2M.
Partners: community college + 4 employers (letters available).
Timeline: 24-month project period.
Budget ballpark: $450k (personnel, participant supports, evaluation).
Ask: Section-by-section outline mapped to typical FOA requirements + evidence checklist.`,

    "grant-compliance-reporting-checklist": `Award: State workforce grant, 24-month period, quarterly progress + annual financial report.
Allowable: personnel, participant stipends, evaluation contractor.
Match: 10% in-kind (staff time).
Site visit expected in Q3.
Ask: Compliance reporting checklist + evidence pack list aligned to these terms.`,

    "nonprofit-budget-allocation-calculator": `Total budget: $820,000.
Program delivery: direct services + case management.
Admin: finance, executive, occupancy share.
Fundraising: development director + events.
Constraints: funder prefers program ≥70%; overhead under 20%.
Ask: Allocation narrative suitable for board + funder appendix.`,

    "nda-generator": `Parties: Acme Robotics (Disclosing) and Northline Logistics (Receiving).
Purpose: Evaluate potential pilot integration of warehouse routing software.
Mutual NDA preferred. Term: 2 years. Governing law: Texas.
Ask: Draft mutual NDA structure covering purpose, CI definition, exclusions, term, return/destruction.`,

    "sales-proposal-generator": `Buyer: Mid-market manufacturer (ops lead).
Offer: 12-week ops automation retainer — discovery, workflow build, handoff.
Outcomes: cut manual scheduling time ~30%; weekly status.
Pricing: Phase 1 $8.5k; Phase 2 $6k.
Ask: Client-ready proposal with scope, investment, and next steps.`,

    "startup-runway-and-burn-rate-calculator": `Cash: $410,000. Monthly net burn: $38,000. Revenue: $12k MRR growing ~8%/mo.
Hiring plan: 2 engineers in 60 days (~+$22k burn).
Ask: Runway narrative + sensitivity notes for investor update.`,

    "pay-or-quit-notice-drafter": `State: TX · County: Dallas · City: Dallas
Tenant: Jordan Lee · Property: 412 Oak St #2, Dallas TX 75201
Lease dated: Jan 1 2025 · Monthly rent: $1,850 · Unpaid: June 2025 ($1,850)
Payment: Zelle to owner@example.com · Agent: Sam Rivera 214-555-0100
Ask: Draft pay-or-quit / rent demand — CONFIRM LOCAL DEADLINE before serving.`,

    "contractor-proposal-drafter": `GC: Apex Build Co · Contact: Sam Rivera 214-555-0100
Owner: Jordan Lee · Property: 412 Oak St, Dallas TX
Job: Kitchen remodel — demo, cabinets, quartz tops, tile backsplash
Timeline: 3 weeks · Price: $18,500 · Deposit: 40% · Progress: 40% · Final: 20%
Exclusions: appliances, plumbing beyond sink rough-in
Ask: Draft contractor proposal with scope, exclusions, payment schedule.`,

    "change-order-drafter": `Job ref: #1042 kitchen remodel · Owner: Jordan Lee
Change: Add pot filler + relocate sink 18 inches
Cost delta: +$1,250 · Schedule: +2 days
Ask: Draft change order with acknowledgment lines.`,

    "job-offer-letter-drafter": `Candidate: Avery Chen · Title: Ops Analyst · Dept: Operations
Start: Sep 8 2026 · Compensation: $78,000 salary · Status: at-will (confirm locally)
Benefits: health, 401k match per handbook · Contingent on background check
Signer: Taylor Morgan, People Lead · Accept by: Aug 20
Ask: Draft offer letter for counsel/People review before send.`,

    "offer-rejection-letter": `Candidate: Jordan Lee · Role: Marketing Manager · Stage: final round
Keep resume on file: yes · Contact: people@example.com
Ask: Brief respectful rejection — no invented feedback.`,
  };

  if (bySlug[opts.slug]) return bySlug[opts.slug];

  const byCategory: Record<string, string> = {
    "contractor-bid": `Trade / GC: [name].
Property / job: [address + type].
Scope bullets: [inclusions].
Exclusions: [list].
Timeline + price cues: [dates / $].
Ask: Structured draft for customer or sub review — not a licensed estimate.`,
    "hr-offer": `Candidate / employee: [name].
Role / title: [title].
Start or effective date: [date].
Compensation + benefits cues: [facts only].
Ask: Draft for People/counsel review before send — not employment advice.`,
    "landlord-notice": `State/city: [jurisdiction].
Parties + property: [names / address].
Amounts / dates: [rent, periods, deadlines].
Ask: Draft notice for local counsel review before serving.`,
    "tenant-letter": `Property + landlord/agent: [names].
Issue + dates: [facts].
Ask: Paper-trail letter draft — not legal advice.`,
    nonprofit: `Org type & size: [nonprofit / municipality], [# staff].
Opportunity: [grant / program name].
Population served + need data: [metrics].
Proposed activities + timeline: [bullets].
Goals / outcomes: [measurable].
Ask: Produce a structured draft I can refine with my team.`,
    writing: `Audience: [who will read this].
Purpose: [what decision or action].
Key facts / constraints: [bullets].
Tone: [formal / plain / persuasive].
Ask: Draft a complete first-pass deliverable with clear sections.`,
    legal: `Parties: [names / roles].
Purpose: [transaction / disclosure / services].
Key terms wanted: [term length, governing law, special clauses].
Ask: Produce a structured draft for attorney markup — not final advice.`,
    finance: `Numbers: [cash, burn, budget, or ratios].
Context: [board / investor / ops].
Decision needed: [what should the narrative answer].
Ask: Structured analysis narrative + action checklist.`,
    sales: `Buyer + problem: [who / pain].
Offer + timeline: [scope].
Pricing: [phases].
Ask: Proposal draft with scope, investment, next steps.`,
  };

  return (
    byCategory[opts.category.toLowerCase()] ||
    opts.inputPlaceholder ||
    `Context: [who you are and what you need].
Constraints: [deadline, budget, audience].
Inputs: [facts, metrics, documents you already have].
Ask: Produce a structured first-pass deliverable I can edit.`
  );
}
