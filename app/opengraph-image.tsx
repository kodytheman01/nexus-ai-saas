import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Apex Capital Admin Services — draft-ready deliverable engines";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1f3a",
          padding: "64px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#c9a227",
            fontSize: 28,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            fontWeight: 700,
          }}
        >
          Apex Capital Admin Services
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#f7f5f0",
              fontSize: 64,
              lineHeight: 1.1,
              maxWidth: 980,
            }}
          >
            Draft-ready grants, notices, contracts, and ops.
          </div>
          <div
            style={{
              color: "rgba(247,245,240,0.7)",
              fontSize: 28,
              maxWidth: 900,
              fontFamily: "sans-serif",
            }}
          >
            11 Modes · 500+ engines · Stripe · optional human
            review
          </div>
        </div>
        <div
          style={{
            display: "flex",
            color: "#c9a227",
            fontSize: 24,
            fontFamily: "sans-serif",
            fontWeight: 600,
          }}
        >
          apexcapitaladmin.com
        </div>
      </div>
    ),
    { ...size },
  );
}
