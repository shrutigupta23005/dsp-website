import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Delhi Shoe Palace website.",
};

export default function TermsPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <div className="container-narrow section-pad">
        <div className="mb-12">
          <p className="eyebrow mb-3">Legal</p>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Last updated: July 8, 2026
          </p>
        </div>

        <div
          className="prose max-w-none space-y-8"
          style={{ color: "var(--text-primary)" }}
        >
          <Section title="1. Acceptance of Terms">
            <p>By accessing and using the Delhi Shoe Palace website, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our website.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>Delhi Shoe Palace provides a digital catalog for browsing our footwear collection. Our website is an informational and discovery platform — <strong>we do not sell products online</strong>. All purchases must be made at our physical store in Karol Bagh, New Delhi.</p>
            <p>Features include product browsing, wishlists, style quizzes, product comparisons, and WhatsApp inquiry for availability.</p>
          </Section>

          <Section title="3. User Accounts">
            <p>You may create an account to access personalized features such as wishlists and recommendations. You are responsible for:</p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use</li>
            </ul>
            <p>We reserve the right to suspend or terminate accounts that violate these terms.</p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>You agree not to:</p>
            <ul>
              <li>Use the website for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Scrape, crawl, or harvest data from our website without permission</li>
              <li>Submit false or misleading information</li>
              <li>Interfere with or disrupt the website&apos;s operation</li>
              <li>Use automated systems to interact with the website</li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            <p>All content on this website — including text, images, logos, design, and code — is the property of Delhi Shoe Palace or its licensors. Product images may be sourced from brand partners and manufacturers.</p>
            <p>You may not reproduce, distribute, or create derivative works from our content without our written permission.</p>
          </Section>

          <Section title="6. Privacy">
            <p>Your use of our website is also governed by our{" "}
              <Link href="/privacy" className="underline" style={{ color: "var(--accent-color)" }}>
                Privacy Policy
              </Link>
              , which describes how we collect, use, and protect your personal information.
            </p>
          </Section>

          <Section title="7. Limitation of Liability">
            <p>Delhi Shoe Palace provides this website &quot;as is&quot; without warranties of any kind. We are not liable for:</p>
            <ul>
              <li>Any errors or inaccuracies in product information, pricing, or availability</li>
              <li>Any interruption or cessation of our website</li>
              <li>Any loss or damage resulting from your use of the website</li>
            </ul>
            <p>Product prices, availability, and specifications shown on our website are for reference only and may differ from what is available in store.</p>
          </Section>

          <Section title="8. Changes to Terms">
            <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to this page. Your continued use of the website after changes constitutes acceptance of the new terms.</p>
          </Section>

          <Section title="9. Contact Information">
            <p>For questions about these Terms of Service, contact us at:</p>
            <ul>
              <li><strong>Email:</strong> contact@delhishoepalace.com</li>
              <li><strong>Phone:</strong> +91 99999 99999</li>
              <li><strong>Address:</strong> Delhi Shoe Palace, Karol Bagh, New Delhi, India — 110005</li>
            </ul>
          </Section>
        </div>

        <div className="mt-12 pt-8" style={{ borderTop: "1px solid var(--border-color)" }}>
          <Link
            href="/"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--accent-color)" }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2
        className="text-xl font-semibold mb-3"
        style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
      >
        {title}
      </h2>
      <div
        className="space-y-3 text-sm leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-sm"
        style={{ color: "var(--text-muted)" }}
      >
        {children}
      </div>
    </section>
  );
}
