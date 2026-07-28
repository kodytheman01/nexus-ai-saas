"use client";

import Link from "next/link";

export function EngineCanceledBanner() {
  return (
    <div className="mb-6 rounded-lg border border-[#c9a227]/35 bg-[#c9a227]/10 px-4 py-3 text-sm text-[#1c2230]/80">
      Checkout was canceled — your draft is still here when you&apos;re ready.{" "}
      <Link href="#intake" className="font-semibold text-[#0b1f3a] underline underline-offset-2">
        Resume intake below
      </Link>
      .
    </div>
  );
}
