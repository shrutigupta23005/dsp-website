"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface StatProps {
  value: number;
  suffix: string;
  label: string;
}

function AnimatedStat({ value, suffix, label }: StatProps) {
  const ref = useRef(null);
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

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-display)" }}>
        <span className="font-mono">{displayValue}</span>
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="text-sm text-white/40 uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default function AboutStrip() {
  return (
    <section className="py-24 bg-[#0A0A0A] relative overflow-hidden" id="about-strip">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent rounded-full blur-[150px]" />
      </div>

      <div className="container-wide relative z-10">
        {/* Section Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="eyebrow-light mb-4 block">Our Legacy</span>
          <h2
            className="text-3xl md:text-5xl font-bold text-white leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            24 Years. Thousands of Pairs.
            <br />
            <span className="gradient-text">One Promise.</span>
          </h2>
          <div className="golden-rule-center" />
          <p className="text-white/40 mt-6 text-base md:text-lg leading-relaxed">
            From a single store in the heart of Delhi, we have been fitting families
            with the finest footwear since 2001. Quality, trust, and an unmatched
            selection — that is the Delhi Shoe Palace guarantee.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 py-12 border-t border-b border-white/10"
        >
          <AnimatedStat value={24} suffix="+" label="Years of Trust" />
          <AnimatedStat value={5000} suffix="+" label="Happy Customers" />
          <AnimatedStat value={200} suffix="+" label="Premium Brands" />
          <AnimatedStat value={1} suffix="" label="Iconic Store" />
        </motion.div>
      </div>
    </section>
  );
}
