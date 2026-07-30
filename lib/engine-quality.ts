import type { EngineSeed } from "@/config/engines";

const DRAFT_BANNER =
  " CRITICAL: Produce a DRAFT only — informational, not licensed professional advice. Prefer blanks over invented facts. Include a short banner that the user must have a qualified professional review before regulated use.";

const CATEGORIES_NEEDING_GUARD = new Set([
  "legal",
  "hr",
  "hr-offer",
  "realestate",
  "landlord-notice",
  "tenant-letter",
  "landlord-ops",
  "ecommerce",
  "health",
  "insurance",
  "finance",
  "contractor-bid",
]);

function hasGuard(prompt: string): boolean {
  const p = prompt.toLowerCase();
  return (
    p.includes("not legal advice") ||
    p.includes("not a substitute") ||
    p.includes("educational") ||
    p.includes("draft only") ||
    p.includes("not licensed") ||
    p.includes("not medical advice") ||
    p.includes("not financial advice")
  );
}

/** Harden prompts/descriptions before DB upsert so every engine meets a quality floor. */
export function normalizeEngineSeed(engine: EngineSeed): EngineSeed {
  let { description, aiSystemPrompt, inputPlaceholder, inputLabel } = engine;

  if (description.trim().length < 55) {
    description = `${description.trim()} Structured first-pass draft from your facts — edit before professional use.`;
  }

  if (
    CATEGORIES_NEEDING_GUARD.has(engine.category) &&
    !hasGuard(aiSystemPrompt)
  ) {
    aiSystemPrompt = `${aiSystemPrompt.trim()}${DRAFT_BANNER}`;
  }

  if (inputPlaceholder.trim().length < 24) {
    inputPlaceholder = `e.g., who it's for, key facts, dates/amounts, constraints, and what you need drafted…`;
  }

  if (inputLabel.trim().length < 8) {
    inputLabel = "Describe what you need drafted (include facts and constraints):";
  }

  return {
    ...engine,
    description,
    aiSystemPrompt,
    inputPlaceholder,
    inputLabel,
  };
}
