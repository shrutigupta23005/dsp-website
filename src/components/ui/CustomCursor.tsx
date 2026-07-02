"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<
    "default" | "link" | "view" | "magnetic" | "click"
  >("default");
  const [isTouch, setIsTouch] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const ringX = useSpring(mouseX, { stiffness: 100, damping: 28, mass: 0.5 });
  const ringY = useSpring(mouseY, { stiffness: 100, damping: 28, mass: 0.5 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
      if (!isVisible) setIsVisible(true);
    },
    [mouseX, mouseY, isVisible]
  );

  useEffect(() => {
    // Check for touch device
    const isTouchDevice =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window;
    setIsTouch(isTouchDevice);
    if (isTouchDevice) return;

    // Hide default cursor
    document.body.style.cursor = "none";

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", () => setCursorState("click"));
    window.addEventListener("mouseup", () => setCursorState("default"));
    window.addEventListener("mouseleave", () => setIsVisible(false));
    window.addEventListener("mouseenter", () => setIsVisible(true));

    const handleElementHover = () => {
      // Delegate hover detection via mouseover/mouseout
      const onMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const cursorAttr = target.closest("[data-cursor]");
        if (cursorAttr) {
          const val = cursorAttr.getAttribute("data-cursor");
          if (val === "view") setCursorState("view");
          else if (val === "magnetic") setCursorState("magnetic");
          return;
        }
        if (target.closest("a, button, [role='button']")) {
          setCursorState("link");
          return;
        }
      };

      const onMouseOut = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (
          target.closest(
            "a, button, [role='button'], [data-cursor]"
          )
        ) {
          setCursorState("default");
        }
      };

      document.addEventListener("mouseover", onMouseOver);
      document.addEventListener("mouseout", onMouseOut);

      return () => {
        document.removeEventListener("mouseover", onMouseOver);
        document.removeEventListener("mouseout", onMouseOut);
      };
    };

    const cleanupHover = handleElementHover();

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", handleMouseMove);
      cleanupHover();
    };
  }, [handleMouseMove]);

  if (isTouch) return null;

  const getDotStyles = () => {
    switch (cursorState) {
      case "link":
        return "scale-0";
      case "click":
        return "scale-50";
      default:
        return "scale-100";
    }
  };

  const getRingSize = () => {
    switch (cursorState) {
      case "link":
        return { width: 100, height: 100, borderColor: "rgba(201,147,58,0.15)" };
      case "view":
        return { width: 120, height: 120, borderColor: "#C9933A" };
      case "magnetic":
        return { width: 60, height: 40, borderColor: "#C9933A" };
      case "click":
        return { width: 32, height: 32, borderColor: "#C9933A" };
      default:
        return { width: 40, height: 40, borderColor: "#C9933A" };
    }
  };

  const ringStyle = getRingSize();

  return (
    <>
      {/* Dot - follows instantly */}
      <div
        ref={dotRef}
        className={`fixed top-0 left-0 pointer-events-none z-[9999] transition-transform duration-100 ${getDotStyles()}`}
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: "#C9933A",
          mixBlendMode: "difference",
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Ring - lags behind with spring physics */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          width: ringStyle.width,
          height: ringStyle.height,
          borderRadius: cursorState === "magnetic" ? "30%" : "50%",
          border: `1.5px solid ${ringStyle.borderColor}`,
          backgroundColor:
            cursorState === "link"
              ? "rgba(201,147,58,0.1)"
              : "transparent",
          translateX: -(ringStyle.width / 2),
          translateY: -(ringStyle.height / 2),
          opacity: isVisible ? 1 : 0,
          transition:
            "width 0.3s, height 0.3s, border-color 0.3s, background-color 0.3s, border-radius 0.3s",
        }}
      >
        {cursorState === "view" && (
          <span
            className="text-[9px] font-bold uppercase tracking-[0.15em]"
            style={{
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
              color: "#C9933A",
            }}
          >
            View
          </span>
        )}
      </motion.div>
    </>
  );
}
