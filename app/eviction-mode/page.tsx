import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("eviction")!;

export const metadata: Metadata = {
  title: "Eviction Mode",
  description:
    "Eviction Mode — possession demand packs, filing checklists, service logs, and court calendar briefs. Not legal advice.",
  alternates: { canonical: `${appUrl}/eviction-mode` },
};

export default function EvictionModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Notice period done. Organize the possession pack."
      subhead="Built for landlords and PMs who need structured filing prep — not a blank Word doc. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start possession pack — $24"
      secondary={{
        href: "/engine/eviction-filing-checklist?sample=1&focus=intake",
        label: "Or filing checklist — $19",
      }}
      faqs={[
        {
          q: "Is this a court form?",
          a: "No. Educational drafts and checklists only. Local forms, fees, and service rules require counsel or the court clerk.",
        },
        {
          q: "Primary money path?",
          a: "Possession demand pack outline at $24 via /go/eviction.",
        },
        {
          q: "How does this relate to Notice Mode?",
          a: "Notice Mode is pay-or-quit and lease notices. Eviction Mode is post-notice filing prep and hearing organization.",
        },
      ]}
    />
  );
}
