/**
 * JSON-LD helpers for richer Google results (Organization + Product/Offer).
 */
export function OrganizationJsonLd() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Apex Capital Admin Services",
    url: appUrl,
    email: "admin@apexcapitaladmin.com",
    description:
      "Specialized knowledge engines that convert inputs into professional-grade deliverables.",
    sameAs: [],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function ProductJsonLd({
  name,
  description,
  slug,
  priceInUSD,
}: {
  name: string;
  description: string;
  slug: string;
  priceInUSD: number;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://apexcapitaladmin.com";
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url: `${appUrl}/engine/${slug}`,
    brand: {
      "@type": "Brand",
      name: "Apex Capital Admin Services",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: String(priceInUSD),
      availability: "https://schema.org/InStock",
      url: `${appUrl}/engine/${slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
