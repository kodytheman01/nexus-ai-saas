import Link from "next/link";
import { Suspense } from "react";
import { NavSearch, NavSearchMobile } from "./NavSearch";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#0b1f3a]/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0b1f3a] text-sm font-bold text-[#c9a227]">
            A
          </span>
          <div className="hidden leading-tight sm:block">
            <div className="text-sm font-bold tracking-tight text-[#0b1f3a]">
              Apex Capital
            </div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#0b1f3a]/50">
              Admin Services
            </div>
          </div>
        </Link>

        <Suspense fallback={<div className="mx-3 hidden h-9 flex-1 md:block" />}>
          <NavSearch />
        </Suspense>

        <nav className="ml-auto flex shrink-0 items-center gap-2.5 text-sm font-medium text-[#0b1f3a]/70 sm:gap-4">
          <Link href="/modes" className="transition hover:text-[#0b1f3a]">
            Modes
          </Link>
          <Link
            href="/grant-mode"
            className="hidden transition hover:text-[#0b1f3a] sm:inline"
          >
            Grant
          </Link>
          <Link
            href="/notice-mode"
            className="hidden transition hover:text-[#0b1f3a] sm:inline"
          >
            Notice
          </Link>
          <Link
            href="/vision"
            className="hidden transition hover:text-[#0b1f3a] md:inline"
          >
            Vision
          </Link>
          <Link
            href="/platform"
            className="hidden transition hover:text-[#0b1f3a] lg:inline"
          >
            Platform
          </Link>
          <Link
            href="/how-it-works"
            className="hidden transition hover:text-[#0b1f3a] lg:inline"
          >
            How it works
          </Link>
          <Link
            href="/faq"
            className="hidden transition hover:text-[#0b1f3a] xl:inline"
          >
            FAQ
          </Link>
          <Link href="/#catalog" className="hidden transition hover:text-[#0b1f3a] xl:inline">
            Engines
          </Link>
          <Link href="/about" className="transition hover:text-[#0b1f3a]">
            About
          </Link>
        </nav>
      </div>
      <div className="border-t border-[#0b1f3a]/5 px-4 py-2 md:hidden">
        <Suspense fallback={null}>
          <NavSearchMobile />
        </Suspense>
      </div>
    </header>
  );
}

export function DisclaimerFooter() {
  return (
    <footer className="mt-auto border-t border-[#0b1f3a]/10 bg-[#0b1f3a]">
      <div className="mx-auto max-w-6xl px-4 py-8 text-xs leading-relaxed text-white/60">
        <p>
          <strong className="text-white/90">Disclaimer:</strong> Outputs are
          informational drafts for structural reference. They are not licensed
          legal, financial, tax, medical, housing, or engineering advice, and no
          advisor-client relationship is created. Landlord-tenant and grant
          rules vary by jurisdiction — confirm with a qualified professional
          before serving, filing, or submitting.
        </p>
        <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/40">
          <span>
            © {new Date().getFullYear()} Apex Capital Admin Services. All
            rights reserved.
          </span>
          <Link href="/modes" className="transition hover:text-white/70">
            Modes
          </Link>
          <Link href="/vision" className="transition hover:text-white/70">
            Vision
          </Link>
          <Link href="/grant-mode" className="transition hover:text-white/70">
            Grant Mode
          </Link>
          <Link href="/notice-mode" className="transition hover:text-white/70">
            Notice Mode
          </Link>
          <Link href="/tenant-mode" className="transition hover:text-white/70">
            Tenant Mode
          </Link>
          <Link href="/bid-mode" className="transition hover:text-white/70">
            Bid Mode
          </Link>
          <Link href="/offer-mode" className="transition hover:text-white/70">
            Offer Mode
          </Link>
          <Link href="/policy-mode" className="transition hover:text-white/70">
            Policy Mode
          </Link>
          <Link href="/collect-mode" className="transition hover:text-white/70">
            Collect Mode
          </Link>
          <Link href="/lien-mode" className="transition hover:text-white/70">
            Lien Mode
          </Link>
          <Link href="/eviction-mode" className="transition hover:text-white/70">
            Eviction Mode
          </Link>
          <Link href="/creator-mode" className="transition hover:text-white/70">
            Creator Mode
          </Link>
          <Link href="/deal-mode" className="transition hover:text-white/70">
            Deal Mode
          </Link>
          <Link href="/platform" className="transition hover:text-white/70">
            Platform
          </Link>
          <Link href="/how-it-works" className="transition hover:text-white/70">
            How it works
          </Link>
          <Link href="/faq" className="transition hover:text-white/70">
            FAQ
          </Link>
          <Link href="/brand" className="transition hover:text-white/70">
            Brand
          </Link>
          <Link href="/about" className="transition hover:text-white/70">
            About
          </Link>
          <Link href="/terms" className="transition hover:text-white/70">
            Terms of Service
          </Link>
          <Link href="/privacy" className="transition hover:text-white/70">
            Privacy Policy
          </Link>
          <a
            href="mailto:admin@apexcapitaladmin.com"
            className="transition hover:text-white/70"
          >
            admin@apexcapitaladmin.com
          </a>
          <a href="tel:+12145063083" className="transition hover:text-white/70">
            (214) 506-3083
          </a>
        </p>
      </div>
    </footer>
  );
}
