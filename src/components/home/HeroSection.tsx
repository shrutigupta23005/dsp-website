"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import KineticText, { KineticLine } from "@/components/ui/KineticText";
import TextScramble from "@/components/ui/TextScramble";
import MagneticButton from "@/components/ui/MagneticButton";

const HeroScene = dynamic(
  () => import("@/components/three/HeroScene"),
  { ssr: false }
);

export default function HeroSection() {
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPast(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
      id="hero-section"
    >
      {/* Layer 1: Three.js Canvas (right side) */}
      <div className="absolute right-0 top-0 w-full lg:w-[45%] h-full">
        <HeroScene />
        {/* Left edge vignette */}
        <div
          className="absolute inset-y-0 left-0 w-32 z-[2]"
          style={{
            background:
              "linear-gradient(to right, #0A0A0A, transparent)",
          }}
        />
      </div>

      {/* Layer 3: Text Content */}
      <div className="relative z-10 container-wide px-6 lg:px-16">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mb-8"
          >
            <TextScramble
              text="EST. 2001 — DELHI, INDIA"
              trigger="mount"
              delay={500}
              className="text-[11px] uppercase tracking-[0.25em]"
            />
          </motion.div>

          {/* Headline */}
          <div className="mb-8">
            <KineticText
              text="Step Into"
              tag="h1"
              delay={0.15}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-bold text-white leading-[0.95]"
            />
            <KineticText
              text="24 Years"
              tag="span"
              delay={0.3}
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-bold leading-[0.95]"
            />
            <KineticText
              text="Of Trust."
              tag="span"
              delay={0.45}
              className="block text-5xl sm:text-6xl md:text-7xl lg:text-[96px] font-bold text-white leading-[0.95] italic"
            />
          </div>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-lg max-w-md leading-relaxed mb-10"
            style={{
              color: "#6B6B6B",
              fontFamily: "var(--font-body)",
            }}
          >
            Premium footwear for Men, Women & Kids from 200+ brands.
            Delhi&apos;s trusted destination for every step.
          </motion.p>

          {/* CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <MagneticButton>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: "#C9933A",
                  color: "#0A0A0A",
                  fontFamily: "var(--font-body)",
                }}
                id="hero-browse-btn"
              >
                Browse Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-medium border transition-colors hover:border-white/40"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "#F5F5F5",
                  fontFamily: "var(--font-body)",
                }}
                id="hero-visit-btn"
              >
                <MapPin className="w-4 h-4" />
                Visit Our Store
              </Link>
            </MagneticButton>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.5 }}
            className="flex items-center gap-8"
          >
            {[
              { number: "24+", label: "Years" },
              { number: "200+", label: "Brands" },
              { number: "5000+", label: "Customers" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-8">
                {i > 0 && (
                  <div
                    className="w-px h-8"
                    style={{ backgroundColor: "#2A2A2A" }}
                  />
                )}
                <div>
                  <TextScramble
                    text={stat.number}
                    trigger="mount"
                    delay={1300 + i * 200}
                    className="text-2xl md:text-[32px] font-bold"
                  />
                  <p
                    className="text-[11px] uppercase tracking-wider mt-1"
                    style={{
                      color: "#6B6B6B",
                      fontFamily:
                        "var(--font-dm-mono, var(--font-utility))",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrolledPast ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.2em] -rotate-90 origin-center"
          style={{
            color: "#3A3A3A",
            fontFamily: "var(--font-dm-mono, var(--font-utility))",
          }}
        >
          Scroll
        </span>
        <motion.div
          className="w-px"
          style={{ backgroundColor: "#C9933A" }}
          initial={{ height: 0 }}
          animate={{ height: [0, 40, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      {/* Bottom Marquee */}
      <div
        className="absolute bottom-0 left-0 right-0 h-10 flex items-center overflow-hidden z-10"
        style={{ borderTop: "1px solid #1E1E1E" }}
      >
        <div className="marquee-track whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span
              key={i}
              className="inline-block text-[11px] uppercase tracking-[0.15em] mx-4"
              style={{
                color: "#3A3A3A",
                fontFamily: "var(--font-dm-mono, var(--font-utility))",
              }}
            >
              DELHI SHOE PALACE • 24 YEARS OF TRUST • 200+ BRANDS •
              5000+ HAPPY CUSTOMERS •{" "}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
