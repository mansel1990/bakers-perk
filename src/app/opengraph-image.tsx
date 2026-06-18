import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Baker's Perk — Handcrafted cakes in Chennai";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#2c4032",
          color: "#eef3e4",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 8, textTransform: "uppercase", color: "#c97a90" }}>
          Chennai · Made to order
        </div>
        <div style={{ display: "flex", alignItems: "baseline", marginTop: 16 }}>
          <div style={{ fontSize: 132, fontWeight: 700, lineHeight: 1 }}>Baker&apos;s Perk</div>
          <div style={{ fontSize: 132, fontWeight: 700, color: "#c97a90" }}>.</div>
        </div>
        <div style={{ fontSize: 40, marginTop: 28, color: "#9fb298", maxWidth: 900 }}>
          Handcrafted cakes, cheesecakes &amp; bakes by Chef Alex.
        </div>
      </div>
    ),
    { ...size }
  );
}
