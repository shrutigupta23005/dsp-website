"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductWithRelations, QuizAnswers } from "@/types";

const steps = [
  { key: "gender", title: "Who is this for?", options: ["MEN", "WOMEN", "KIDS"] },
  { key: "occasion", title: "What is the occasion?", options: ["Sports", "Casual", "Formal", "Fancy"] },
  { key: "colorFamily", title: "Preferred color family?", options: ["Neutral", "Bold", "Pastel", "All"] },
  { key: "budget", title: "Budget range?", options: ["under500", "500to1500", "1500to3000", "above3000"] },
] as const;

const budgetLabels: Record<string, string> = {
  under500: "Under Rs. 500",
  "500to1500": "Rs. 500-1500",
  "1500to3000": "Rs. 1500-3000",
  above3000: "Rs. 3000+",
};

export default function QuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [results, setResults] = useState<ProductWithRelations[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const current = steps[step];

  const choose = async (value: string) => {
    const nextAnswers = { ...answers, [current.key]: value } as Partial<QuizAnswers>;
    setAnswers(nextAnswers);

    if (step < steps.length - 1) {
      setStep((currentStep) => currentStep + 1);
      return;
    }

    setIsLoading(true);
    const res = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextAnswers),
    });
    const data = await res.json();
    setResults(res.ok ? data.data : []);
    setIsLoading(false);
  };

  if (results) {
    return (
      <div>
        <div className="mb-10 text-center">
          <p className="eyebrow">Your Result</p>
          <h1 className="section-title mt-3">Your Perfect Pairs</h1>
          <span className="golden-rule mx-auto" />
        </div>
        {results.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {results.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} showWishlist={false} />
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-card p-12 text-center text-text-muted">
            No exact matches yet. Try a wider budget or color family.
          </div>
        )}
        <div className="mt-8 text-center">
          <Button onClick={() => { setStep(0); setAnswers({}); setResults(null); }}>Retake Quiz</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-border bg-card p-8">
      <p className="price text-sm text-accent">Step {step + 1} of {steps.length}</p>
      <h1 className="mt-3 text-3xl font-semibold text-text-primary" style={{ fontFamily: "var(--font-display)" }}>
        {current.title}
      </h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {current.options.map((option) => (
          <button
            key={option}
            onClick={() => choose(option)}
            disabled={isLoading}
            className="rounded-lg border border-border p-5 text-left font-semibold text-text-primary transition-colors hover:border-accent hover:bg-accent/10"
          >
            {budgetLabels[option] || option}
          </button>
        ))}
      </div>
      {step > 0 ? (
        <button onClick={() => setStep((currentStep) => currentStep - 1)} className="mt-6 text-sm font-medium text-accent">
          Back
        </button>
      ) : null}
    </div>
  );
}
