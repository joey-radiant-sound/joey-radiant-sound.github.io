import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Radiant Sound — A Cappella";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          width: "100%",
          height: "100%",
          padding: "80px",
          color: "white",
          backgroundImage:
            "linear-gradient(135deg, #0a1628 0%, #1a3a60 55%, #3a89c9 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <p style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.8, margin: 0 }}>
          Radiant Sound · A Cappella
        </p>
        <p style={{ fontSize: 88, fontWeight: 600, lineHeight: 1.05, margin: "24px 0 0 0" }}>
          Production built for voices.
        </p>
      </div>
    ),
    size,
  );
}
