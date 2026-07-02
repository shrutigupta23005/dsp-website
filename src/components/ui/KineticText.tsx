"use client";

import { useRef, createElement, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { prefersReducedMotion } from "@/lib/a11y";

interface KineticTextProps {
  text: string;
  className?: string;
  delay?: number;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  once?: boolean;
}

const easing = [0.76, 0, 0.24, 1] as const;

export default function KineticText({
  text,
  className = "",
  delay = 0,
  tag = "h2",
  once = true,
}: KineticTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });

  const words = text.split(" ");
  const reducedMotion =
    typeof window !== "undefined" ? prefersReducedMotion() : false;

  if (reducedMotion) {
    return createElement(tag, { className, ref }, text);
  }

  const content = words.map((word, i) => (
    <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
      <motion.span
        className="inline-block"
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 0.8,
          delay: delay + i * 0.04,
          ease: easing,
        }}
      >
        {word}
      </motion.span>
    </span>
  ));

  return createElement(tag, { className, ref }, ...content);
}

interface KineticLineProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}

export function KineticLine({
  children,
  className = "",
  delay = 0,
  once = true,
}: KineticLineProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, margin: "-100px" });
  const reducedMotion =
    typeof window !== "undefined" ? prefersReducedMotion() : false;

  if (reducedMotion) {
    return (
      <div className={className} ref={ref}>
        {children}
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} ref={ref}>
      <motion.div
        initial={{ y: "110%" }}
        animate={isInView ? { y: "0%" } : { y: "110%" }}
        transition={{
          duration: 0.8,
          delay,
          ease: easing,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
