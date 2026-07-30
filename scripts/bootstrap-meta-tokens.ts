/**
 * Exchange short-lived Graph Explorer user token → long-lived (~60 days),
 * then derive never-expiring Page token + IG id.
 *
 * Needs in .env:
 *   META_USER_TOKEN=EAA...   (fresh from Graph Explorer)
 *   META_APP_ID=808775495658176
 *   META_APP_SECRET=...      (App Settings → Basic → Show)
 *
 * Usage:
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
const DEFAULT_APP_ID = "808775495658176";

function upsertEnv(key: string, value: string) {
  let raw = fs.existsSync(ENV_PATH) ? fs.readFileSync(ENV_PATH, "utf-8") : "";
  const line = `${key}=${value}`;
  const re = new RegExp(`^${key}=.*$`, "m");
  if (re.test(raw)) raw = raw.replace(re, line);
  else raw = `${raw.replace(/\s*$/, "")}\n${line}\n`;
  fs.writeFileSync(ENV_PATH, raw, "utf-8");
}

async function exchangeLongLived(
  shortToken: string,
  appId: string,
  appSecret: string,
): Promise<string> {
  const url =
    "https://graph.facebook.com/v21.0/oauth/access_token?" +
    new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: appId,
      client_secret: appSecret,
      fb_exchange_token: shortToken,
    }).toString();
  const res = await fetch(url);
  const data = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: { message: string };
  };
  if (!data.access_token) {
    throw new Error(
      data.error?.message || "Long-lived token exchange failed",
    );
  }
  console.log(
    `Long-lived user token OK (expires_in_sec=${data.expires_in ?? "unknown"})`,
  );
  return data.access_token;
}

async function main() {
  let userToken = (process.env.META_USER_TOKEN || "").trim();
  const appId = (process.env.META_APP_ID || DEFAULT_APP_ID).trim();
  const appSecret = (process.env.META_APP_SECRET || "").trim();

  if (!userToken.startsWith("EAA")) {
    throw new Error(
      "Set META_USER_TOKEN in .env to a FRESH Graph Explorer User token (EAA…).",
    );
  }

  // Probe if current token still works
  const probe = await fetch(
    "https://graph.facebook.com/v21.0/me?fields=id&access_token=" +
      encodeURIComponent(userToken),
  );
  const probeData = (await probe.json()) as { id?: string; error?: { message: string } };
  if (probeData.error) {
    throw new Error(
      `User token dead: ${probeData.error.message}. Generate a new EAA token in Graph Explorer and paste again.`,
    );
  }

  if (appSecret) {
    userToken = await exchangeLongLived(userToken, appId, appSecret);
    upsertEnv("META_APP_ID", appId);
    upsertEnv("META_APP_SECRET", appSecret);
  } else {
    console.log(
      "WARN: META_APP_SECRET missing — keeping short-lived token (will expire again tonight). Add App Secret for ~60-day tokens.",
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
    error?: { message: string };
  };

  if (data.error) throw new Error(`Graph error: ${data.error.message}`);

  const pages = data.data || [];
  if (!pages.length) {
    throw new Error("me/accounts returned no Pages.");
  }

  const knownIg = (process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "").trim();
  const page =
    pages.find((p) => p.instagram_business_account?.id) ||
    pages.find((p) => p.id === process.env.META_PAGE_ID) ||
    pages[0];

  const pageToken = page.access_token;
  const igId = page.instagram_business_account?.id || knownIg;

  upsertEnv("META_USER_TOKEN", userToken);
  upsertEnv("META_PAGE_ACCESS_TOKEN", pageToken);
  upsertEnv("META_PAGE_ID", page.id);
  upsertEnv("PUBLIC_AD_VIDEO_BASE_URL", "https://apexcapitaladmin.com/ads");
  if (igId) upsertEnv("INSTAGRAM_BUSINESS_ACCOUNT_ID", igId);

  console.log("OK wrote .env");
  console.log(`Page: ${page.name} (${page.id})`);
  console.log(`IG id: ${igId || "MISSING"}`);
  console.log(`Page token: SET (len ${pageToken.length})`);
  console.log(
    appSecret
      ? "Long-lived user token stored — should last ~60 days."
      : "Short-lived only — add META_APP_SECRET next time.",
  );

  if (!igId) {
    throw new Error("No Instagram business account id on Page or in .env.");
  }

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
