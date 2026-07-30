/**
 * Complete Facebook Page profile: about, contact, picture, cover.
 * Instagram biography cannot be set reliably via this API — prints exact copy
 * and opens Business Suite for the IG side.
 *
 * Usage: npx tsx scripts/complete-meta-profiles.ts
 */
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv();

const ROOT = path.join(__dirname, "..");
const PAGE_ID = process.env.META_PAGE_ID || "1210961825438072";
const TOKEN = (process.env.META_PAGE_ACCESS_TOKEN || "").trim();
const LOGO = path.join(ROOT, "public", "brand", "apex-logo-profile.png");
const COVER = path.join(ROOT, "public", "brand", "apex-cover-facebook.png");

const ABOUT =
  "Draft-ready grants, notices, bids, offers, and ops. Stripe checkout, instant draft, optional human review. Not legal advice.";
const DESCRIPTION = `Apex Capital Admin Services — structured first-pass drafts for grants, landlord/tenant notices, contractor bids, HR offers, and ops.

• Grant Mode · Notice Mode · Bid Mode · Offer Mode
• 500+ specialized engines
• Stripe-secured checkout · typically under 60 seconds
• Optional +$49 human specialist review

Drafts only — not licensed professional advice.

Website: https://apexcapitaladmin.com
Start Notice: https://apexcapitaladmin.com/go/notice
Start Grant: https://apexcapitaladmin.com/go/grant`;

const IG_BIO = `Drafts for grants · notices · bids · offers
$24 · Stripe · ~60s · human review opt.
👉 apexcapitaladmin.com/go/notice`;

const IG_NAME = "Apex Capital Admin";

async function graphForm(
  endpoint: string,
  fields: Record<string, string>,
  file?: { field: string; filePath: string },
) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.append(k, v);
  form.append("access_token", TOKEN);
  if (file) {
    const buf = fs.readFileSync(file.filePath);
    const blob = new Blob([buf], { type: "image/png" });
    form.append(file.field, blob, path.basename(file.filePath));
  }
  const res = await fetch(`https://graph.facebook.com/v21.0/${endpoint}`, {
    method: "POST",
    body: form,
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function main() {
  if (!TOKEN) throw new Error("Missing META_PAGE_ACCESS_TOKEN");
  if (!fs.existsSync(LOGO) || !fs.existsSync(COVER)) {
    throw new Error("Missing public/brand logo or cover PNGs");
  }

  console.log("Updating Page text fields…");
  const info = await graphForm(PAGE_ID, {
    about: ABOUT.slice(0, 255),
    description: DESCRIPTION.slice(0, 255),
    website: "https://apexcapitaladmin.com",
    phone: "+12145063083",
    emails: JSON.stringify(["admin@apexcapitaladmin.com"]),
    impressum:
      "Apex Capital Admin Services · Texas, USA · admin@apexcapitaladmin.com · (214) 506-3083 · Mon–Fri 9am–5pm CT",
  });
  console.log(
    "page_info",
    JSON.stringify({
      status: info.status,
      ok: info.data.success === true || !info.data.error,
      error: info.data.error?.message,
    }),
  );

  // Some fields need separate calls / may require pages_manage_metadata
  const aboutOnly = await graphForm(PAGE_ID, { about: ABOUT.slice(0, 255) });
  console.log(
    "about",
    JSON.stringify({
      status: aboutOnly.status,
      error: aboutOnly.data.error?.message,
      success: aboutOnly.data.success,
    }),
  );

  console.log("Uploading profile picture…");
  const pic = await graphForm(
    `${PAGE_ID}/picture`,
    { picture: "1" },
    { field: "source", filePath: LOGO },
  );
  console.log(
    "picture",
    JSON.stringify({
      status: pic.status,
      error: pic.data.error?.message,
      success: pic.data.success,
      id: pic.data.id,
    }),
  );

  console.log("Uploading cover photo…");
  // Upload unpublished photo then set as cover
  const photo = await graphForm(
    `${PAGE_ID}/photos`,
    { published: "false", caption: "Apex Capital Admin Services" },
    { field: "source", filePath: COVER },
  );
  console.log(
    "cover_upload",
    JSON.stringify({
      status: photo.status,
      error: photo.data.error?.message,
      id: photo.data.id,
    }),
  );
  if (photo.data.id) {
    const cover = await graphForm(PAGE_ID, {
      cover: JSON.stringify({ cover_id: String(photo.data.id) }),
    });
    console.log(
      "cover_set",
      JSON.stringify({
        status: cover.status,
        error: cover.data.error?.message,
        success: cover.data.success,
      }),
    );
  }

  // Write IG copy for Business Suite / app
  const out = path.join(
    process.env.USERPROFILE || "",
    "OneDrive",
    "Desktop",
    "Apex Ops",
    "4 - Meta Instagram",
    "INSTAGRAM_PROFILE_COPY.txt",
  );
  fs.writeFileSync(
    out,
    `INSTAGRAM @apex.capitaladmin — paste exactly

Name:
${IG_NAME}

Bio:
${IG_BIO}

Website / link:
https://apexcapitaladmin.com/go/notice

Also add if available:
- Grant → https://apexcapitaladmin.com/go/grant
- Bid → https://apexcapitaladmin.com/go/bid
- Offer → https://apexcapitaladmin.com/go/offer

Profile photo file:
C:\\Users\\kodyt\\Projects\\nexus-ai-saas\\public\\brand\\apex-logo-profile.png
Live: https://apexcapitaladmin.com/brand/apex-logo-profile.png

Highlights:
1. Notice Mode
2. Grant Mode
3. How it works
4. $24 drafts

Pin: Notice walkthrough Reel
Facebook Page updated by this script when Graph permissions allow.
`,
    "utf-8",
  );
  console.log("WROTE_IG_COPY", out);
  console.log("DONE");
}

main().catch((e) => {
  console.error("FAIL", e instanceof Error ? e.message : e);
  process.exit(1);
});
