/**
 * Delete due Wave-1 spam Reels from RETIRE.json (max 1 per run).
 *
 *   npx tsx scripts/run-ig-retire-due.ts
 *   npx tsx scripts/run-ig-retire-due.ts --dry-run
 */
import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";

loadEnv();

const ROOT = path.join(__dirname, "..");
const FILE = path.join(ROOT, "instagram-release", "RETIRE.json");
const TOKEN = (process.env.META_PAGE_ACCESS_TOKEN || "").trim();
const dryRun = process.argv.includes("--dry-run");

type RetireFile = {
  items: {
    scheduledLocal: string;
    mediaId: string;
    permalink: string;
    captionHead: string;
    remakeAs: string;
    status: string;
    deletedAt?: string;
    error?: string;
  }[];
};

async function main() {
  if (!TOKEN) throw new Error("Missing META_PAGE_ACCESS_TOKEN");
  if (!fs.existsSync(FILE)) {
    throw new Error("No RETIRE.json — run: npx tsx scripts/build-remake-retire-schedule.ts");
  }
  const data = JSON.parse(fs.readFileSync(FILE, "utf8")) as RetireFile;
  const now = Date.now();
  const due = data.items.filter(
    (i) =>
      i.status === "queued" &&
      new Date(i.scheduledLocal).getTime() <= now,
  );
  console.log(`Due deletes: ${due.length}. Dry-run: ${dryRun}`);
  if (due.length === 0) return;

  const item = due[0];
  console.log(
    `Retiring ${item.mediaId}\n  ${item.captionHead}\n  ${item.permalink}\n  remake → ${item.remakeAs}`,
  );

  if (dryRun) {
    console.log("DRY-RUN — no delete");
    return;
  }

  const del = await fetch(
    `https://graph.facebook.com/v21.0/${item.mediaId}?access_token=${encodeURIComponent(TOKEN)}`,
    { method: "DELETE" },
  );
  const body = (await del.json()) as {
    success?: boolean;
    error?: { message: string };
  };
  if (!del.ok || body.error) {
    item.status = "failed";
    item.error = body.error?.message || `HTTP ${del.status}`;
    fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
    throw new Error(item.error);
  }

  item.status = "deleted";
  item.deletedAt = new Date().toISOString();
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
  console.log("DELETED", item.mediaId, body);
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
