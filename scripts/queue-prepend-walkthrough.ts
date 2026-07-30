/**
 * Prepend site walkthrough to IG queue as the next due post.
 */
import fs from "fs";
import path from "path";

const ROOT = path.join(__dirname, "..");
const QUEUE = path.join(ROOT, "instagram-release", "QUEUE.json");
const META = path.join(ROOT, "public", "ads", "apex-site-walkthrough.json");

const q = JSON.parse(fs.readFileSync(QUEUE, "utf8"));
const meta = JSON.parse(fs.readFileSync(META, "utf8")) as {
  caption: string;
  landing: string;
};

q.items = q.items.filter(
  (i: { slug: string }) => i.slug !== "apex-site-walkthrough",
);

const now = new Date();
const item = {
  day: 0,
  slot: 0,
  scheduledLocal: new Date(now.getTime() - 60_000).toISOString(),
  slug: "apex-site-walkthrough",
  title: "Apex Capital — Full Site Walkthrough",
  videoPath: path.join(ROOT, "public", "ads", "apex-site-walkthrough.mp4"),
  caption: meta.caption,
  instagramUrl: meta.landing,
  status: "queued",
  tier: "brand",
};

q.items.unshift(item);
q.total = q.items.length;
fs.writeFileSync(QUEUE, JSON.stringify(q, null, 2));
console.log("PREPENDED walkthrough; queue total", q.total);
console.log("Next slug:", q.items[0].slug, q.items[0].status);
