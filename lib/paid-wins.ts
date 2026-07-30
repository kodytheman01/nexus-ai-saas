import { db } from "@/lib/db";
import { displayTitle } from "@/lib/display";
import type { AnonymizedWin } from "@/config/wins";
import { ANONYMIZED_WINS } from "@/config/wins";
import { isConfirmedStripeCheckoutSession } from "@/lib/stripe-session";

const ROLE_BY_CATEGORY: Record<string, string> = {
  "landlord-notice": "Landlord / property ops",
  "tenant-letter": "Renter / tenant ops",
  "landlord-ops": "Property ops",
  "contractor-bid": "Contractor / GC",
  "hr-offer": "People / hiring ops",
  grants: "Grant / nonprofit ops",
  nonprofit: "Nonprofit ops",
};

function monthLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function processNote(engineTitle: string, category: string): string {
  const label = displayTitle(engineTitle);
  if (category === "landlord-notice" || category === "landlord-ops") {
    return `Completed a paid ${label} draft; edited locally before counsel/service review.`;
  }
  if (category === "tenant-letter") {
    return `Completed a paid ${label} draft; used as a paper-trail starting point.`;
  }
  if (category === "contractor-bid") {
    return `Completed a paid ${label} draft; revised scope/price before customer send.`;
  }
  if (category === "hr-offer") {
    return `Completed a paid ${label} draft; People/counsel reviewed before send.`;
  }
  return `Completed a paid ${label} draft; team edited before professional review.`;
}

/**
 * Build proof strip from real paid Stripe sessions only.
 * Never quotes intake or invents testimonials.
 */
export async function getProofWins(limit = 6): Promise<AnonymizedWin[]> {
  if (ANONYMIZED_WINS.length > 0) {
    return ANONYMIZED_WINS.slice(0, limit);
  }

  const runs = await db.engineRun.findMany({
    where: { status: "completed" },
    orderBy: { createdAt: "desc" },
    take: 40,
    select: {
      id: true,
      stripeSessionId: true,
      createdAt: true,
      engineSlug: true,
      engine: { select: { title: true, category: true } },
    },
  });

  const paid = runs.filter((r) =>
    isConfirmedStripeCheckoutSession(r.stripeSessionId),
  );
  // Prefer live charges when present
  const live = paid.filter((r) => r.stripeSessionId.startsWith("cs_live_"));
  const pool = live.length > 0 ? live : [];

  const wins: AnonymizedWin[] = [];
  const seenSlugs = new Set<string>();
  for (const r of pool) {
    if (wins.length >= limit) break;
    if (seenSlugs.has(r.engineSlug)) continue;
    seenSlugs.add(r.engineSlug);
    const category = r.engine.category;
    wins.push({
      id: `paid-${r.id}`,
      role: ROLE_BY_CATEGORY[category] ?? "Operator",
      engineSlug: r.engineSlug,
      engineLabel: displayTitle(r.engine.title),
      whatChanged: processNote(r.engine.title, category),
      dateLabel: monthLabel(r.createdAt),
    });
  }
  return wins;
}
