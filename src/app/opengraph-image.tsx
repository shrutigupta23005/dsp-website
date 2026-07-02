import { ImageResponse } from "next/og";

export const alt = "Delhi Shoe Palace — 24 Years of Trust in Footwear";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#0A0A0A",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: "linear-gradient(90deg, #C9933A, #E5AC52, #C9933A)",
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#C9933A",
            letterSpacing: "0.15em",
            marginBottom: 16,
          }}
        >
          DELHI SHOE PALACE
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "#6B6B6B",
            marginBottom: 32,
          }}
        >
          24 Years of Trust in Footwear
        </div>

        {/* Divider */}
        <div
          style={{
            width: 96,
            height: 2,
            backgroundColor: "#C9933A",
            marginBottom: 32,
          }}
        />

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            alignItems: "center",
          }}
        >
          {["200+ Brands", "5000+ Customers", "Est. 2001"].map(
            (stat, i) => (
              <div
                key={i}
                style={{
                  fontSize: 16,
                  color: "#3A3A3A",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {stat}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            right: 32,
            fontSize: 14,
            color: "#3A3A3A",
          }}
        >
          delhishoepalace.com
        </div>
      </div>
    ),
    { ...size }
  );
}
