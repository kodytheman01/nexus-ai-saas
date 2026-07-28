import Script from "next/script";

/**
 * GA4 (Google Analytics) site-wide tag, per Next.js's documented guidance for
 * loading analytics scripts in the root layout with `next/script`
 * (see node_modules/next/dist/docs/01-app/02-guides/scripts.md — "Analytics"
 * is listed as a recommended `afterInteractive` use case).
 *
 * Falls back to the production GA4 property ID if neither env var is set, so
 * analytics keeps working even if Netlify's env config is ever wiped/reset.
 */
export function GoogleAnalytics() {
  const measurementId =
    process.env.NEXT_PUBLIC_GA_ID ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    "G-VRBDF096T6";

  if (!measurementId) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
