import nodemailer from "nodemailer";
import { displayTitle } from "@/lib/display";
import { NOTICE_PRIMARY_SLUG } from "@/config/conversion";

function looksLikeEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function transporter() {
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailPass) return null;
  const gmailUser = process.env.GMAIL_USER || "admin@apexcapitaladmin.com";
  return {
    gmailUser,
    mailer: nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass },
    }),
  };
}

export async function sendAbandonedCheckoutEmail(opts: {
  to: string;
  engineTitle: string;
  engineSlug: string;
  step: 1 | 2;
}): Promise<boolean> {
  const tx = transporter();
  if (!tx || !looksLikeEmail(opts.to)) return false;

  const origin =
    process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
  const resumeUrl = `${origin}/engine/${opts.engineSlug}?sample=1&focus=intake&utm_source=email&utm_medium=drip&utm_campaign=abandoned_checkout&utm_content=${encodeURIComponent(opts.engineSlug)}`;
  const noticeUrl = `${origin}/go/notice?utm_source=email&utm_medium=drip&utm_campaign=finish_pay_or_quit`;
  const title = displayTitle(opts.engineTitle);

  const isNoticePrimary = opts.engineSlug === NOTICE_PRIMARY_SLUG;
  const subject =
    opts.step === 1
      ? `Finish your ${title} draft?`
      : isNoticePrimary
        ? "Still need that pay-or-quit draft?"
        : `Your ${title} checkout is still open`;

  const body =
    opts.step === 1
      ? [
          `You started a ${title} checkout on Apex Capital Admin Services but didn't finish payment.`,
          "",
          "Your intake is ready to resume — sample facts load in one tap if you want a clean restart:",
          resumeUrl,
          "",
          "Stripe-secured · typically under 60 seconds after payment · optional human review.",
          "Drafts are informational — not legal or professional advice.",
          "",
          "— Apex Capital Admin Services",
          "admin@apexcapitaladmin.com",
        ].join("\n")
      : [
          isNoticePrimary
            ? "Quick follow-up: if you still need a pay-or-quit / rent demand first-pass draft, the Notice Mode path is here:"
            : `Quick follow-up on ${title}:`,
          "",
          isNoticePrimary ? noticeUrl : resumeUrl,
          "",
          "If you already completed checkout, you can ignore this note.",
          "",
          "— Apex Capital Admin Services",
        ].join("\n");

  await tx.mailer.sendMail({
    from: `"Apex Capital Admin" <${tx.gmailUser}>`,
    to: opts.to,
    subject,
    text: body,
  });
  return true;
}
