/**
 * Connected-systems smoke for Apex (read-only / non-charging).
 * Usage: npx tsx scripts/full-stack-smoke.ts
 */
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const BASE = (process.env.BASE_URL || "https://apexcapitaladmin.com").replace(
  /\/$/,
  "",
);

type Check = { name: string; ok: boolean; detail: string };

async function checkUrl(
  name: string,
  path: string,
  expect: RegExp,
): Promise<Check> {
  try {
    const res = await fetch(`${BASE}${path}`, {
      redirect: "follow",
      signal: AbortSignal.timeout(25_000),
      headers: { "User-Agent": "ApexFullStackSmoke/1.0" },
    });
    const text = await res.text();
    const ok = res.ok && expect.test(text);
    return {
      name,
      ok,
      detail: `${res.status} ${ok ? "match" : "missing expected content"}`,
    };
  } catch (e) {
    return {
      name,
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    };
  }
}

async function main() {
  const checks: Check[] = [];
  const env = (key: string) => Boolean(process.env[key]?.trim());

  checks.push({
    name: "env.DATABASE_URL",
    ok: env("DATABASE_URL"),
    detail: env("DATABASE_URL") ? "set" : "missing",
  });
  checks.push({
    name: "env.STRIPE_SECRET_KEY",
    ok: env("STRIPE_SECRET_KEY"),
    detail: env("STRIPE_SECRET_KEY")
      ? process.env.STRIPE_SECRET_KEY!.startsWith("sk_live_")
        ? "live key"
        : "test/other key"
      : "missing",
  });
  checks.push({
    name: "env.STRIPE_WEBHOOK_SECRET",
    ok: env("STRIPE_WEBHOOK_SECRET"),
    detail: env("STRIPE_WEBHOOK_SECRET") ? "set" : "missing",
  });
  checks.push({
    name: "env.OPENAI_API_KEY",
    ok: env("OPENAI_API_KEY"),
    detail: env("OPENAI_API_KEY") ? "set" : "missing",
  });
  checks.push({
    name: "env.GMAIL_APP_PASSWORD",
    ok: env("GMAIL_APP_PASSWORD"),
    detail: env("GMAIL_APP_PASSWORD") ? "set" : "missing",
  });
  checks.push({
    name: "env.META_PAGE_ACCESS_TOKEN",
    ok: env("META_PAGE_ACCESS_TOKEN"),
    detail: env("META_PAGE_ACCESS_TOKEN") ? "set" : "missing",
  });
  checks.push({
    name: "env.INSTAGRAM_BUSINESS_ACCOUNT_ID",
    ok: env("INSTAGRAM_BUSINESS_ACCOUNT_ID"),
    detail: env("INSTAGRAM_BUSINESS_ACCOUNT_ID") ? "set" : "missing",
  });
  checks.push({
    name: "env.INNGEST_EVENT_KEY",
    ok: env("INNGEST_EVENT_KEY"),
    detail: env("INNGEST_EVENT_KEY") ? "set" : "missing (optional locally)",
  });

  // Money + mode surfaces
  checks.push(
    await checkUrl("live.home", "/", /Bid Mode|Notice Mode|Grant Mode/),
  );
  checks.push(await checkUrl("live.go.bid", "/go/bid", /Contractor Proposal|proposal/i));
  checks.push(await checkUrl("live.go.offer", "/go/offer", /Offer|Job Offer/i));
  checks.push(await checkUrl("live.go.notice", "/go/notice", /Pay or Quit|pay-or-quit/i));
  checks.push(
    await checkUrl(
      "live.state.TX",
      "/engine/pay-or-quit-notice-drafter?sample=1&state=TX",
      /TX state pack|Texas/i,
    ),
  );
  checks.push(await checkUrl("live.bid-mode", "/bid-mode", /Bid Mode/));
  checks.push(await checkUrl("live.offer-mode", "/offer-mode", /Offer Mode/));
  checks.push(
    await checkUrl("live.notice-mode.packs", "/notice-mode", /State packs|TX/),
  );

  // DB catalog presence
  try {
    const db = new PrismaClient();
    const need = [
      "pay-or-quit-notice-drafter",
      "contractor-proposal-drafter",
      "job-offer-letter-drafter",
    ];
    const found = await db.calculationEngine.findMany({
      where: { slug: { in: need }, isActive: true },
      select: { slug: true },
    });
    const set = new Set(found.map((f) => f.slug));
    for (const slug of need) {
      checks.push({
        name: `db.${slug}`,
        ok: set.has(slug),
        detail: set.has(slug) ? "active" : "missing",
      });
    }
    const total = await db.calculationEngine.count({ where: { isActive: true } });
    checks.push({
      name: "db.engine_count",
      ok: total >= 520,
      detail: `${total} active`,
    });
    await db.$disconnect();
  } catch (e) {
    checks.push({
      name: "db.connect",
      ok: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }

  // Meta Graph token probe (read-only)
  if (env("META_PAGE_ACCESS_TOKEN") && env("INSTAGRAM_BUSINESS_ACCOUNT_ID")) {
    try {
      const igId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID!.trim();
      const token = process.env.META_PAGE_ACCESS_TOKEN!.trim();
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${igId}?fields=id,username&access_token=${encodeURIComponent(token)}`,
        { signal: AbortSignal.timeout(20_000) },
      );
      const data = (await res.json()) as {
        id?: string;
        username?: string;
        error?: { message: string };
      };
      checks.push({
        name: "meta.instagram",
        ok: Boolean(data.id && !data.error),
        detail: data.error?.message || `@${data.username || "?"} (${data.id || "no id"})`,
      });
    } catch (e) {
      checks.push({
        name: "meta.instagram",
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  // Stripe account ping (no charge)
  if (env("STRIPE_SECRET_KEY")) {
    try {
      const res = await fetch("https://api.stripe.com/v1/balance", {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
        signal: AbortSignal.timeout(20_000),
      });
      const data = (await res.json()) as { error?: { message: string }; available?: unknown };
      checks.push({
        name: "stripe.balance",
        ok: res.ok && !data.error,
        detail: data.error?.message || `HTTP ${res.status}`,
      });
    } catch (e) {
      checks.push({
        name: "stripe.balance",
        ok: false,
        detail: e instanceof Error ? e.message : String(e),
      });
    }
  }

  console.log(`\nApex full-stack smoke — ${BASE}\n`);
  let fail = 0;
  for (const c of checks) {
    const mark = c.ok ? "OK  " : "FAIL";
    if (!c.ok) fail += 1;
    console.log(`${mark}  ${c.name} — ${c.detail}`);
  }
  console.log(`\n${checks.length - fail}/${checks.length} passed\n`);
  if (fail) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
