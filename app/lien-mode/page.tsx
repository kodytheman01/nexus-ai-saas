import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("lien")!;

export const metadata: Metadata = {
  title: "Lien Mode",
  description:
    "Lien Mode — preliminary notices, mechanic's lien claim outlines, waivers, and intent-to-lien drafts. Not legal advice.",
  alternates: { canonical: `${appUrl}/lien-mode` },
};

export default function LienModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Unpaid invoice. Need a prelim notice before rights slip."
      subhead="Built for trades and suppliers who need a first-pass paper trail. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start preliminary notice — $19"
      secondary={{
        href: "/engine/intent-to-lien-notice?sample=1&focus=intake",
        label: "Or intent to lien — $19",
      }}
      faqs={[
        {
          q: "Does this perfect my lien rights?",
          a: "No. Drafts only. Deadlines and forms are state-specific. Confirm with counsel before serving or recording.",
        },
        {
          q: "Primary money path?",
          a: "Preliminary notice at $19 via /go/lien.",
        },
        {
          q: "Same checkout as Bid Mode?",
          a: "Yes. Same Apex Stripe checkout and optional human review.",
        },
      ]}
    />
  );
}
