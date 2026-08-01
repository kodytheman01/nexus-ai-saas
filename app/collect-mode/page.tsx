import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("collect")!;

export const metadata: Metadata = {
  title: "Collect Mode",
  description:
    "Collect Mode for Apex Capital Admin Services — unpaid invoice demand letters, careful C&D scaffolds, and invoice-to-payment reconciliation plans. Not legal advice.",
  alternates: { canonical: `${appUrl}/collect-mode` },
};

export default function CollectModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Unpaid invoice. Soft emails failed. Need a real demand."
      subhead="Built for freelancers and SMB finance who need a firm first-pass collection draft. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start demand letter — $12"
      secondary={{
        href: "/engine/invoice-to-payment-reconciliation-automation-designer?sample=1&focus=intake",
        label: "Or reconciliation plan — $15",
      }}
      faqs={[
        {
          q: "Is this licensed debt collection?",
          a: "No. Drafts only — not legal advice or a collection license. Have counsel review before sending demand letters.",
        },
        {
          q: "What is the primary money path?",
          a: "Demand letter for unpaid invoice at $12 via /go/collect.",
        },
        {
          q: "Same checkout as Grant Mode?",
          a: "Yes. Same Apex Stripe checkout, instant draft, email copy, and optional human review.",
        },
      ]}
    />
  );
}
