"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { Send, CheckCircle, Loader2, MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getWhatsAppUrl } from "@/lib/utils";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().max(15).optional().or(z.literal("")),
  subject: z.enum(
    ["General Inquiry", "Product Availability", "Bulk Order", "Feedback", "Other"],
    { message: "Please select a subject" }
  ),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: undefined,
      message: "",
    },
  });

  const messageValue = watch("message", "");

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Failed to send message");
        return;
      }

      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <h3
          className="text-2xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Message Sent!
        </h3>
        <p className="mt-3 max-w-sm text-sm text-text-muted">
          Thank you for reaching out. We will get back to you within 24 hours.
          For faster responses, chat with us on WhatsApp.
        </p>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#20BD5A]"
        >
          <MessageCircle className="h-4 w-4" />
          Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 rounded-xl border border-border bg-white p-6 md:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {/* Name */}
          <div>
            <label
              htmlFor="contact-name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-primary"
            >
              Name *
            </label>
            <input
              id="contact-name"
              type="text"
              {...register("name")}
              className="h-11 w-full rounded-lg border border-border bg-background-secondary px-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="contact-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-primary"
            >
              Email *
            </label>
            <input
              id="contact-email"
              type="email"
              {...register("email")}
              className="h-11 w-full rounded-lg border border-border bg-background-secondary px-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {/* Phone */}
          <div>
            <label
              htmlFor="contact-phone"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-primary"
            >
              Phone <span className="font-normal normal-case text-text-muted">(optional)</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              {...register("phone")}
              className="h-11 w-full rounded-lg border border-border bg-background-secondary px-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="+91 99999 99999"
            />
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="contact-subject"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-text-primary"
            >
              Subject *
            </label>
            <select
              id="contact-subject"
              {...register("subject")}
              className="h-11 w-full rounded-lg border border-border bg-background-secondary px-4 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">Select a subject</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Product Availability">Product Availability</option>
              <option value="Bulk Order">Bulk Order</option>
              <option value="Feedback">Feedback</option>
              <option value="Other">Other</option>
            </select>
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">{errors.subject.message}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label
              htmlFor="contact-message"
              className="text-xs font-semibold uppercase tracking-wider text-text-primary"
            >
              Message *
            </label>
            <span className="font-mono text-[10px] text-text-muted">
              {messageValue.length} / 2000
            </span>
          </div>
          <textarea
            id="contact-message"
            {...register("message")}
            rows={5}
            maxLength={2000}
            className="w-full resize-none rounded-lg border border-border bg-background-secondary px-4 py-3 text-sm text-text-primary transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="Tell us how we can help you..."
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
          size="lg"
          id="contact-submit-btn"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>

      {/* Store Info Card */}
      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-white p-6">
          <h3
            className="text-lg font-bold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Visit Our Store
          </h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <p className="text-sm text-text-muted">
                Delhi Shoe Palace, Karol Bagh,
                <br />
                New Delhi, India — 110005
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-accent" />
              <a
                href="tel:+919999999999"
                className="text-sm text-text-muted hover:text-accent"
              >
                +91 99999 99999
              </a>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
              <div className="text-sm text-text-muted">
                <p>Mon — Sat: 10:00 AM to 9:00 PM</p>
                <p>Sunday: 11:00 AM to 7:00 PM</p>
              </div>
            </div>
          </div>
          <a
            href={getWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-sm font-semibold text-white transition-colors hover:bg-[#20BD5A]"
          >
            <MessageCircle className="h-4 w-4" />
            Chat on WhatsApp
          </a>
        </div>

        {/* Mini map */}
        <div className="overflow-hidden rounded-xl border border-border">
          {process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ? (
            <iframe
              src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
              className="h-[200px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Delhi Shoe Palace Location"
            />
          ) : (
            <div className="flex h-[200px] items-center justify-center bg-muted p-4 text-center">
              <div>
                <MapPin className="mx-auto h-8 w-8 text-text-muted" />
                <p className="mt-2 text-xs text-text-muted">
                  Karol Bagh, New Delhi
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
