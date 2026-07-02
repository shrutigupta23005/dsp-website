"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import KineticText from "@/components/ui/KineticText";
import MagneticButton from "@/components/ui/MagneticButton";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

interface StatBlockProps {
  value: number;
  suffix: string;
  label: string;
  description: string;
  index: number;
}

function StatBlock({ value, suffix, label, description, index }: StatBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <motion.div
      ref={ref}
      className="min-h-[50vh] flex items-center px-8 lg:px-16"
      style={{ borderTop: "1px solid #1E1E1E" }}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.76, 0, 0.24, 1],
      }}
    >
      <div>
        <div className="flex items-baseline gap-2">
          <span
            className="text-6xl md:text-[80px] font-bold"
            style={{
              color: "#F5F5F5",
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
            }}
          >
            {displayValue.toLocaleString()}
          </span>
          <span
            className="text-3xl md:text-[40px] font-bold"
            style={{
              color: "#C9933A",
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
            }}
          >
            {suffix}
          </span>
        </div>
        <p
          className="text-base mt-2"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-body)" }}
        >
          {label}
        </p>
        <p
          className="text-sm mt-1 max-w-xs"
          style={{ color: "#3A3A3A", fontFamily: "var(--font-body)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

const STATS = [
  {
    value: 24,
    suffix: "+",
    label: "Years Serving Delhi",
    description: "Family-run since 2001, built on trust and personal recommendations.",
  },
  {
    value: 200,
    suffix: "+",
    label: "Brands in Collection",
    description: "From Nike to Bata, every brand hand-picked for quality.",
  },
  {
    value: 5000,
    suffix: "+",
    label: "Happy Customers",
    description: "Growing families who return season after season.",
  },
  {
    value: 10000,
    suffix: "+",
    label: "Pairs Sold",
    description: "Thousands of perfect fits found, one customer at a time.",
  },
];

export default function AboutStrip() {
  return (
    <section
      className="relative bg-[#0A0A0A] overflow-hidden"
      id="about-strip"
    >
      {/* Particle background */}
      <ParticleField />

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Left Panel — Sticky */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-0 lg:h-screen flex flex-col justify-center px-8 lg:px-16 py-20 lg:py-0">
          {/* Decorative number */}
          <span
            className="absolute text-[200px] font-bold leading-none select-none pointer-events-none"
            style={{
              fontFamily: "var(--font-display)",
              color: "#F5F5F5",
              opacity: 0.03,
              top: "50%",
              left: "10%",
              transform: "translateY(-50%)",
            }}
          >
            24
          </span>

          <span
            className="text-[11px] uppercase tracking-[0.25em] mb-6 block"
            style={{
              color: "#C9933A",
              fontFamily: "var(--font-dm-mono, var(--font-utility))",
            }}
          >
            Our Story
          </span>

          <KineticText
            text="24 Years."
            tag="h2"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2"
          />
          <KineticText
            text="One Promise."
            tag="h2"
            delay={0.15}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8"
          />

          <p
            className="text-base max-w-sm leading-8 mb-10"
            style={{
              color: "#6B6B6B",
              fontFamily: "var(--font-body)",
            }}
          >
            From a single store in the heart of Delhi, we have been fitting
            families with the finest footwear since 2001. Quality, trust,
            and an unmatched selection — that is the Delhi Shoe Palace
            guarantee.
          </p>

          <MagneticButton>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-medium border transition-colors hover:border-[#E5AC52]"
              style={{
                borderColor: "#C9933A",
                color: "#C9933A",
                fontFamily: "var(--font-body)",
              }}
            >
              Our Full Story
              <ArrowRight className="w-4 h-4" />
            </Link>
          </MagneticButton>
        </div>

        {/* Right Panel — Scrolls */}
        <div className="w-full lg:w-1/2">
          {STATS.map((stat, i) => (
            <StatBlock key={i} {...stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
