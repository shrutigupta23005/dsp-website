"use client";

export default function NoiseOverlay() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    >
      <svg style={{ display: "none" }}>
        <filter id="noise-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves={3}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        className="w-full h-full"
        style={{
          filter: "url(#noise-filter)",
          opacity: 0.035,
          mixBlendMode: "overlay",
          background: "white",
          animation: "grain 0.8s steps(8) infinite",
        }}
      />
    </div>
  );
}
