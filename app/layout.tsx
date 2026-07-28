import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { DisclaimerFooter, SiteNav } from "./components/SiteChrome";
import { GoogleAnalytics } from "./components/GoogleAnalytics";

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
  "Apex Capital Admin Services operates a suite of specialized knowledge engines that convert your inputs into professional-grade deliverables — secured by Stripe, generated instantly.";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: siteTitle,
    template: "%s | Apex Capital Admin Services",
  },
  description: siteDescription,
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
        <SiteNav />
        <main className="flex-1">{children}</main>
        <DisclaimerFooter />
      </body>
    </html>
  );
}
