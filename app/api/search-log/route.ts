import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/** Log catalog searches so we can see what visitors want next. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = String(body.query || "").trim().slice(0, 200);
    const resultCount = Number.isFinite(body.resultCount)
      ? Math.max(0, Math.min(10_000, Number(body.resultCount)))
      : 0;
    const source = String(body.source || "catalog").slice(0, 40);

    if (query.length < 2) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await db.searchQuery.create({
      data: { query, resultCount, source },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("search-log error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

/** Aggregated search demand for admin / product decisions. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") || 40)));

  try {
    const rows = await db.searchQuery.groupBy({
      by: ["query"],
      _count: { query: true },
      _avg: { resultCount: true },
      orderBy: { _count: { query: "desc" } },
      take: limit,
    });

    return NextResponse.json({
      topQueries: rows.map((r) => ({
        query: r.query,
        searches: r._count.query,
        avgResults: r._avg.resultCount ?? 0,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "lookup failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
