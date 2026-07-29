/**
 * One-shot: exchange a Graph Explorer User token for Page token + IG business id,
 * write them into .env, optionally publish Wave 1 Reel #1.
 *
 * Usage:
 *   set META_USER_TOKEN in env OR pass as argv
 *   npx tsx scripts/bootstrap-meta-tokens.ts
 *   npx tsx scripts/bootstrap-meta-tokens.ts --publish
 */
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv();

const ROOT = path.join(__dirname, "..");
const ENV_PATH = path.join(ROOT, ".env");
const publish = process.argv.includes("--publish");

function upsertEnv(key: string, value: string) {
  let raw = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf-8") : "";
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(raw)) raw = raw.replace(re, line);
  else raw = `${raw.replace(/\s*$/, "")}\n${line}\n`;
  fs.writeFileSync(ENV_PATH, raw, "utf-8");
}

async function main() {
  const userToken = (process.env.META_USER_TOKEN || "").trim();

  if (!userToken.startsWith("EAA")) {
    throw new Error(
      "Set META_USER_TOKEN in .env to your Graph Explorer User token (starts with EAA), then re-run.",
    );
  }

  const url =
    "https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account&access_token=" +
    encodeURIComponent(userToken);

  const res = await fetch(url);
  const data = (await res.json()) as {
    data?: {
      id: string;
      name: string;
      access_token: string;
      instagram_business_account?: { id: string };
    }[];
    error?: { message: string; code?: number };
  };

  if (data.error) {
    throw new Error(`Graph error: ${data.error.message}`);
  }

  const pages = data.data || [];
  if (!pages.length) {
    throw new Error("me/accounts returned no Pages. Check pages_show_list permission.");
  }

  const page =
    pages.find((p) => p.instagram_business_account?.id) || pages[0];

  if (!page.instagram_business_account?.id) {
    console.log(
      "Pages found:",
      pages.map((p) => p.name).join(", "),
    );
    throw new Error(
      `Page "${page.name}" has no instagram_business_account. Link IG to the Page in Business Suite.`,
    );
  }

  const igId = page.instagram_business_account.id;
  const pageToken = page.access_token;

  upsertEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", igId);
  upsertEnv("META_PAGE_ACCESS_TOKEN", pageToken);
  upsertEnv("PUBLIC_AD_VIDEO_BASE_URL", "https://apexcapitaladmin.com/ads");
  // Keep user token for re-bootstrap if needed
  upsertEnv("META_USER_TOKEN", userToken);

  console.log("OK wrote .env");
  console.log(`Page: ${page.name}`);
  console.log(`IG id: ${igId} (len ${igId.length})`);
  console.log(`Page token: SET (len ${pageToken.length})`);

  if (publish) {
    const { spawnSync } = await import("child_process");
    const r = spawnSync(
      "npm",
      ["run", "ig:publish", "--", "--force-due", "--limit", "1"],
      { cwd: ROOT, stdio: "inherit", shell: true, env: process.env },
    );
    process.exit(r.status ?? 1);
  }
}

main().catch((err) => {
  console.error("FAIL:", err instanceof Error ? err.message : err);
  process.exit(1);
});
