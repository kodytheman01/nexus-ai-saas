import { getFlagship } from "@/config/flagship";
import { displayTitle } from "@/lib/display";

export const HUMAN_REVIEW_USD = 49;

export const WHAT_YOU_GET_DEFAULT = [
  "Custom draft generated from your written intake",
  "On-page delivery typically under 60 seconds after payment",
  "Copy of the deliverable emailed when you provide an address",
  "One complimentary regeneration token",
  "Stripe-secured checkout",
];

const CATEGORY_SAMPLES: Record<
  string,
  (title: string, description: string) => string
> = {
  writing: (title, description) => `## ${title} — sample excerpt (illustrative)

### Opening frame
${description}

### Draft body (shape you can expect)
**Context.** [Organization / product] faces [constraint] and needs a clear written path to [outcome].

**Approach.** We propose a structured draft covering: problem framing, evidence, recommended language, and next-step owners.

**Sample language.**
> "This initiative prioritizes measurable outcomes within 90 days, with a documented reporting cadence and clear responsibility for each milestone."

### Close
Editable sections ready for your voice, brand, and counsel review where required.`,

  legal: (title, description) => `## ${title} — sample excerpt (illustrative)

### Purpose
${description}

### Core sections you can expect
1. Parties & defined terms
2. Scope / subject matter
3. Obligations & restrictions
4. Term, termination, and survival
5. Limitation language & governing law placeholders

### Sample clause shape
> "Confidential Information excludes information that is publicly available through no fault of the Receiving Party, or independently developed without use of the Disclosing Party's materials."

*Structural draft only — attorney review recommended before execution.*`,

  finance: (title, description) => `## ${title} — sample excerpt (illustrative)

### Snapshot
${description}

### Narrative you can expect
- Inputs summarized (cash, burn, ratios, or allocation)
- Interpretation in plain language
- Sensitivities / what-if notes
- Action checklist for ops or board

### Example line
> "At current net burn, implied runway is approximately [N] months before a financing or cost gate is required."`,

  nonprofit: (title, description) => `## ${title} — sample excerpt (illustrative)

### Program frame
${description}

### Sections typical of this deliverable
- Need / population served
- Goals & measurable objectives
- Activities & timeline
- Evaluation / compliance notes
- Budget narrative cues

### Sample objective language
> "Enroll 80 adult learners in a 16-week pathway within 12 months and track credential completion quarterly."`,

  business: (title, description) => `## ${title} — sample excerpt (illustrative)

### Brief
${description}

### Deliverable shape
1. Executive summary
2. Scope / workplan
3. Investment or resource logic
4. Risks & assumptions
5. Clear next steps

### Sample next-step block
1. Confirm scope owners
2. Kickoff within 5 business days
3. First checkpoint deliverable`,

  sales: (title, description) => `## ${title} — sample excerpt (illustrative)

### Proposal frame
${description}

### Structure
- Executive summary tied to buyer outcome
- Scope & deliverables
- Timeline / phases
- Investment
- Acceptance / next steps

### Sample opener
> "We will deliver [outcome] for [client] over [timeline], with weekly status and a defined revision policy."`,

  marketing: (title, description) => `## ${title} — sample excerpt (illustrative)

### Creative / messaging frame
${description}

### What you receive
- Positioning angle
- Draft copy blocks (headline, body, CTA)
- Channel notes
- Iteration cues

### Sample headline shape
> "Turn [pain] into [measurable outcome] — without adding headcount this quarter."`,

  tech: (title, description) => `## ${title} — sample excerpt (illustrative)

### Spec frame
${description}

### Structure
1. Problem / constraints
2. Proposed architecture or workflow
3. Implementation steps
4. Risks & fallback
5. Acceptance criteria

### Sample acceptance line
> "Definition of done: documented flow, error handling, and a smoke-test checklist signed off by the owner."`,
};

function fallbackSample(title: string, category: string, description: string) {
  const clean = displayTitle(title);
  const builder = CATEGORY_SAMPLES[category.toLowerCase()];
  if (builder) return builder(clean, description);

  return `## ${clean} — sample excerpt (illustrative)

### What this engine addresses
${description}

### Deliverable sections you can expect
1. Executive summary tailored to your inputs
2. Structured recommendations / checklist / draft language
3. Implementation notes and next steps
4. Short disclaimer: informational draft — not licensed professional advice

Your live output is generated from *your* intake after checkout — this excerpt shows structure and tone only.`;
}

/** Build a readable sample block for any engine (flagship excerpt or category template). */
export function getSampleDeliverable(opts: {
  slug: string;
  title: string;
  category: string;
  description: string;
}): { label: string; body: string; isFlagship: boolean } {
  const flagship = getFlagship(opts.slug);
  if (flagship) {
    return {
      label: "Sample excerpt (illustrative)",
      body: flagship.sampleExcerpt,
      isFlagship: true,
    };
  }

  return {
    label: "Sample excerpt (illustrative)",
    body: fallbackSample(opts.title, opts.category, opts.description),
    isFlagship: false,
  };
}
