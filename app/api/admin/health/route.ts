import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Boolean health only — never returns secret values. */
export async function GET() {
  try {
    let engineCount = 0;
    let pendingReviews = 0;
    let completedLast7d = 0;
    let failedLast7d = 0;
    let recentFailures: {
      stripeSessionId: string;
      engineSlug: string;
      createdAt: Date;
      preview: string;
    }[] = [];
    let dbOk = false;

    try {
      engineCount = await db.calculationEngine.count({ where: { isActive: true } });
      pendingReviews = await db.engineRun.count({
        where: { humanReview: true, status: "completed" },
      });
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      completedLast7d = await db.engineRun.count({
        where: { status: "completed", createdAt: { gte: weekAgo } },
      });
      failedLast7d = await db.engineRun.count({
        where: { status: "failed", createdAt: { gte: weekAgo } },
      });
      const fails = await db.engineRun.findMany({
        where: { status: "failed" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          stripeSessionId: true,
          engineSlug: true,
          createdAt: true,
          outputData: true,
        },
      });
      recentFailures = fails.map((f) => ({
        stripeSessionId: f.stripeSessionId,
        engineSlug: f.engineSlug,
        createdAt: f.createdAt,
        preview: (f.outputData || "").slice(0, 180),
      }));
      dbOk = true;
    } catch {
      dbOk = false;
    }

    return NextResponse.json({
      database: dbOk,
      engineCount,
      pendingHumanReviews: pendingReviews,
      completedRunsLast7d: completedLast7d,
      failedRunsLast7d: failedLast7d,
      recentFailures,
      env: {
        OPENAI_API_KEY: Boolean(process.env.OPENAI_API_KEY),
        STRIPE_SECRET_KEY: Boolean(process.env.STRIPE_SECRET_KEY),
        STRIPE_WEBHOOK_SECRET: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
        GMAIL_APP_PASSWORD: Boolean(process.env.GMAIL_APP_PASSWORD),
        GOOGLE_SITE_VERIFICATION: Boolean(process.env.GOOGLE_SITE_VERIFICATION),
        NEXT_PUBLIC_GA_ID: Boolean(
          process.env.NEXT_PUBLIC_GA_ID || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        ),
        NEXT_PUBLIC_META_PIXEL_ID: Boolean(process.env.NEXT_PUBLIC_META_PIXEL_ID),
        OPS_DASHBOARD_PASSWORD: Boolean(process.env.OPS_DASHBOARD_PASSWORD),
        NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL),
      },
      stripeMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_live")
        ? "live"
        : process.env.STRIPE_SECRET_KEY?.startsWith("sk_test")
          ? "test"
          : "missing",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Health check failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
