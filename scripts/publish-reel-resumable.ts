/**
 * Publish one Reel via Meta resumable upload (bypasses video_url publish 500s).
 * Usage: npx tsx scripts/publish-reel-resumable.ts [slug]
 */
import fs from "fs";
import path from "path";
import { config as loadEnv } from "dotenv";

loadEnv();

const igId = (process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID || "").trim();
const token = (process.env.META_PAGE_ACCESS_TOKEN || "").trim();
const slug = (process.argv[2] || "grant-proposal-narrative-generator").trim();
const localPath = path.join(
  process.cwd(),
  "public",
  "ads",
  `${slug}.mp4`,
);
const metaPath = path.join(process.cwd(), "public", "ads", `${slug}.json`);

const defaultCaption = `Grant deadline? Get a funder-style narrative draft in about a minute.

$24 · Stripe checkout · optional human review

https://apexcapitaladmin.com/go/grant?utm_source=instagram&utm_medium=reel&utm_campaign=apex_wave1_grant&utm_content=${slug}

#GrantWriting #Nonprofit #FOA #ApexCapital #GrantMode`;

const caption = fs.existsSync(metaPath)
  ? String(
      (JSON.parse(fs.readFileSync(metaPath, "utf8")) as { caption?: string })
        .caption || defaultCaption,
    )
  : defaultCaption;

async function main() {
  if (!igId || !token) throw new Error("Missing IG id or page token");
  if (!fs.existsSync(localPath)) throw new Error(`Missing file ${localPath}`);

  const fileBuf = fs.readFileSync(localPath);
  console.log(`file ${localPath} bytes=${fileBuf.length}`);

  // 1) Create resumable REELS container
  const createBody = new URLSearchParams({
    media_type: "REELS",
    upload_type: "resumable",
    caption: caption.slice(0, 2200),
    share_to_feed: "true",
    access_token: token,
  });
  const createdRes = await fetch(
    `https://graph.facebook.com/v21.0/${igId}/media`,
    { method: "POST", body: createBody },
  );
  const created = (await createdRes.json()) as {
    id?: string;
    uri?: string;
    error?: unknown;
  };
  console.log("CREATE", JSON.stringify(created));
  if (!created.id || !created.uri) {
    throw new Error(`Create failed: ${JSON.stringify(created)}`);
  }

  // 2) Upload bytes to rupload
  const uploadRes = await fetch(created.uri, {
    method: "POST",
    headers: {
      Authorization: `OAuth ${token}`,
      offset: "0",
      file_size: String(fileBuf.length),
      "Content-Type": "application/octet-stream",
    },
    body: fileBuf,
  });
  const uploadText = await uploadRes.text();
  console.log("UPLOAD", uploadRes.status, uploadText.slice(0, 500));
  if (!uploadRes.ok) {
    throw new Error(`Upload failed: ${uploadRes.status} ${uploadText}`);
  }

  // 3) Wait for FINISHED
  for (let i = 0; i < 60; i++) {
    const stRes = await fetch(
      `https://graph.facebook.com/v21.0/${created.id}?fields=status_code,status&access_token=${encodeURIComponent(token)}`,
    );
    const st = (await stRes.json()) as {
      status_code?: string;
      status?: string;
      error?: { message: string };
    };
    console.log("status", i, st.status_code || st.error?.message);
    if (st.status_code === "FINISHED") break;
    if (st.status_code === "ERROR" || st.error) {
      throw new Error(`Container error: ${JSON.stringify(st)}`);
    }
    await new Promise((r) => setTimeout(r, 5000));
  }

  // Extra settle time before publish
  await new Promise((r) => setTimeout(r, 15000));

  // 4) Publish
  const pubRes = await fetch(
    `https://graph.facebook.com/v21.0/${igId}/media_publish`,
    {
      method: "POST",
      body: new URLSearchParams({
        creation_id: created.id,
        access_token: token,
      }),
    },
  );
  const pub = await pubRes.json();
  console.log("PUBLISH", pubRes.status, JSON.stringify(pub));
  if (!(pub as { id?: string }).id) {
    process.exit(1);
  }

  const mediaId = (pub as { id: string }).id;
  const metaRes = await fetch(
    `https://graph.facebook.com/v21.0/${mediaId}?fields=id,permalink,media_type,media_product_type&access_token=${encodeURIComponent(token)}`,
  );
  console.log("MEDIA", JSON.stringify(await metaRes.json()));
}

main().catch((e) => {
  console.error("FAIL:", e instanceof Error ? e.message : e);
  process.exit(1);
});
