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
  };

  if (bySlug[opts.slug]) return bySlug[opts.slug];

  const byCategory: Record<string, string> = {
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
