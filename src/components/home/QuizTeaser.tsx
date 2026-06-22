"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

export default function QuizTeaser() {
  return (
    <section className="py-24 bg-background-secondary" id="quiz-teaser">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-2xl overflow-hidden"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#141414] to-[#1A1A1A]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent rounded-full blur-[100px]" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-16">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Personalized for You
                </span>
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Find Your Perfect Pair
              </h2>
              <p className="text-white/40 max-w-md text-base leading-relaxed">
                Take our quick 4-step style quiz and discover footwear
                handpicked for your taste, occasion, and budget.
              </p>
            </div>
            <div>
              <Link
                href="/quiz"
                className="btn-primary group text-base px-8 py-4"
                id="quiz-cta-btn"
              >
                Take the Quiz
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Decorative border */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
