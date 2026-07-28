/** Customer-facing title: strip bulk "Engine N:" prefixes without changing DB slugs. */
export function displayTitle(title: string): string {
  return title.replace(/^Engine\s+\d+:\s*/i, "").trim() || title;
}

/** True when title/slug/category looks grant-related. */
export function isGrantRelated(opts: {
  slug: string;
  title: string;
  category: string;
}): boolean {
  const hay = `${opts.slug} ${opts.title} ${opts.category}`.toLowerCase();
  return (
    hay.includes("grant") ||
    hay.includes("nonprofit") ||
    hay.includes("foundation") ||
    hay.includes("foa") ||
    opts.category.toLowerCase() === "nonprofit"
  );
}
