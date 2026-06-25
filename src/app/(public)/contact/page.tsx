import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Delhi Shoe Palace. Visit our store in Karol Bagh, New Delhi, or send us a message.",
};

export default function ContactPage() {
  return (
    <div className="bg-background-secondary pt-28">
      <section className="container-wide section-pad">
        <div className="mb-12">
          <span className="mb-4 inline-block font-mono text-xs font-bold uppercase tracking-[0.18em] text-accent">
            Get In Touch
          </span>
          <h1
            className="text-4xl font-bold text-text-primary md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We Would Love to Hear From You
          </h1>
          <span className="golden-rule mt-4" />
          <p className="mt-4 max-w-lg text-text-muted">
            Have a question about a product, need help with sizing, or want to
            place a bulk order? Drop us a message and we will get back to you
            within 24 hours.
          </p>
        </div>
        <ContactForm />
      </section>
    </div>
  );
}
