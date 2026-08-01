/**
 * Build a slow retire + remake schedule:
 *  - DELETE old Wave-1 spam Reels (1/day)
 *  - POST Mode walkthrough remakes (existing god_mode queue, max 2/day)
 *
 * Writes:
 *   instagram-release/RETIRE.json
 *   updates QUEUE.json notes
 *   Desktop phone pack RETIRE_AND_REMAKE.txt
 *
 *   npx tsx scripts/build-remake-retire-schedule.ts
 */
import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";
import os from "os";

loadEnv();

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "instagram-release");
const TOKEN = (process.env.META_PAGE_ACCESS_TOKEN || "").trim();
const IG =
  process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
  process.env.META_IG_USER_ID ||
  "17841438275593067";

/** Never delete these media IDs (Vision pin + known good walkthroughs) */
const KEEP_MEDIA_IDS = new Set([
  "18115053610932526", // Vision + Four Modes pin candidate (Dbg8247FfVj)
  "18225266014325908", // Notice overview (Dbg3_20j1So)
]);

/** Keep these — new God Mode / brand */
const KEEP_CAPTION =
  /PIN THIS|live site walkthrough|Four Modes|Notice Mode —|Grant Mode —|Bid Mode —|Offer Mode —|Watch the real Apex|Unpaid rent\. Blank notice|FOA due Friday|Customer wants the bid|You hired them|time back for what you love|apex-notice-walkthrough|apex-vision|apex-grant-walkthrough|apex-bid-walkthrough|apex-offer-walkthrough|site walkthrough/i;

/** Spam patterns from Wave-1 */
const SPAM_CAPTION =
  /Instant output|Why grind|professional (finance|legal|automation|seo|dev) output|Your (finance|automation|dev|legal) bottleneck|Funder-style narrative drafts, FOA outlines, budget language/i;

type IgMedia = {
  id: string;
  caption?: string;
  timestamp?: string;
  permalink?: string;
  like_count?: number;
  comments_count?: number;
};

type RetireItem = {
  day: number;
  scheduledLocal: string;
  mediaId: string;
  permalink: string;
  captionHead: string;
  remakeAs: string;
  remakeVideoSlug: string;
  remakeGo: string;
  status: "queued" | "deleted" | "skipped";
};

function ct(y: number, m: number, d: number, h: number, min = 0) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${y}-${p(m)}-${p(d)}T${p(h)}:${p(min)}:00-05:00`;
}

function mapRemake(caption: string): {
  remakeAs: string;
  remakeVideoSlug: string;
  remakeGo: string;
} {
  const c = caption.toLowerCase();
  if (
    /grant|nonprofit|foa|budget allocation|compliance|narrative|outline/.test(c)
  ) {
    return {
      remakeAs: "Grant Mode walkthrough (all Grant engines)",
      remakeVideoSlug: "apex-grant-walkthrough",
      remakeGo: "/go/grant",
    };
  }
  if (
    /notice|landlord|tenant|pay.or.quit|rent|lease|vacate|deposit/.test(c)
  ) {
    return {
      remakeAs: "Notice Mode walkthrough (all Notice engines)",
      remakeVideoSlug: "apex-notice-walkthrough",
      remakeGo: "/go/notice",
    };
  }
  if (/bid|contractor|construction|proposal|change order|punch/.test(c)) {
    return {
      remakeAs: "Bid Mode walkthrough (all Bid engines)",
      remakeVideoSlug: "apex-bid-walkthrough",
      remakeGo: "/go/bid",
    };
  }
  if (/offer|hiring|hr |employment|internship|promotion|rejection/.test(c)) {
    return {
      remakeAs: "Offer Mode walkthrough (all Offer engines)",
      remakeVideoSlug: "apex-offer-walkthrough",
      remakeGo: "/go/offer",
    };
  }
  // Generic Wave-1 premium junk → Modes brand
  return {
    remakeAs: "Vision + Four Modes walkthrough (brand pin style)",
    remakeVideoSlug: "apex-vision-walkthrough",
    remakeGo: "/modes",
  };
}

async function fetchAllMedia(): Promise<IgMedia[]> {
  const out: IgMedia[] = [];
  let url: string | null =
    `https://graph.facebook.com/v21.0/${IG}/media?fields=id,caption,timestamp,permalink,like_count,comments_count&limit=50&access_token=${encodeURIComponent(TOKEN)}`;
  for (let page = 0; page < 6 && url; page++) {
    const res: Response = await fetch(url);
    const data = (await res.json()) as {
      data?: IgMedia[];
      paging?: { next?: string };
      error?: { message: string };
    };
    if (data.error) throw new Error(data.error.message);
    out.push(...(data.data || []));
    url = data.paging?.next || null;
  }
  return out;
}

async function main() {
  if (!TOKEN) throw new Error("Missing META_PAGE_ACCESS_TOKEN");

  const media = await fetchAllMedia();
  const keep: IgMedia[] = [];
  const spam: IgMedia[] = [];

  for (const m of media) {
    const cap = m.caption || "";
    if (KEEP_MEDIA_IDS.has(m.id)) {
      keep.push(m);
      continue;
    }
    if (KEEP_CAPTION.test(cap) && !SPAM_CAPTION.test(cap)) {
      keep.push(m);
      continue;
    }
    if (SPAM_CAPTION.test(cap) || /#BusinessTools #Reels/.test(cap)) {
      spam.push(m);
      continue;
    }
    // Unknown older posts — retire slowly if not Mode walkthrough
    if (!/walkthrough|Four Modes|\/go\/(notice|grant|bid|offer)/i.test(cap)) {
      spam.push(m);
    } else {
      keep.push(m);
    }
  }

  // Oldest spam first (clean the bottom of the grid gradually)
  spam.sort(
    (a, b) =>
      new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime(),
  );

  // Start retiring tomorrow 10:30am CT (after morning walkthrough post), 1/day
  const start = new Date("2026-08-02T10:30:00-05:00");
  const retire: RetireItem[] = spam.map((m, i) => {
    const when = new Date(start.getTime() + i * 24 * 60 * 60 * 1000);
    const y = when.getFullYear();
    const mo = when.getMonth() + 1;
    const d = when.getDate();
    const remake = mapRemake(m.caption || "");
    return {
      day: i + 1,
      scheduledLocal: ct(y, mo, d, 10, 30),
      mediaId: m.id,
      permalink: m.permalink || "",
      captionHead: (m.caption || "").split("\n")[0].slice(0, 90),
      ...remake,
      status: "queued",
    };
  });

  const payload = {
    createdAt: new Date().toISOString(),
    rules: {
      deletePerDay: 1,
      deleteAtLocal: "10:30 America/Chicago",
      note: "Delete 1 Wave-1 spam Reel/day. Remakes are Mode walkthroughs already in QUEUE.json (posted by ApexIGGodModeOrganic at 9am/4pm). Do not re-post Instant-output engines.",
    },
    keepCount: keep.length,
    spamCount: spam.length,
    keepSample: keep.slice(0, 8).map((m) => ({
      id: m.id,
      permalink: m.permalink,
      head: (m.caption || "").split("\n")[0].slice(0, 70),
    })),
    items: retire,
  };

  fs.writeFileSync(
    path.join(OUT, "RETIRE.json"),
    JSON.stringify(payload, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        fetched: media.length,
        keep: keep.length,
        spam: spam.length,
        retireDays: retire.length,
        firstDelete: retire[0]?.scheduledLocal,
        lastDelete: retire[retire.length - 1]?.scheduledLocal,
      },
      null,
      2,
    ),
  );

  // Phone instructions
  const phone = path.join(
    os.homedir(),
    "OneDrive",
    "Desktop",
    "Apex Ops",
    "9 - GOD MODE ADS NOW",
    "RETIRE_AND_REMAKE.txt",
  );
  const lines = [
    "RETIRE OLD ADS → REMAKE AS MODE WALKTHROUGHS",
    "============================================",
    `Spam Reels found: ${spam.length}`,
    `Keep (God Mode / walkthrough): ${keep.length}`,
    "",
    "PLAN",
    "- 9:00a / 4:00p CT — post NEW Mode walkthrough (ApexIGGodModeOrganic)",
    "- 10:30a CT — delete 1 old Wave-1 spam Reel (retire script)",
    "- Remake = Mode walkthrough video + full engine list caption (NOT Instant output)",
    "",
    "PIN stays: Vision + Four Modes Reel",
    "",
    "RETIRE ORDER (oldest first):",
    ...retire.slice(0, 40).map(
      (r, i) =>
        `${i + 1}. ${r.scheduledLocal.slice(0, 10)} DELETE ${r.captionHead} → remake: ${r.remakeAs}`,
    ),
    spam.length > 40 ? `... +${spam.length - 40} more` : "",
    "",
    "Manual: you can also hide/archive in IG app. Auto delete uses Graph API.",
  ];
  fs.writeFileSync(phone, lines.filter(Boolean).join("\n") + "\n");
  console.log("Wrote", phone);
}

main().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
