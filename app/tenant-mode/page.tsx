import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("tenant")!;

export const metadata: Metadata = {
  title: "Tenant Mode",
  description:
    "Tenant Mode for Apex Capital Admin Services — repair requests, rent-withholding caution drafts, lease-break letters, move-out checklists, and roommate outlines. Not legal advice.",
  alternates: { canonical: `${appUrl}/tenant-mode` },
};

export default function TenantModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Need it in writing — repair, exit, or roommate rules."
      subhead="Built for renters who need a clear paper trail. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start repair request — $15"
      secondary={{
        href: "/engine/lease-break-request-letter?sample=1&focus=intake",
        label: "Or lease break — $19",
      }}
      faqs={[
        {
          q: "Is this legal advice for tenants?",
          a: "No. Drafts only. Confirm local tenant protections before you withhold rent, break a lease, or escalate.",
        },
        {
          q: "What is the primary money path?",
          a: "Tenant repair request at $15 via /go/tenant. Lease-break and rent-withholding drafts are one tap away.",
        },
        {
          q: "Same checkout as the rest of Apex?",
          a: "Yes. Same Stripe checkout, instant draft, email copy, and optional human review.",
        },
      ]}
    />
  );
}
