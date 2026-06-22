"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      id="hero-section"
    >
      {/* Background Image with Ken Burns Effect */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920&q=80')`,
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/80 via-[#0A0A0A]/60 to-[#0A0A0A]/90" />
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-accent/30 to-transparent hidden lg:block" />
      <div className="absolute top-1/3 right-10 w-px h-24 bg-gradient-to-b from-transparent via-accent/20 to-transparent hidden lg:block" />

      {/* Content */}
      <div className="relative z-10 container-wide text-center px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          {/* Eyebrow */}
          <motion.div variants={lineVariants} className="mb-8">
            <span className="eyebrow-light inline-flex items-center gap-2">
              <span className="w-8 h-px bg-accent" />
              Since 2001
              <span className="w-8 h-px bg-accent" />
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={lineVariants}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Step Into
            <br />
            <span className="gradient-text">24 Years</span>
            <br />
            of Trust
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUpVariants}
            className="text-lg sm:text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Premium footwear for Men, Women & Kids from 200+ brands.
            Delhi&apos;s trusted destination for every step.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUpVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/products"
              className="btn-primary group text-base px-8 py-4"
              id="hero-browse-btn"
            >
              Browse Collection
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="btn-secondary group text-base px-8 py-4"
              id="hero-visit-btn"
            >
              <MapPin className="w-4 h-4" />
              Visit Our Store
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeUpVariants}
            className="mt-20"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              className="w-6 h-10 border border-white/20 rounded-full mx-auto flex items-start justify-center pt-2"
            >
              <div className="w-1 h-2 bg-accent rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
