"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  dark?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  dark = false,
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className={cn("mb-16", centered && "text-center")}
    >
      <span
        className={cn(
          "inline-block font-mono text-xs font-bold uppercase tracking-[0.18em]",
          dark ? "text-accent" : "text-accent"
        )}
      >
        {eyebrow}
      </span>
      <h2
        className={cn(
          "mt-4 text-4xl font-bold md:text-5xl",
          dark ? "text-white" : "text-text-primary"
        )}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>

      {/* Animated gold underline */}
      <motion.span
        className={cn(
          "mt-4 block h-0.5 w-12 bg-accent",
          centered ? "mx-auto" : ""
        )}
        initial={{ width: 0 }}
        whileInView={{ width: 48 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      />

      {subtitle && (
        <p
          className={cn(
            "mx-auto mt-4 max-w-lg text-base",
            dark ? "text-white/40" : "text-text-muted"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
