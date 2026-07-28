import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { inngest } from "@/lib/inngest";
import { processEngineExecution } from "@/lib/process-engine";
import { runAfterResponse } from "@/lib/run-after-response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stripeSessionId = String(body.stripeSessionId || "").trim();
    const newUserInput = String(body.newUserInput || "").trim();

    if (!stripeSessionId || newUserInput.length < 10) {
      return NextResponse.json(
        { error: "Valid session id and new input required." },
        { status: 400 },
      );
    }

    const currentRun = await db.engineRun.findUnique({
      where: { stripeSessionId },
    });

    if (!currentRun || currentRun.allowanceTokens <= 0) {
      return NextResponse.json(
        { error: "No regenerate tokens remaining." },
        { status: 400 },
      );
    }

    await db.engineRun.update({
      where: { stripeSessionId },
      data: {
        inputParameters: newUserInput,
        status: "pending",
        outputData: null,
        allowanceTokens: currentRun.allowanceTokens - 1,
      },
    });

    try {
      await inngest.send({
        name: "engine/payment.success",
        data: {
          stripeSessionId,
          engineSlug: currentRun.engineSlug,
          userInput: newUserInput,
          userEmail: currentRun.userEmail,
        },
      });
    } catch {
      runAfterResponse(async () => {
        await processEngineExecution({
          stripeSessionId,
          engineSlug: currentRun.engineSlug,
          userInput: newUserInput,
        });
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Regenerate failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
