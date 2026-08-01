/**
 * Sample intakes — every engine gets a filled, specialist-grade example
 * (bySlug → byCategory → smart fallback from placeholder).
 */

const FLAGSHIP_AND_MONEY: Record<string, string> = {
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

  "freelance-client-proposal-generator": `Freelancer: Sam Rivera · Brand strategy + landing page copy.
Client: Northline Logistics (ops director).
Scope: brand messaging workshop, homepage rewrite, 2 email sequences.
Timeline: 3 weeks · Fee: $4,800 · 50% deposit · 2 revision rounds.
Ask: Client proposal with scope, deliverables, investment, and next steps.`,

  "startup-runway-and-burn-rate-calculator": `Cash: $410,000. Monthly net burn: $38,000. Revenue: $12k MRR growing ~8%/mo.
Hiring plan: 2 engineers in 60 days (~+$22k burn).
Ask: Runway narrative + sensitivity notes for investor update.`,

  "privacy-policy-generator": `Business: Apex Ops Tools LLC · SaaS analytics dashboard · customers in US + EU.
Data collected: account email, usage events, billing via Stripe (no card numbers stored by us).
Cookies: analytics + auth · Processors: Stripe, Neon, OpenAI (intake for draft generation).
Contact: privacy@example.com · Ask: Privacy policy draft for counsel review (not legal advice).`,

  "ironclad-contract-factory": `Parties: Apex Build Co (Provider) and Jordan Lee (Client).
Services: kitchen remodel per attached scope · Price: $18,500 · Deposit 40%.
Term: work starts Aug 15 · Governing law: Texas · IP: client owns final plans after paid in full.
Ask: Service agreement skeleton for attorney markup — not legal advice.`,

  "pay-or-quit-notice-drafter": `State: TX · County: Dallas · City: Dallas
Tenant: Jordan Lee · Property: 412 Oak St #2, Dallas TX 75201
Lease dated: Jan 1 2025 · Monthly rent: $1,850 · Unpaid: June 2025 ($1,850)
Payment: Zelle to owner@example.com · Agent: Sam Rivera 214-555-0100
Ask: Draft pay-or-quit / rent demand — CONFIRM LOCAL DEADLINE before serving.`,

  "notice-to-vacate-drafter": `State: FL · County: Hillsborough
Tenant: Avery Chen · Property: 88 Pine Ave, Tampa FL
Tenancy: month-to-month · Vacate by: Aug 31 5pm · Reason: non-renewal
Key return: leasing office · Forwarding address requested for deposit.
Ask: Notice to vacate / non-renewal draft — CONFIRM LOCAL NOTICE PERIOD.`,

  "lease-renewal-offer-letter": `Tenant: Jordan Lee · Property: 412 Oak St #2, Dallas TX
Current lease ends: Sep 30 · Offer: 12 months at $1,950/mo (was $1,850)
Respond by: Aug 15 · Contact: Sam Rivera 214-555-0100
Ask: Professional lease renewal offer letter draft.`,

  "entry-notice-drafter": `Property: 12 Elm St · Entry date: Aug 8 · Window: 10am–12pm
Purpose: HVAC inspection · Contact: 214-555-0199
Ask: Polite entry/inspection notice — remind to confirm local advance-notice rules.`,

  "security-deposit-itemization-letter": `Tenant: Avery Chen · Moved out: Jul 1 · Deposit: $1,800
Deductions: carpet $220 · wall repair $150 · cleaning $95
Balance to mail · Forwarding: 500 Main St Apt 4
Ask: Deposit itemization letter — CONFIRM STATUTORY RETURN DEADLINE.`,

  "tenant-repair-request-letter": `Tenant: Jordan Lee · Property: 412 Oak St #2
Issue: Kitchen sink leak under cabinet · First reported: Jul 10 (text to PM)
Photos available · Request repair within 7 days · Contact: 214-555-0144
Ask: Dated repair request letter for paper trail — not legal advice.`,

  "tenant-rent-withholding-notice": `WARNING CONTEXT: Exploring options only — rent withholding illegal/restricted in many places.
Tenant: Avery Chen · Property: 88 Pine Ave · Issue: no heat 10+ days after written repair requests (Jul 1, Jul 8).
Ask: Cautious notice scaffold + hard legal warning · prompt to contact legal aid/counsel. NOT advice to withhold rent.`,

  "roommate-agreement-outline": `Roommates: Jordan, Avery, Sam · Lease holder: Jordan · Address: 12 Elm #3
Rent: $2,400 split 800/800/800 · Utilities: equal · Guests: max 2 nights · Quiet hours 10pm
Deposit share + move-out notice: 30 days · Ask: Roommate agreement outline (not a lease).`,

  "tenant-move-out-checklist": `Move-out date: Aug 31 · Property: 412 Oak #2 · Walkthrough with PM: Aug 30 4pm
Need: cleaning, patch, photo list, keys, forwarding address, utilities cancel.
Ask: Move-out checklist to protect deposit return odds.`,

  "lease-break-request-letter": `Tenant: Avery Chen · Lease end originally: Dec 31 · Request terminate: Sep 15
Reason: job relocation (offer letter available) · Propose: replacement tenant or buyout discuss
Landlord: Sam Rivera · Ask: Professional early-termination request draft.`,

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

  "scope-of-work-outline": `Trade: Interior paint · Property: 3BR house, occupied
Include: walls/ceilings all rooms · Exclude: cabinets, floors · Punch: final walkthrough
Ask: Scope-of-work outline with inclusions, exclusions, assumptions.`,

  "job-offer-letter-drafter": `Candidate: Avery Chen · Title: Ops Analyst · Dept: Operations
Start: Sep 8 2026 · Compensation: $78,000 salary · Status: at-will (confirm locally)
Benefits: health, 401k match per handbook · Contingent on background check
Signer: Taylor Morgan, People Lead · Accept by: Aug 20
Ask: Draft offer letter for counsel/People review before send.`,

  "offer-rejection-letter": `Candidate: Jordan Lee · Role: Marketing Manager · Stage: final round
Keep resume on file: yes · Contact: people@example.com
Ask: Brief respectful rejection — no invented feedback.`,

  "internal-promotion-letter": `Employee: Sam Rivera · Current: Associate · New: Senior Associate
Effective: Aug 1 · New comp: $92,000 · Reports to: Director of Ops
Signer: Taylor Morgan · Ask: Internal promotion / title-change letter draft.`,

  "rent-increase-notice-drafter": `State: TX · Tenant: Jordan Lee · Property: 412 Oak #2
Current rent: $1,850 · New rent: $1,950 · Effective: Oct 1
Notice date: today · Contact: Sam Rivera
Ask: Rent increase notice draft — CONFIRM LOCAL NOTICE PERIOD before serving.`,

  "preliminary-notice-drafter": `Trade: Apex Electric LLC · Project: 412 Oak St, Dallas TX
Owner: Jordan Lee · GC: Northstar Build · Work: electrical rough-in
Unpaid: $8,400 · First work: 2026-03-01 · Prior invoices: #1040–1042
Ask: Preliminary / pre-lien notice draft — CONFIRM STATE DEADLINES before serving.`,

  "mechanics-lien-claim-outline": `Claimant: Apex Electric LLC · Property: 88 Pine · Owner: Sam Rivera · GC: Northstar
Unpaid: $12,200 · Work period: Jan–Mar 2026 · Prior prelim mailed Feb 10
Ask: Mechanic's lien claim OUTLINE (not a recordable form) + recorder checklist cues.`,

  "lien-waiver-release-drafter": `Type: Progress · Payee: Apex Electric · Payer: Northstar GC
Job: 88 Pine · Amount: $4,000 · Through: 2026-03-15 · Conditional on clearance
Ask: Lien waiver / release draft — confirm state form requirements.`,

  "intent-to-lien-notice": `Company: Apex Electric · Property: 412 Oak · Owner: Jordan Lee
Unpaid: $6,800 · Invoice #1042 · Propose 10-day cure · Prelim already sent
Ask: Intent-to-lien / final-demand notice draft.`,

  "possession-demand-pack-outline": `Property: 12 Elm #2 · Landlord: Apex Housing · Tenant: Rivera
Default: nonpay $2,100 + late · Pay-or-quit served 7 days ago · Still unpaid
Ask: Possession demand pack outline + exhibits checklist — not a court form.`,

  "eviction-filing-checklist": `State: TX · County: Harris · Residential · Notices: pay-or-quit + 3-day
Amount: $1,850 rent · Counsel: not yet retained
Ask: Educational eviction filing checklist + gap list for counsel/clerk.`,

  "eviction-service-log": `Document: Pay-or-quit · Posted door 2026-04-01 10:12am · Mailed same day
Server: Sam Rivera · Photos on phone · Witness: none
Ask: Clean service log table for audit trail.`,

  "court-calendar-brief": `Hearing: JP Tue 9am · Apex Housing v Rivera · Claim: nonpay
Notices: pay-or-quit Apr 1 · Rent $1,850 · Exhibits: lease + ledger
Ask: One-page court calendar brief outline — not a pleading.`,

  "brand-deal-terms-drafter": `Brand: GlowCo · Creator: @creator · Deliverables: 1 Reel + 3 Stories
Fee: $2,500 · Usage: 90-day paid · Exclusivity: none · Due: Apr 15 · Disclose #ad
Ask: Brand deal terms draft with FTC disclosure and signature block.`,

  "content-usage-license-drafter": `Licensor: Creator · Licensee: GlowCo · Content: 1 Reel
Platforms: IG/TikTok/paid ads · Territory: US · Term: 6 months · Non-exclusive · Fee: $1,000 · Credit @handle
Ask: Limited content usage license draft.`,

  "creator-deliverable-invoice": `Payee: Rivera Media LLC · Brand: GlowCo Spring · Deliverable: 1 Reel delivered
Amount: $2,500 · Terms: Net 15 · ACH · Campaign: SPR26
Ask: Professional creator invoice with usage note.`,

  "creator-cancellation-notice": `Parties: GlowCo / Creator · Campaign: Apr Reel · Reason: product delay
Kill fee: 50% of $2,500 · Effective: today · No further posts
Ask: Careful cancellation / kill-fee notice draft.`,

  "letter-of-intent-outline": `Deal: Asset purchase · Buyer: Northstar · Seller: Apex Shop
Price: $180k assets · Diligence: 30 days · Exclusivity: 21 days
Non-binding except confidentiality / exclusivity
Ask: LOI outline marking typically binding vs non-binding sections.`,

  "term-sheet-outline": `Type: Seed conversation · Investor: Fund Z · Company: Apex Ops
Economics: $500k (instrument TBD) · Observer seat · Exclusivity: 45 days
Ask: Term sheet outline — not securities advice.`,
};

const BY_CATEGORY: Record<string, string> = {
  "contractor-bid": `GC / trade: Apex Build Co · Contact: Sam Rivera
Job: Bathroom refresh · Address: 88 Pine Ave
Scope: demo vanity, new tile floor, paint · Exclude: plumbing relocate
Timeline: 10 days · Price cue: $6,200 · Deposit 30%
Ask: Structured bid draft for customer review — not a licensed estimate.`,

  "hr-offer": `Candidate: Avery Chen · Title: Customer Success Lead
Start: Sep 15 · Comp: $85k + 10% bonus target · Benefits: standard handbook
Contingent on background · Signer: People Lead · Accept by: Aug 25
Ask: Offer / HR letter draft for counsel review — not employment advice.`,

  "landlord-notice": `State: TX · City: Dallas · Tenant: Jordan Lee · Property: 412 Oak #2
Lease facts: rent $1,850 · issue/period: [unpaid or vacate/cure details]
Agent: Sam Rivera 214-555-0100 · Ask: Notice draft — confirm local deadlines before serving.`,

  "tenant-letter": `Tenant: Avery Chen · Property: 88 Pine Ave · Landlord/PM: Sam Rivera
Issue + dates: [habitability / move-out / lease-break facts]
Ask: Paper-trail letter draft — not legal advice.`,

  "landlord-ops": `Property: 12 Elm multifamily · Owner/PM: Sam Rivera
Ops need: welcome packet / work order brief · Dates + contacts included
Ask: Ops outline draft for team use.`,

  nonprofit: `Org: Riverbend Alliance (501c3) · 12 staff · Opportunity: state workforce grant
Population + need data: rural adults, 90-day vacancy metric
Activities + SMART goals: 80 enroll / 70% complete / 55% placed
Ask: Structured nonprofit/grant draft for team + funder refinement.`,

  writing: `Audience: board / clients · Purpose: decide on Q3 initiative
Facts: 3 bullets of constraints · Tone: plain professional
Ask: Complete first-pass draft with clear sections I can edit.`,

  legal: `Parties: Acme Robotics and Northline Logistics · Purpose: pilot services
Key terms: 12-month term, Texas law, confidentiality, termination for convenience
Ask: Structured draft for attorney markup — not legal advice.`,

  finance: `Cash $410k · Burn $38k/mo · Revenue $12k MRR · Context: investor update
Decision: runway + hiring sensitivity · Ask: Analysis narrative + action checklist.`,

  sales: `Buyer: mid-market ops lead · Pain: manual scheduling
Offer: 12-week automation retainer · Price: $8.5k then $6k
Ask: Proposal with scope, investment, next steps.`,

  marketing: `Brand: Northline Logistics · Goal: lead gen for ops software
Channel: LinkedIn + landing page · Offer: 14-day pilot
Ask: Campaign brief / copy draft with CTA and messaging pillars.`,

  hr: `Company: 45-person SaaS · Role/process: [hiring, handbook, or policy need]
Facts: locations TX + remote · Ask: HR draft for People/counsel review — not legal advice.`,

  health: `Audience: adult patients / clinic ops · Topic: [screening schedule or education]
Disclaimer needed: educational only, not medical advice · Ask: Structured educational draft.`,

  education: `Audience: adult learners · Program: 16-week technician pathway
Outcomes: credential + placement · Ask: Curriculum outline / learner-facing draft.`,

  ecommerce: `Store: DTC home goods · Avg order $68 · Policies: 30-day returns, final sale clearance
Channels: Shopify + email · Ask: Store ops / policy / merchandising draft for review.`,

  productivity: `Team: 8-person ops · Pain: meeting overload + unclear owners
Tools: Notion + Slack · Ask: SOP / ritual / checklist draft we can adopt this week.`,

  career: `Candidate: mid-level marketer · Target: growth roles at B2B SaaS
Proof: 2 case metrics · Ask: Resume / outreach / proposal draft tailored to that goal.`,

  sustainability: `Org: light manufacturing · Goal: Scope 1–2 baseline + employee program
Ask: Sustainability plan / checklist draft for internal workshop.`,

  travel: `Trip: 5-day client offsite · City: Austin · Budget: $2.4k · Party of 4
Ask: Itinerary / logistics checklist draft with buffers.`,

  realestate: `Property: duplex Dallas · Goal: [lease ops / investor memo / notice]
Numbers: rent, NOI cues · Ask: Draft for local professional review — not appraisal/legal advice.`,

  crypto: `Context: treasury education for small business · Risk: educational only
Ask: Plain-language explainer / checklist — not investment advice.`,

  fitness: `Audience: busy adults · Goal: 8-week starter plan · Constraints: 3x/week home
Ask: Program outline draft — not medical advice; recommend clinician clearance.`,

  socialmedia: `Brand: Apex Capital Admin · Goal: Notice Mode Reel series
Platforms: Instagram · CTA: /go/notice · Ask: Content calendar + caption drafts.`,

  insurance: `Business: TX LLC · Coverage questions: GL + cyber (educational)
Ask: Coverage checklist / questions for broker — not insurance advice.`,

  events: `Event: 80-person nonprofit fundraiser · Date: Oct 12 · Budget: $12k
Ask: Run-of-show + vendor checklist draft.`,

  restaurant: `Concept: 40-seat fast-casual · City: Dallas · Focus: opening week ops
Ask: Soft-open checklist / menu ops draft.`,

  petcare: `Audience: new dog owners · Topic: home pet-proofing
Ask: Room-by-room checklist — educational, not veterinary advice.`,

  automation: `Stack: Stripe + Gmail + Notion · Trigger: checkout.session.completed
Ask: Automation blueprint with steps, edge cases, and test plan.`,

  seo: `Site: apexcapitaladmin.com · Goal: Notice Mode + Grant Mode landings
Keywords: pay or quit notice draft, grant narrative generator
Ask: SEO brief with titles, meta, and internal links.`,

  dev: `App: Next.js SaaS · Need: webhook handler for Stripe checkout.session.completed
Ask: Implementation outline + test cases (no secrets in output).`,
};

function fallbackFromPlaceholder(placeholder: string): string {
  const tip = placeholder.replace(/^e\.g\.,?\s*/i, "").trim();
  return `Example scenario (edit to your facts):
${tip || "Who it's for, key facts, dates/amounts, and constraints."}

Also include:
- Audience / parties
- Deadline or effective date
- What “done” looks like
Ask: Produce a structured first-pass draft I can edit before professional review.`;
}

export function getIntakeExample(opts: {
  slug: string;
  category: string;
  inputPlaceholder: string;
}): string {
  if (FLAGSHIP_AND_MONEY[opts.slug]) return FLAGSHIP_AND_MONEY[opts.slug];
  const cat = BY_CATEGORY[opts.category.toLowerCase()];
  if (cat) return cat;
  return fallbackFromPlaceholder(opts.inputPlaceholder);
}
