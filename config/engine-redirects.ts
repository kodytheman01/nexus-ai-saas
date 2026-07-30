/**
 * Prefer Mode money engines over cheaper/weaker core twins.
 * Engine pages redirect with sample intake ready.
 */
export const ENGINE_CANONICAL_REDIRECTS: Record<string, string> = {
  "employment-offer-letter-generator": "job-offer-letter-drafter",
  "rent-increase-notice-letter-generator": "rent-increase-notice-drafter",
};

export function canonicalEngineSlug(slug: string): string | null {
  return ENGINE_CANONICAL_REDIRECTS[slug] ?? null;
}
