"use client";

export default function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="fixed top-0 left-1/2 -translate-x-1/2 -translate-y-full focus:translate-y-0 z-[99999] px-6 py-3 text-sm font-semibold rounded-b-lg transition-transform duration-200"
      style={{
        backgroundColor: "#C9933A",
        color: "#0A0A0A",
        fontFamily: "var(--font-body)",
      }}
    >
      Skip to main content
    </a>
  );
}
