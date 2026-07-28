/**
 * Proxies Stripe webhook calls to the Next.js API route.
 * Stripe endpoint: /.netlify/functions/stripe-webhook
 */
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const base =
    process.env.URL ||
    process.env.DEPLOY_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://apexcapitaladmin.com";

  const target = `${base.replace(/\/$/, "")}/api/webhooks/stripe`;

  try {
    const res = await fetch(target, {
      method: "POST",
      headers: {
        "content-type":
          event.headers["content-type"] || event.headers["Content-Type"] || "application/json",
        "stripe-signature":
          event.headers["stripe-signature"] || event.headers["Stripe-Signature"] || "",
      },
      body: event.body,
    });

    const body = await res.text();
    return {
      statusCode: res.status,
      headers: { "Content-Type": "application/json" },
      body,
    };
  } catch (err) {
    console.error("stripe-webhook proxy error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
