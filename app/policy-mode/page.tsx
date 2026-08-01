import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("policy")!;

export const metadata: Metadata = {
  title: "Policy Mode",
  description:
    "Policy Mode for Apex Capital Admin Services — PIPs, performance reviews, handbook sections, remote-work policy, onboarding and HR compliance checklists. Not employment counsel.",
  alternates: { canonical: `${appUrl}/policy-mode` },
};

export default function PolicyModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Fair PIPs and handbook drafts — before the meeting."
      subhead="Built for managers and HR who need a first-pass people-ops draft. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start PIP draft — $15"
      secondary={{
        href: "/engine/employee-handbook-section-generator?sample=1&focus=intake",
        label: "Or handbook section — $10",
      }}
      faqs={[
        {
          q: "Is a PIP from Apex employment counsel?",
          a: "No. Drafts only. Have HR or employment counsel review before you issue a PIP or publish policy.",
        },
        {
          q: "What is the primary money path?",
          a: "Performance Improvement Plan at $15 via /go/policy. Handbook and review write-ups are one tap away.",
        },
        {
          q: "How is this different from Offer Mode?",
          a: "Offer Mode is hire / promote / close letters. Policy Mode is PIPs, handbook sections, and ongoing people-ops drafts.",
        },
      ]}
    />
  );
}
