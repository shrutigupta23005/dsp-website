"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface TextScrambleProps {
  text: string;
  trigger?: "hover" | "mount";
  className?: string;
  delay?: number;
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%";

export default function TextScramble({
  text,
  trigger = "mount",
  className = "",
  delay = 0,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(
    trigger === "mount" ? text.replace(/[^\s]/g, " ") : text
  );
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const hasPlayedRef = useRef(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    const finalChars = text.split("");
    const totalDuration = 1200; // ms
    const charDelay = totalDuration / finalChars.length;
    let resolvedCount = 0;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newResolvedCount = Math.min(
        Math.floor(elapsed / charDelay),
        finalChars.length
      );

      if (newResolvedCount > resolvedCount) {
        resolvedCount = newResolvedCount;
      }

      const result = finalChars
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < resolvedCount) return char;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      setDisplayText(result);

      if (resolvedCount < finalChars.length) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
        setIsScrambling(false);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
  }, [text, isScrambling]);

  // Mount trigger
  useEffect(() => {
    if (trigger !== "mount" || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const timeout = setTimeout(() => {
      scramble();
    }, delay);

    return () => {
      clearTimeout(timeout);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [trigger, delay, scramble]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (trigger === "hover") scramble();
  };

  return (
    <span
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{
        fontFamily: "var(--font-dm-mono, var(--font-utility))",
        color: isScrambling ? "#C9933A" : undefined,
        transition: "color 0.3s",
      }}
    >
      {displayText}
    </span>
  );
}
