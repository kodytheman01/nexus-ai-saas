/**
 * Publish Notice Mode walkthrough Reel to Instagram.
 * Requires public video at /ads/apex-notice-walkthrough.mp4
 *
 *   npx tsx scripts/publish-notice-reel-now.ts
 */
import { config as loadEnv } from "dotenv";
loadEnv();

const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID?.trim();
const token = process.env.META_PAGE_ACCESS_TOKEN?.trim();
const videoUrl =
  process.env.NOTICE_REEL_VIDEO_URL ||
  "https://apexcapitaladmin.com/ads/apex-notice-walkthrough.mp4";

const LANDING =
  "https://apexcapitaladmin.com/go/notice?utm_source=instagram&utm_medium=reel&utm_campaign=apex_notice_walkthrough&utm_content=site-tour-live";

const CAPTION = `Watch the real Apex Notice Mode — not a stock template.

Homepage → Notice Mode → TX/FL/CA packs → pay-or-quit intake → /go/notice

$24 drafts · Stripe · ~60 seconds · optional +$49 human review
Not legal advice. Confirm local rules before you serve.

👉 ${LANDING}

#ApexCapital #NoticeMode #Landlord #PropertyManagement #PayOrQuit`;

async function wait(id: string) {
  for (let i = 0; i < 48; i++) {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${id}?fields=status_code,status&access_token=${encodeURIComponent(token!)}`,
    );
    const data = await res.json();
    console.log(
      "status",
      i,
      JSON.stringify({
        code: data.status_code,
        status: data.status,
        error: data.error?.message,
      }),
    );
    if (data.status_code === "FINISHED") return;
    if (data.status_code === "ERROR" || data.error) {
      throw new Error(JSON.stringify(data));
    }
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("timeout waiting for container");
}

async function main() {
  if (!igId || !token) {
    throw new Error("Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or META_PAGE_ACCESS_TOKEN");
  }

  const head = await fetch(videoUrl, { method: "HEAD" });
  console.log("video HEAD", head.status, videoUrl);
  if (!head.ok) {
    throw new Error(`Video not publicly reachable (${head.status}). Deploy /ads first.`);
  }

  const body = new URLSearchParams({
    media_type: "REELS",
    video_url: videoUrl,
    caption: CAPTION.slice(0, 2200),
    share_to_feed: "true",
    access_token: token,
  });
  const created = await fetch(`https://graph.facebook.com/v21.0/${igId}/media`, {
    method: "POST",
    body,
  });
  const createdData = await created.json();
  if (!createdData.id) {
    console.log("CREATE_FAIL", JSON.stringify(createdData.error || createdData));
    process.exit(1);
  }
  const id = String(createdData.id);
  console.log("container", id);
  await wait(id);

  const pubBody = new URLSearchParams({
    creation_id: id,
    access_token: token,
  });
  const pub = await fetch(
    `https://graph.facebook.com/v21.0/${igId}/media_publish`,
    { method: "POST", body: pubBody },
  );
  const pubData = await pub.json();
  console.log(
    "PUBLISH",
    JSON.stringify({
      status: pub.status,
      id: pubData.id || null,
      error: pubData.error
        ? { message: pubData.error.message, code: pubData.error.code }
        : null,
    }),
  );
  if (!pubData.id) process.exit(1);
  console.log("OK posted media", pubData.id);
}

main().catch((e) => {
  console.error(String(e));
  process.exit(1);
});
