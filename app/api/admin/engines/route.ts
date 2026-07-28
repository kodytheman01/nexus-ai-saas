import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const engines = await db.calculationEngine.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(engines);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Fetch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      slug,
      title,
      description,
      priceInUSD,
      inputLabel,
      inputPlaceholder,
      aiSystemPrompt,
      outputFormat = "markdown",
      category = "automation",
    } = body;

    if (!slug || !title || !aiSystemPrompt) {
      return NextResponse.json(
        { error: "slug, title, and aiSystemPrompt are required." },
        { status: 400 },
      );
    }

    const engine = await db.calculationEngine.upsert({
      where: { slug: String(slug).trim().toLowerCase() },
      update: {
        title,
        description: description || "",
        priceInUSD: Number(priceInUSD) || 19,
        inputLabel: inputLabel || "Describe your problem:",
        inputPlaceholder: inputPlaceholder || "",
        aiSystemPrompt,
        outputFormat,
        category,
      },
      create: {
        slug: String(slug).trim().toLowerCase(),
        title,
        description: description || "",
        priceInUSD: Number(priceInUSD) || 19,
        inputLabel: inputLabel || "Describe your problem:",
        inputPlaceholder: inputPlaceholder || "",
        aiSystemPrompt,
        outputFormat,
        category,
      },
    });

    return NextResponse.json({ success: true, engine }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upsert failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
