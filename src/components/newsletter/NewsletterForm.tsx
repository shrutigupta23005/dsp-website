"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Check, Loader2, X } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().max(100).optional(),
  consent: z.boolean().refine((v) => v === true, "Consent is required"),
});

type FormData = z.infer<typeof schema>;

interface NewsletterFormProps {
  variant?: "footer" | "modal";
  onClose?: () => void;
}

export default function NewsletterForm({
  variant = "footer",
  onClose,
}: NewsletterFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", name: "", consent: false },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Something went wrong");
        return;
      }
      setIsSuccess(true);
      toast.success(result.message || "Subscribed!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-[9997] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
        <div
          className="relative w-full max-w-sm rounded-2xl p-6"
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 rounded-md transition-colors hover:opacity-70"
            aria-label="Close"
          >
            <X className="h-5 w-5" style={{ color: "var(--text-muted)" }} />
          </button>

          {isSuccess ? (
            <SuccessState />
          ) : (
            <>
              <p className="eyebrow mb-2">Stay in the loop</p>
              <h3
                className="text-lg font-bold mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "var(--text-primary)",
                }}
              >
                New Arrivals. Exclusive Offers.
              </h3>
              <FormFields
                register={register}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit(onSubmit)}
              />
              <button
                onClick={onClose}
                className="mt-3 w-full text-center text-sm transition-colors"
                style={{ color: "var(--text-muted)" }}
              >
                No thanks
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Footer variant
  return (
    <div>
      {isSuccess ? (
        <SuccessState />
      ) : (
        <>
          <p
            className="mb-1 text-[11px] font-bold uppercase tracking-[0.18em]"
            style={{
              fontFamily: "var(--font-utility)",
              color: "var(--accent-color)",
            }}
          >
            Stay in the loop
          </p>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: "#F5F5F5" }}
          >
            New Arrivals. Exclusive Offers.
          </h3>
          <FormFields
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(onSubmit)}
            isFooter
          />
        </>
      )}
    </div>
  );
}

function FormFields({
  register,
  errors,
  isSubmitting,
  onSubmit,
  isFooter = false,
}: {
  register: ReturnType<typeof useForm<FormData>>["register"];
  errors: ReturnType<typeof useForm<FormData>>["formState"]["errors"];
  isSubmitting: boolean;
  onSubmit: () => void;
  isFooter?: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className={`flex ${isFooter ? "flex-col sm:flex-row" : "flex-col"} gap-2`}>
        <input
          type="email"
          placeholder="Your email address"
          {...register("email")}
          className="h-10 flex-1 rounded-lg px-3 text-sm transition-colors focus:outline-none"
          style={{
            background: isFooter ? "rgba(255,255,255,0.08)" : "var(--bg-secondary)",
            border: `1px solid ${isFooter ? "rgba(255,255,255,0.1)" : "var(--border-color)"}`,
            color: isFooter ? "#F5F5F5" : "var(--text-primary)",
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-lg px-5 text-sm font-semibold transition-colors shrink-0 disabled:opacity-60"
          style={{
            background: "var(--accent-color)",
            color: "var(--text-on-accent)",
          }}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mx-auto" />
          ) : (
            "Subscribe"
          )}
        </button>
      </div>
      {errors.email && (
        <p className="text-xs text-red-400">{errors.email.message}</p>
      )}

      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          {...register("consent")}
          className="mt-0.5 h-4 w-4 rounded accent-[#C9933A]"
        />
        <span
          className="text-xs leading-relaxed"
          style={{ color: isFooter ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}
        >
          I agree to receive updates.{" "}
          <a
            href="/privacy"
            className="underline"
            style={{ color: "var(--accent-color)" }}
          >
            Privacy Policy
          </a>
        </span>
      </label>
      {errors.consent && (
        <p className="text-xs text-red-400">{errors.consent.message}</p>
      )}
    </form>
  );
}

function SuccessState() {
  return (
    <div className="flex items-center gap-3 py-2">
      <div
        className="flex h-8 w-8 items-center justify-center rounded-full shrink-0"
        style={{ background: "var(--accent-muted)" }}
      >
        <Check className="h-4 w-4" style={{ color: "var(--accent-color)" }} />
      </div>
      <p className="text-sm" style={{ color: "var(--text-primary, #F5F5F5)" }}>
        You&apos;re in! Check your inbox.
      </p>
    </div>
  );
}

/**
 * Newsletter modal wrapper — shows after 30s on first visit
 */
export function NewsletterModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("dsp_newsletter_shown")) return;

    const timer = setTimeout(() => {
      setShow(true);
      sessionStorage.setItem("dsp_newsletter_shown", "true");
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return <NewsletterForm variant="modal" onClose={() => setShow(false)} />;
}
