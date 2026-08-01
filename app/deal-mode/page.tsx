import type { Metadata } from "next";
import { ModeHubPage } from "@/app/components/ModeHubPage";
import { getModeAdPack } from "@/config/mode-catalog";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const pack = getModeAdPack("deal")!;

export const metadata: Metadata = {
  title: "Deal Mode",
  description:
    "Deal Mode — LOI outlines, term sheets, NDAs, closing checklists, and partnership MOUs. Not transactional counsel.",
  alternates: { canonical: `${appUrl}/deal-mode` },
};

export default function DealModePage() {
  return (
    <ModeHubPage
      pack={pack}
      headline="Handshake yesterday. LOI still blank."
      subhead="Built for founders and buyers who need a first-pass deal outline. Pay once, draft in about a minute — then edit."
      primaryCtaLabel="Start LOI outline — $24"
      secondary={{
        href: "/engine/term-sheet-outline?sample=1&focus=intake",
        label: "Or term sheet — $24",
      }}
      faqs={[
        {
          q: "Is an LOI from Apex binding?",
          a: "Drafts only. Which clauses bind is a counsel question — we mark common patterns; we do not make them binding for you.",
        },
        {
          q: "Primary money path?",
          a: "Letter of Intent outline at $24 via /go/deal.",
        },
        {
          q: "Same checkout as Grant Mode?",
          a: "Yes. Same Apex Stripe checkout and optional human review.",
        },
      ]}
    />
  );
}
