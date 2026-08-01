import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";

export const metadata: Metadata = {
  title: "Brand",
  description:
    "Apex Capital Admin Services brand assets — logo, cover art, colors, and usage notes for partners and press.",
  alternates: { canonical: `${appUrl}/brand` },
};

const colors = [
  { name: "Navy", hex: "#0b1f3a", note: "Primary surfaces, type, CTAs" },
  { name: "Gold", hex: "#c9a227", note: "Accent, emphasis, hover lift" },
  { name: "Cream", hex: "#f7f5f0", note: "Page backgrounds, soft panels" },
  { name: "Ink", hex: "#1c2230", note: "Body copy at ~70% opacity" },
];

export default function BrandPage() {
  return (
    <div>
      <section className="border-b border-[#0b1f3a]/10 bg-[#0b1f3a]">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a227]">
            Brand kit
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold tracking-tight text-[#f7f5f0] sm:text-5xl">
            Apex Capital Admin Services
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/70">
            Official marks and colors for partners, press, and operators
            referencing the platform. Prefer these assets over screenshots of
            the nav mark alone.
          </p>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-[#f7f5f0]">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Logo &amp; cover
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#1c2230]/65">
            Download or hotlink from the live site. Do not stretch, recolor, or
            add drop shadows.
          </p>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <figure className="rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
              <div className="flex items-center justify-center rounded-md bg-[#0b1f3a] p-8">
                <Image
                  src="/brand/apex-logo-profile.png"
                  alt="Apex Capital Admin Services logo"
                  width={240}
                  height={240}
                  className="h-40 w-40 object-contain"
                />
              </div>
              <figcaption className="mt-4 text-sm text-[#1c2230]/70">
                Profile / square logo
              </figcaption>
              <a
                href="/brand/apex-logo-profile.png"
                className="mt-2 inline-block text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
                download
              >
                Download PNG
              </a>
            </figure>
            <figure className="rounded-lg border border-[#0b1f3a]/10 bg-white p-6">
              <div className="overflow-hidden rounded-md border border-[#0b1f3a]/10">
                <Image
                  src="/brand/apex-cover-facebook.png"
                  alt="Apex Capital Admin Services cover art"
                  width={1200}
                  height={630}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-sm text-[#1c2230]/70">
                Cover / social banner
              </figcaption>
              <a
                href="/brand/apex-cover-facebook.png"
                className="mt-2 inline-block text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
                download
              >
                Download PNG
              </a>
            </figure>
          </div>
        </div>
      </section>

      <section className="border-b border-[#0b1f3a]/10 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <h2 className="font-display text-2xl font-semibold text-[#0b1f3a]">
            Colors
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {colors.map((c) => (
              <div
                key={c.hex}
                className="overflow-hidden rounded-lg border border-[#0b1f3a]/10"
              >
                <div className="h-20" style={{ backgroundColor: c.hex }} />
                <div className="bg-[#f7f5f0] px-3 py-3">
                  <p className="text-sm font-semibold text-[#0b1f3a]">{c.name}</p>
                  <p className="font-mono text-xs text-[#1c2230]/60">{c.hex}</p>
                  <p className="mt-1 text-[11px] text-[#1c2230]/55">{c.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f5f0]">
        <div className="mx-auto max-w-3xl px-4 py-14">
          <h2 className="font-display text-xl font-semibold text-[#0b1f3a]">
            Usage notes
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[#1c2230]/70">
            <li>Lead with the full name: Apex Capital Admin Services.</li>
            <li>
              Prefer navy + gold; avoid purple gradients or inventing new
              primary colors.
            </li>
            <li>
              Never imply licensed legal, CPA, or grant-making authority when
              using the mark.
            </li>
            <li>
              Questions:{" "}
              <a
                href="mailto:admin@apexcapitaladmin.com"
                className="font-semibold text-[#0b1f3a] underline underline-offset-2"
              >
                admin@apexcapitaladmin.com
              </a>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/platform"
              className="text-sm font-semibold text-[#0b1f3a] underline decoration-[#c9a227] decoration-2 underline-offset-4"
            >
              Platform
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-[#0b1f3a]/70 underline underline-offset-4"
            >
              About
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
