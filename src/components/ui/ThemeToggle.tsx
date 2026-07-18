"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Return placeholder to avoid layout shift
    return (
      <div
        className="relative h-7 w-14 rounded-full"
        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group relative flex h-7 w-14 items-center rounded-full transition-colors duration-200"
      style={{
        background: isDark ? "#1A1A1A" : "#F5F2EE",
        border: `1px solid ${isDark ? "#2A2A2A" : "#E2DDD6"}`,
      }}
      aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Sliding indicator */}
      <span
        className="absolute top-[2px] h-[22px] w-[22px] rounded-full transition-all duration-200 ease-out"
        style={{
          left: isDark ? "2px" : "calc(100% - 24px)",
          backgroundColor: "#C9933A",
        }}
      />

      {/* Moon icon (left side) */}
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        <Moon
          className="h-3.5 w-3.5 transition-colors duration-150"
          style={{
            color: isDark ? "#0A0A0A" : "#B0A090",
          }}
          strokeWidth={2}
        />
      </span>

      {/* Sun icon (right side) */}
      <span className="relative z-10 flex w-1/2 items-center justify-center">
        <Sun
          className="h-3.5 w-3.5 transition-colors duration-150"
          style={{
            color: isDark ? "#3A3A3A" : "#C9933A",
          }}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
