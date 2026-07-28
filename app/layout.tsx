import type { Metadata } from "next";
import { Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { DisclaimerFooter, SiteNav } from "./components/SiteChrome";

const display = Source_Serif_4({
  variable: "--font-display",
  subsets: ["latin"],
});

const sans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nexus Engines | Problem-to-Asset Factory",
  description:
    "Pay once, unlock a turnkey micro-asset generated from specialized knowledge engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#f6f3ee] text-zinc-900 antialiased">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <DisclaimerFooter />
      </body>
    </html>
  );
}
