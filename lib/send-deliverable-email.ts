import nodemailer from "nodemailer";
import { displayTitle } from "@/lib/display";

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function sendDeliverableEmail(opts: {
  to: string;
  engineTitle: string;
  engineSlug: string;
  output: string;
  humanReview?: boolean;
  sessionId: string;
}): Promise<boolean> {
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailPass || !looksLikeEmail(opts.to)) return false;

  const gmailUser = process.env.GMAIL_USER || "admin@apexcapitaladmin.com";
  const title = displayTitle(opts.engineTitle);
  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
  const successUrl = `${origin}/success?session_id=${encodeURIComponent(opts.sessionId)}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: gmailUser, pass: gmailPass },
  });

  const reviewNote = opts.humanReview
    ? "\n\nHuman specialist review was requested. Apex ops will email follow-up notes within 1 business day.\n"
    : "\n";

  await transporter.sendMail({
    from: `"Apex Capital Admin" <${gmailUser}>`,
    to: opts.to,
    subject: `Receipt & deliverable: ${title} · Order ${opts.sessionId.slice(0, 20)}`,
    text: [
      `Apex Capital Admin Services — order receipt`,
      "",
      `Order ID: ${opts.sessionId}`,
      `Engine: ${title}`,
      `Legal entity: Apex Capital Admin Services (Texas, USA)`,
      `Support: ${gmailUser} · Mon–Fri 9am–5pm Central`,
      "",
      `Your deliverable is ready.`,
      `View online (bookmark this): ${successUrl}`,
      "",
      "Stripe sends a separate payment receipt for your records.",
      reviewNote,
      "--- DELIVERABLE ---",
      "",
      opts.output,
      "",
      "---",
      "Informational draft only — not licensed legal, financial, tax, or medical advice.",
      "Do not reply with SSNs, PHI, or secrets.",
      "Apex Capital Admin Services · admin@apexcapitaladmin.com · (214) 506-3083",
    ].join("\n"),
    attachments: [
      {
        filename: `${opts.engineSlug}.md`,
        content: opts.output,
        contentType: "text/markdown; charset=utf-8",
      },
    ],
  });

  return true;
}
