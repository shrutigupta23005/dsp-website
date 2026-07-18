"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorState = "default" | "hover" | "product" | "zoom" | "danger" | "click";

export default function CustomCursor() {
  const [cursorState, setCursorState] = useState<CursorState>("default");
  const [isTouch, setIsTouch] = useState(true); // default true to avoid flash
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const baseStateRef = useRef<CursorState>("default");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible]
  );

  useEffect(() => {
    // Check for touch device
    if (typeof window === "undefined") return;
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    // Add custom cursor class to html
    document.documentElement.classList.add("custom-cursor-active");

    // Mouse movement
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", () => setIsVisible(false));
    window.addEventListener("mouseenter", () => setIsVisible(true));

    // Click states
    const onMouseDown = () => setCursorState("click");
    const onMouseUp = () => setCursorState(baseStateRef.current);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Hover delegation
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check data-cursor attributes first
      const cursorEl = target.closest("[data-cursor]");
      if (cursorEl) {
        const val = cursorEl.getAttribute("data-cursor");
        if (val === "product") {
          baseStateRef.current = "product";
          setCursorState("product");
          return;
        }
        if (val === "zoom") {
          baseStateRef.current = "zoom";
          setCursorState("zoom");
          return;
        }
        if (val === "danger") {
          baseStateRef.current = "danger";
          setCursorState("danger");
          return;
        }
      }

      // Check interactive elements
      if (target.closest("a, button, [role='button'], input[type='submit'], label[for]")) {
        baseStateRef.current = "hover";
        setCursorState("hover");
        return;
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest(
          "a, button, [role='button'], input[type='submit'], label[for], [data-cursor]"
        )
      ) {
        baseStateRef.current = "default";
        setCursorState("default");
      }
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    // Listen for page transitions
    const onTransitionStart = () => setIsTransitioning(true);
    const onTransitionEnd = () => setIsTransitioning(false);
    window.addEventListener("page-transition-start", onTransitionStart);
    window.addEventListener("page-transition-end", onTransitionEnd);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("page-transition-start", onTransitionStart);
      window.removeEventListener("page-transition-end", onTransitionEnd);
    };
  }, [handleMouseMove]);

  if (isTouch) return null;

  const getStyles = (): {
    scale: number;
    borderColor: string;
    bg: string;
    rotate: number;
  } => {
    if (isTransitioning) {
      return { scale: 0, borderColor: "var(--cursor-color)", bg: "transparent", rotate: 45 };
    }

    switch (cursorState) {
      case "hover":
        return {
          scale: 1.8,
          borderColor: "var(--cursor-color)",
          bg: "rgba(201,147,58,0.15)",
          rotate: 45,
        };
      case "product":
        return {
          scale: 2.5,
          borderColor: "var(--cursor-color)",
          bg: "transparent",
          rotate: 45,
        };
      case "zoom":
        return {
          scale: 2,
          borderColor: "#E5AC52",
          bg: "transparent",
          rotate: 45,
        };
      case "danger":
        return {
          scale: 1.5,
          borderColor: "#EF4444",
          bg: "rgba(239,68,68,0.1)",
          rotate: 45,
        };
      case "click":
        return {
          scale: 0.7,
          borderColor: "var(--cursor-color)",
          bg: "rgba(201,147,58,0.3)",
          rotate: 45,
        };
      default:
        return {
          scale: 1,
          borderColor: "var(--cursor-color)",
          bg: "transparent",
          rotate: 45,
        };
    }
  };

  const styles = getStyles();
  const size = 32;

  return (
    <motion.div
      className="cursor-diamond"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: size,
        height: size,
        x: springX,
        y: springY,
        translateX: -(size / 2),
        translateY: -(size / 2),
        rotate: styles.rotate,
        scale: styles.scale,
        borderWidth: "1.5px",
        borderStyle: "solid",
        borderColor: styles.borderColor,
        backgroundColor: styles.bg,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: isVisible && !isTransitioning ? 1 : 0,
        transition:
          "border-color 200ms ease, background-color 200ms ease, scale 200ms ease, opacity 150ms ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Arrow icon for product state */}
      {cursorState === "product" && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ transform: "rotate(-45deg)" }}
        >
          <path
            d="M1 5H9M9 5L5 1M9 5L5 9"
            stroke="var(--cursor-color)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      {/* Plus icon for zoom state */}
      {cursorState === "zoom" && (
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          style={{ transform: "rotate(-45deg)" }}
        >
          <path
            d="M5 1V9M1 5H9"
            stroke="#E5AC52"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
    </motion.div>
  );
}
