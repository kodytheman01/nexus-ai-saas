import nodemailer from "nodemailer";

export type IntakePayload = {
  engineSlug?: string;
  userInput?: string;
  userEmail?: string;
  name?: string;
  phone?: string;
  message?: string;
  email?: string;
};

export function formatIntakeEmailBody(data: IntakePayload): string {
  const { engineSlug, userInput, userEmail, name, phone, message } = data;
  const fromEmail = userEmail || data.email || "N/A";

  return [
    "=== APEX CAPITAL ADMIN INTAKE ===",
    `Date: ${new Date().toISOString()}`,
    `From: ${name || "Lead"} <${fromEmail}>`,
    `Phone: ${phone || "N/A"}`,
    "",
    `Engine/Service: ${engineSlug || "General Inquiry"}`,
    "Input Parameters / Message:",
    userInput || message || "No input details provided.",
  ].join("\n");
}

export async function sendIntakeEmail(data: IntakePayload): Promise<void> {
  const gmailUser = process.env.GMAIL_USER || "admin@apexcapitaladmin.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailPass) {
    throw new Error("GMAIL_APP_PASSWORD is not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass,
    },
  });

  const engineSlug = data.engineSlug;

  await transporter.sendMail({
    from: `"Apex Capital Intake" <${gmailUser}>`,
    to: "admin@apexcapitaladmin.com",
    subject: `[NEW INTAKE] ${engineSlug ? `Engine: ${engineSlug}` : "Website Lead"}`,
    text: formatIntakeEmailBody(data),
  });
}

export const INTAKE_SIGNWELL_REDIRECT =
  process.env.INTAKE_REDIRECT_URL ||
  "https://www.signwell.com/app/templates";
