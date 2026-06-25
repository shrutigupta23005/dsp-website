"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Heart, Shield, Star, Users } from "lucide-react";

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
  {
    icon: Users,
    title: "Family Legacy",
    description:
      "Three generations of footwear expertise. We have fitted parents and now fit their children.",
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
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-mono text-4xl font-bold text-accent md:text-5xl">
        {displayValue}
        <span className="text-accent/70">{suffix}</span>
      </div>
      <p className="mt-2 text-sm uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  );
}

export default function AboutPageClient() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden bg-background-primary">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-accent blur-[150px]" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent blur-[150px]" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 px-4 text-center"
        >
          <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Our Story
          </span>
          <h1
            className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            24 Years. Thousands of Pairs.
            <br />
            <span className="gradient-text">One Promise.</span>
          </h1>
          <motion.span
            className="mx-auto mt-6 block h-0.5 bg-accent"
            initial={{ width: 0 }}
            animate={{ width: 96 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>
      </section>

      {/* Mission */}
      <section className="bg-background-secondary py-20">
        <div className="container-wide">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
                Our Mission
              </span>
              <h2
                className="text-3xl font-bold text-text-primary md:text-4xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Making Premium Footwear Accessible to Every Family
              </h2>
              <motion.span
                className="mt-4 block h-0.5 bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: 48 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <p className="text-lg leading-relaxed text-text-muted">
                Delhi Shoe Palace is a real Delhi footwear store shaped by
                everyday customers, school seasons, wedding rushes, office
                needs, and the simple belief that the right pair should feel
                good before it looks good.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-text-muted">
                We do not sell online — we believe in the magic of trying on a
                pair, feeling the fit, and walking out confident. Our digital
                catalog helps you browse, discover, and shortlist before you
                visit.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-background-primary py-20">
        <div className="container-wide">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-8 py-4 md:grid-cols-4 md:gap-12"
          >
            <AnimatedStat value={24} suffix="+" label="Years of Trust" />
            <AnimatedStat value={5000} suffix="+" label="Happy Customers" />
            <AnimatedStat value={200} suffix="+" label="Premium Brands" />
            <AnimatedStat value={1} suffix="" label="Iconic Store" />
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-background-secondary py-20">
        <div className="container-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
              Our Journey
            </span>
            <h2
              className="text-3xl font-bold text-text-primary md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Built One Customer at a Time
            </h2>
            <motion.span
              className="mx-auto mt-4 block h-0.5 bg-accent"
              initial={{ width: 0 }}
              whileInView={{ width: 48 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
          </motion.div>

          {/* Timeline with gold center line */}
          <div className="relative">
            {/* Gold vertical line */}
            <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-accent/30 md:block" />

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
                  className={`flex ${index % 2 === 0 ? "md:justify-start" : "md:justify-end"}`}
                >
                  <div className="relative w-full rounded-xl border border-border bg-white p-6 shadow-sm md:w-[46%]">
                    {/* Dot on the timeline */}
                    <div
                      className={`absolute top-8 hidden h-3 w-3 rounded-full border-2 border-accent bg-background-secondary md:block ${
                        index % 2 === 0
                          ? "-right-[calc(4%+6.5px)]"
                          : "-left-[calc(4%+6.5px)]"
                      }`}
                    />
                    <p className="font-mono text-2xl font-bold text-accent">
                      {entry.year}
                    </p>
                    <h3
                      className="mt-2 text-lg font-bold text-text-primary"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {entry.title}
                    </h3>
                    <p className="mt-2 leading-7 text-text-muted">
                      {entry.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="bg-white py-20">
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

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-xl border border-border bg-background-secondary p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-background-primary">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="bg-background-primary py-20">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl font-bold text-white md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to Find Your Perfect Pair?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/40">
              Browse our collection online and visit us in Karol Bagh, New
              Delhi for the perfect fit.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-4 text-sm font-semibold text-background-primary transition-colors hover:bg-accent-hover"
              >
                Browse Collection
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-8 py-4 text-sm font-semibold text-white transition-colors hover:border-white/40"
              >
                Visit Our Store
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
