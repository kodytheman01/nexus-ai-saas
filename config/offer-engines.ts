import type { EngineSeed } from "./engines";

const HR_GUARD =
  "CRITICAL: You produce DRAFT HR / employment documents only — not legal advice and not a substitute for employment counsel. Employment laws vary by state. Never invent salary bands, equity terms, or benefits not in the intake. Include a banner: 'Draft only — have employment counsel / HR leadership review before sending.' Prefer blanks over hallucinated facts. Do not create discriminatory language.";

/** Offer Mode — offer letters, rejection, onboarding ops. */
export const OFFER_ENGINES_SEED: EngineSeed[] = [
  {
    slug: "job-offer-letter-drafter",
    title: "Job Offer Letter Drafter",
    description:
      "Draft a professional offer letter from role, compensation, and start-date facts.",
    priceInUSD: 24,
    inputLabel:
      "Candidate name, title, department, start date, compensation (base/bonus/equity if any), FLSA status if known, benefits summary, contingencies, company signer:",
    inputPlaceholder:
      "e.g., Avery Chen · Ops Analyst · start Sep 8 · $78k salary · at-will · health/401k · contingent on background · signed by Taylor Morgan, People Lead",
    aiSystemPrompt: `${HR_GUARD} Draft a job offer letter in clean markdown: greeting, role, start date, compensation, benefits overview, contingencies, at-will / employment status cue (confirm locally), acceptance deadline, signature blocks.`,
    outputFormat: "markdown",
    category: "hr-offer",
  },
  {
    slug: "offer-rejection-letter",
    title: "Candidate Rejection Letter",
    description:
      "Send a clear, respectful rejection after interviews without inventing feedback.",
    priceInUSD: 12,
    inputLabel:
      "Candidate name, role applied, stage reached, optional keep-warm note, company contact:",
    inputPlaceholder:
      "e.g., Jordan Lee · Marketing Manager · final round · keep resume on file · people@company.com",
    aiSystemPrompt: `${HR_GUARD} Draft a brief, respectful rejection letter. No invented feedback or discriminatory reasons. Optional keep-warm line if requested.`,
    outputFormat: "markdown",
    category: "hr-offer",
  },
  {
    slug: "internal-promotion-letter",
    title: "Internal Promotion / Title Change Letter",
    description:
      "Confirm a promotion, new title, effective date, and compensation change.",
    priceInUSD: 19,
    inputLabel:
      "Employee name, current title, new title, effective date, new compensation, reporting change if any, signer:",
    inputPlaceholder:
      "e.g., Sam Rivera · Associate → Senior Associate · Aug 1 · $92k · reports to Director of Ops",
    aiSystemPrompt: `${HR_GUARD} Draft an internal promotion / title-change letter: congratulations, new role, effective date, compensation, reporting, acknowledgment.`,
    outputFormat: "markdown",
    category: "hr-offer",
  },
  {
    slug: "internship-offer-letter",
    title: "Internship Offer Letter",
    description:
      "Draft an internship offer with dates, stipend/pay, and program expectations.",
    priceInUSD: 15,
    inputLabel:
      "Intern name, program/title, start/end dates, hours, pay or unpaid note, mentor, school credit if any:",
    inputPlaceholder:
      "e.g., Riley Park · Summer Ops Intern · Jun 2–Aug 8 · 20 hrs/wk · $18/hr · mentor Avery · for-credit optional",
    aiSystemPrompt: `${HR_GUARD} Draft an internship offer: dates, hours, compensation (or confirm unpaid legality locally), expectations, mentor, acceptance. Remind to verify unpaid internship rules.`,
    outputFormat: "markdown",
    category: "hr-offer",
  },
  {
    slug: "offer-rescind-notice",
    title: "Offer Rescind / Withdrawal Notice",
    description:
      "Draft a careful offer-withdrawal notice when circumstances change — counsel review strongly advised.",
    priceInUSD: 19,
    inputLabel:
      "Candidate name, original offer date/role, reason category (high-level only), effective date, contact for questions:",
    inputPlaceholder:
      "e.g., Avery Chen · offer dated Jul 10 Ops Analyst · role frozen due to restructuring · effective immediately · people@…",
    aiSystemPrompt: `${HR_GUARD} Draft a careful offer rescind notice. Use high-level non-discriminatory reason categories only. Strongly recommend employment counsel review before sending. Keep factual and brief.`,
    outputFormat: "markdown",
    category: "hr-offer",
  },
];
