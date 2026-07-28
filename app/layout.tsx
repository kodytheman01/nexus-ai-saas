import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { DisclaimerFooter, SiteNav } from "./components/SiteChrome";
import { GoogleAnalytics } from "./components/GoogleAnalytics";
import { MetaPixel } from "./components/MetaPixel";
import { AttributionCapture } from "./components/AttributionCapture";
import { SupportChatWidget } from "./components/SupportChatWidget";
import { OrganizationJsonLd } from "./components/JsonLd";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
const siteTitle = "Apex Capital Admin Services | Automated Advisory & Deliverable Engines";
const siteDescription =
  "Apex Capital Admin Services — 500 specialized engines that turn your intake into structured drafts. Stripe checkout, instant delivery, optional human review.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: siteTitle,
    template: "%s | Apex Capital Admin Services",
  },
  description: siteDescription,
  keywords: [
    "Apex Capital Admin Services",
    "automated deliverables",
    "business document generator",
    "NDA generator",
    "Stripe checkout engines",
    "instant professional templates",
    "AI business tools",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: appUrl,
    siteName: "Apex Capital Admin Services",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  ...(process.env.GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f7f5f0] text-[#1c2230] antialiased">
        <GoogleAnalytics />
        <MetaPixel />
        <AttributionCapture />
        <OrganizationJsonLd />
        <SiteNav />
        <main className="flex-1">{children}</main>
        <DisclaimerFooter />
        <SupportChatWidget />
      </body>
    </html>
  );
}
