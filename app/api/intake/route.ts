import { NextResponse } from "next/server";
import {
  INTAKE_SIGNWELL_REDIRECT,
  sendIntakeEmail,
  type IntakePayload,
} from "@/lib/send-intake-email";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as IntakePayload;

    await sendIntakeEmail(data);

    return NextResponse.json({
      success: true,
      message: "Intake received and routed to admin@apexcapitaladmin.com",
      redirectUrl: INTAKE_SIGNWELL_REDIRECT,
    });
  } catch (err) {
    console.error("Intake error:", err);
    const message = err instanceof Error ? err.message : "Intake failed";
    return NextResponse.json(
      {
        error: "Failed to process intake payload",
        details: message,
      },
      { status: 500 },
    );
  }
}
