"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";
import type { ProductWithRelations, QuizAnswers } from "@/types";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const steps = [
  {
    key: "gender",
    title: "Who is this for?",
    options: [
      { value: "MEN", label: "Men", emoji: "👞" },
      { value: "WOMEN", label: "Women", emoji: "👠" },
      { value: "KIDS", label: "Kids", emoji: "👟" },
    ],
  },
  {
    key: "occasion",
    title: "What's the occasion?",
    options: [
      { value: "Sports", label: "Sports", emoji: "🏃" },
      { value: "Casual", label: "Casual", emoji: "😎" },
      { value: "Formal", label: "Formal", emoji: "👔" },
      { value: "Fancy", label: "Fancy", emoji: "✨" },
    ],
  },
  {
    key: "colorFamily",
    title: "Preferred color family?",
    options: [
      { value: "Neutral", label: "Neutral", emoji: "🤍" },
      { value: "Bold", label: "Bold", emoji: "❤️" },
      { value: "Pastel", label: "Pastel", emoji: "🩷" },
      { value: "All", label: "No Preference", emoji: "🌈" },
    ],
  },
  {
    key: "budget",
    title: "Budget range?",
    options: [
      { value: "under500", label: "Under ₹500", emoji: "💰" },
      { value: "500to1500", label: "₹500 – ₹1,500", emoji: "💵" },
      { value: "1500to3000", label: "₹1,500 – ₹3,000", emoji: "💎" },
      { value: "above3000", label: "₹3,000+", emoji: "👑" },
    ],
  },
] as const;

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<ProductWithRelations[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const current = steps[step];

  const choose = async (value: string) => {
    const nextAnswers = { ...answers, [current.key]: value };
    setAnswers(nextAnswers);

    if (step < steps.length - 1) {
      setStep((s) => s + 1);
      return;
    }

    // Final step — submit quiz
    setIsLoading(true);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextAnswers),
      });
      const data = await res.json();
      setResults(res.ok ? data.data : []);
    } catch {
      toast.error("Something went wrong");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const retake = () => {
    setStep(0);
    setAnswers({});
    setResults(null);
  };

  // Results View
  if (results) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background-secondary pt-28">
          <section className="container-wide pb-16">
            <div className="text-center mb-10">
              <p className="eyebrow">QUIZ RESULTS</p>
              <h1
                className="section-title mt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Your Perfect Pairs
              </h1>
              <span className="golden-rule mx-auto" />
            </div>
            {results.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {results.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    showWishlist={false}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border bg-white p-16 text-center">
                <p className="text-lg font-medium text-text-primary">
                  No exact matches found
                </p>
                <p className="text-sm text-text-muted mt-2">
                  Try a wider budget or a different color preference
                </p>
              </div>
            )}
            <div className="mt-10 text-center">
              <button
                onClick={retake}
                className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-semibold text-sm rounded-lg transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  // Quiz View
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-28">
        <div className="w-full max-w-xl">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <p
                className="text-xs text-accent tracking-wider"
                style={{ fontFamily: "var(--font-utility)" }}
              >
                STEP {step + 1} OF {steps.length}
              </p>
              <p className="text-xs text-white/30" style={{ fontFamily: "var(--font-utility)" }}>
                {Math.round(((step + 1) / steps.length) * 100)}%
              </p>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <h1
                className="text-3xl md:text-4xl font-bold text-white text-center mb-10"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {current.title}
              </h1>

              <div className="grid grid-cols-2 gap-3">
                {current.options.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => choose(option.value)}
                    disabled={isLoading}
                    className="group relative flex flex-col items-center gap-3 rounded-xl border-2 border-white/10 bg-white/5 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-accent hover:bg-accent/10 disabled:opacity-50"
                  >
                    <span className="text-3xl">{option.emoji}</span>
                    <span className="text-sm font-semibold text-white group-hover:text-accent transition-colors">
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Back Button */}
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="mt-8 text-sm font-medium text-accent hover:text-accent-hover transition-colors block mx-auto"
            >
              ← Go Back
            </button>
          )}

          {/* Loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center mt-10"
            >
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              <p className="ml-3 text-white/50 text-sm">Finding your perfect pairs...</p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
}
