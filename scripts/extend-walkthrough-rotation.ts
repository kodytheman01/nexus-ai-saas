/**
 * Extend QUEUE.json with a repeating Mode-walkthrough rotation so remakes
 * continue while old spam is retired (1 delete/day).
 *
 *   npx tsx scripts/extend-walkthrough-rotation.ts
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");
const QUEUE = path.join(ROOT, "instagram-release", "QUEUE.json");
const ADS = path.join(ROOT, "public", "ads");

const ROTATION = [
  "apex-notice-walkthrough",
  "apex-grant-walkthrough",
  "apex-bid-walkthrough",
  "apex-offer-walkthrough",
  "apex-vision-walkthrough",
  "apex-site-walkthrough",
] as const;

function ctIsoFromDate(d: Date) {
  // Format as America/Chicago offset -05:00 (CDT in August)
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value || "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}:00-05:00`;
}

function main() {
  const q = JSON.parse(fs.readFileSync(QUEUE, "utf8")) as {
    items: Array<Record<string, unknown>>;
    wave?: string;
    rules?: Record<string, unknown>;
    total?: number;
  };

  // Start rotation day after last queued item
  const queued = q.items.filter((i) => i.status === "queued");
  let cursor = new Date("2026-08-05T16:00:00-05:00");
  for (const i of q.items) {
    const t = new Date(String(i.scheduledLocal)).getTime();
    if (t > cursor.getTime()) cursor = new Date(t);
  }
  // Next slot after last: +1 day 9am then 4pm alternating
  cursor = new Date(cursor.getTime() + 18 * 60 * 60 * 1000);

  const days = 24; // ~24 more posts = 12 days @ 2/day while spam retires
  let added = 0;
  for (let i = 0; i < days; i++) {
    const videoSlug = ROTATION[i % ROTATION.length];
    const metaPath = path.join(ADS, `${videoSlug}.json`);
    const mp4 = path.join(ADS, `${videoSlug}.mp4`);
    if (!fs.existsSync(mp4) || !fs.existsSync(metaPath)) {
      console.warn("skip missing", videoSlug);
      continue;
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
      caption: string;
      landing: string;
      title?: string;
    };

    // Alternate 9:00 and 16:00 CT
    const slot = i % 2; // 0 morning, 1 afternoon
    const dayOffset = Math.floor(i / 2);
    const base = new Date("2026-08-06T00:00:00-05:00");
    const when = new Date(base.getTime() + dayOffset * 86400000);
    when.setHours(slot === 0 ? 9 : 16, 0, 0, 0);

    q.items.push({
      day: 10 + dayOffset,
      slot: slot + 1,
      scheduledLocal: ctIsoFromDate(when),
      slug: `god-rotate-${videoSlug}-${i + 1}`,
      videoSlug,
      title: `Remake rotation — ${meta.title || videoSlug}`,
      videoPath: mp4,
      caption: meta.caption,
      instagramUrl: meta.landing,
      status: "queued",
      tier: "god_mode_remake_rotation",
      note: "Continues Mode walkthrough remakes while RETIRE.json deletes Wave-1 spam 1/day",
    });
    added++;
  }

  q.wave = "god_mode_walkthroughs_v2_remake_rotation";
  q.total = q.items.length;
  q.rules = {
    ...(q.rules || {}),
    maxPerDay: 2,
    minGapMinutes: 360,
    retireSpamPerDay: 1,
    note: "Post Mode walkthrough remakes 2/day. Delete 1 Wave-1 spam/day via run-ig-retire-due.ts",
  };

  fs.writeFileSync(QUEUE, JSON.stringify(q, null, 2));
  console.log(
    JSON.stringify(
      {
        added,
        total: q.items.length,
        stillQueued: q.items.filter((i) => i.status === "queued").length,
      },
      null,
      2,
    ),
  );
}

main();
