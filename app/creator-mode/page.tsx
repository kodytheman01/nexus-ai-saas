import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("creator")!;

export const metadata: Metadata = {
  title: "Creator Mode",
  description:
    "Creator Mode — brand deal terms, usage licenses, deliverable invoices, and cancellation notices. Not entertainment counsel.",
  alternates: { canonical: `${appUrl}/creator-mode` },
};

export default function CreatorModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Brand deal in DMs. Put the terms on paper."
      subhead="Built for creators and agencies who need clean first-pass deal docs. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start brand deal terms — $24"
      secondary={{
        href: "/engine/content-usage-license-drafter?sample=1&focus=intake",
        label: "Or usage license — $19",
      }}
      faqs={[
        {
          q: "Is this entertainment counsel?",
          a: "No. Drafts only. Have counsel review before signing, licensing, or canceling.",
        },
        {
          q: "Primary money path?",
          a: "Brand deal terms at $24 via /go/creator.",
        },
        {
          q: "Same checkout as the rest of Apex?",
          a: "Yes. Stripe checkout, instant draft, optional human review.",
        },
      ]}
    />
  );
}
