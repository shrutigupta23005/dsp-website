"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Star, Users } from "lucide-react";
import KineticText from "@/components/ui/KineticText";
import MagneticButton from "@/components/ui/MagneticButton";
import NoiseOverlay from "@/components/ui/NoiseOverlay";

const ParticleField = dynamic(
  () => import("@/components/three/ParticleField"),
  { ssr: false }
);

const TIMELINE = [
  {
    year: "2001",
    title: "The Beginning",
    text: "Delhi Shoe Palace opens its doors in the heart of Karol Bagh as a small, family-run footwear store built on trust and personal recommendations.",
  },
  {
    year: "2006",
    title: "Growing Together",
    text: "The store expands its catalog to cover sports, formal, school, and casual footwear, becoming a one-stop destination for families across Delhi.",
  },
  {
    year: "2012",
    title: "Brand Partnerships",
    text: "Partnerships with 100+ premium brands including Nike, Adidas, Puma, Bata, and Woodland bring world-class selection to local customers.",
  },
  {
    year: "2018",
    title: "Community Trust",
    text: "Crossing the 5,000 happy customer milestone. Premium brand discovery and expert fitting advice become the store's signature.",
  },
  {
    year: "2024",
    title: "Digital Evolution",
    text: "The digital catalog brings the in-store browsing experience online while purchases stay personal through WhatsApp and store visits.",
  },
];

const VALUES = [
  {
    icon: Shield,
    title: "Trust First",
    description:
      "Every pair we stock is authentic and quality-checked. No knockoffs, no compromises.",
  },
  {
    icon: Heart,
    title: "Personal Touch",
    description:
      "We know our regular customers by name. Footwear is personal, and so is our service.",
  },
  {
    icon: Star,
    title: "Curated Selection",
    description:
      "200+ brands, carefully selected. We do not stock everything — only what we would wear ourselves.",
  },
];

function AnimatedStat({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    const duration = 2000;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(eased * value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className="text-center px-6 py-8"
      style={{ borderRight: "1px solid #1E1E1E" }}
    >
      <div
        className="text-6xl md:text-[96px] font-bold leading-none"
        style={{
          color: "#F5F5F5",
          fontFamily: "var(--font-dm-mono, var(--font-utility))",
        }}
      >
        {displayValue.toLocaleString()}
        <span style={{ color: "#C9933A" }}>{suffix}</span>
      </div>
      <p
        className="text-base mt-4"
        style={{ color: "#6B6B6B", fontFamily: "var(--font-body)" }}
      >
        {label}
      </p>
    </div>
  );
}

export default function AboutPageClient() {
  return (
    <>
      {/* SECTION 1 — Opening Statement */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <NoiseOverlay />
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <KineticText
            text="We've been putting"
            tag="h1"
            delay={0}
            className="text-4xl md:text-6xl lg:text-[72px] font-bold text-white leading-tight"
          />
          <KineticText
            text="the right shoe on"
            tag="span"
            delay={0.2}
            className="block text-4xl md:text-6xl lg:text-[72px] font-bold text-white leading-tight"
          />
          <KineticText
            text="the right foot"
            tag="span"
            delay={0.4}
            className="block text-4xl md:text-6xl lg:text-[72px] font-bold leading-tight"
          />
          <KineticText
            text="since 2001."
            tag="span"
            delay={0.6}
            className="block text-4xl md:text-6xl lg:text-[72px] font-bold text-white leading-tight italic"
          />

          <motion.div
            className="mx-auto mt-12 h-px"
            style={{ backgroundColor: "#C9933A" }}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          />
        </div>
      </section>

      {/* SECTION 2 — The Numbers */}
      <section className="py-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4"
          >
            <AnimatedStat value={24} suffix="+" label="Years of Trust" />
            <AnimatedStat value={200} suffix="+" label="Brands Carried" />
            <AnimatedStat value={5000} suffix="+" label="Happy Customers" />
            <AnimatedStat value={10000} suffix="+" label="Pairs Sold" />
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 — Timeline */}
      <section className="py-20" style={{ backgroundColor: "#0A0A0A" }}>
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span
              className="text-[11px] uppercase tracking-[0.25em] mb-4 block"
              style={{
                color: "#C9933A",
                fontFamily: "var(--font-dm-mono, var(--font-utility))",
              }}
            >
              Our Journey
            </span>
            <KineticText
              text="Built One Customer at a Time"
              tag="h2"
              className="text-3xl font-bold text-white md:text-5xl"
            />
          </motion.div>

          {/* Timeline with gold center line */}
          <div className="relative">
            <div
              className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 md:block"
              style={{ backgroundColor: "rgba(201,147,58,0.3)" }}
            />

            <div className="space-y-12 md:space-y-16">
              {TIMELINE.map((entry, index) => (
                <motion.div
                  key={entry.year}
                  initial={{
                    opacity: 0,
                    x: index % 2 === 0 ? -50 : 50,
                  }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`flex ${
                    index % 2 === 0
                      ? "md:justify-start"
                      : "md:justify-end"
                  }`}
                >
                  <div
                    className="relative w-full rounded-xl p-6 md:w-[46%]"
                    style={{
                      backgroundColor: "#1A1A1A",
                      border: "1px solid #2A2A2A",
                    }}
                  >
                    {/* Dot on the timeline */}
                    <div
                      className={`absolute top-8 hidden h-3 w-3 rounded-full md:block`}
                      style={{
                        backgroundColor: "#C9933A",
                        boxShadow: "0 0 12px rgba(201,147,58,0.5)",
                        ...(index % 2 === 0
                          ? { right: "calc(-4% - 6.5px)" }
                          : { left: "calc(-4% - 6.5px)" }),
                      }}
                    />
                    <p
                      className="text-2xl font-bold"
                      style={{
                        color: "#C9933A",
                        fontFamily:
                          "var(--font-dm-mono, var(--font-utility))",
                      }}
                    >
                      {entry.year}
                    </p>
                    <h3
                      className="mt-2 text-lg font-bold text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {entry.title}
                    </h3>
                    <p
                      className="mt-2 leading-7"
                      style={{ color: "#6B6B6B" }}
                    >
                      {entry.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Values (warm contrast section) */}
      <section
        className="py-20"
        style={{ backgroundColor: "#F5F2EE" }}
      >
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
              What We Stand For
            </span>
            <h2
              className="text-3xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Our Values
            </h2>
            <motion.span
              className="mx-auto mt-4 block h-0.5 bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-3">
            {VALUES.map((value, index) => (
              <MagneticButton key={value.title} strength={0.2}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  className="group rounded-xl bg-white p-8 transition-all duration-300 hover:shadow-lg"
                  style={{
                    borderLeft: "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "#C9933A";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
                  }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white">
                    <value.icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="text-lg font-bold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {value.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {value.description}
                  </p>
                </motion.div>
              </MagneticButton>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — CTA */}
      <section
        className="relative py-20 overflow-hidden"
        style={{ backgroundColor: "#0A0A0A" }}
      >
        <ParticleField />

        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <KineticText
              text="Come Find Your Perfect Pair"
              tag="h2"
              className="text-3xl md:text-5xl lg:text-[56px] font-bold text-white mb-8"
            />
            <p
              className="mx-auto max-w-md text-base mb-10"
              style={{ color: "#6B6B6B" }}
            >
              Browse our collection online and visit us in Karol Bagh, New
              Delhi for the perfect fit.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <MagneticButton>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-semibold transition-colors"
                  style={{
                    backgroundColor: "#C9933A",
                    color: "#0A0A0A",
                  }}
                >
                  Get Directions
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <a
                  href="https://wa.me/91XXXXXXXXXX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 h-12 px-8 rounded-lg text-sm font-semibold border transition-colors hover:border-white/40"
                  style={{
                    borderColor: "rgba(255,255,255,0.2)",
                    color: "#F5F5F5",
                  }}
                >
                  Chat on WhatsApp
                </a>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
