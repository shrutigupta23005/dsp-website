import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Delhi Shoe Palace — how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg-primary)" }}>
      <div className="container-narrow section-pad">
        <div className="mb-12">
          <p className="eyebrow mb-3">Legal</p>
          <h1
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            Last updated: July 8, 2026
          </p>
        </div>

        <div
          className="prose max-w-none space-y-8"
          style={{ color: "var(--text-primary)" }}
        >
          <Section title="1. Introduction">
            <p>Delhi Shoe Palace (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is a retail footwear store located in Karol Bagh, New Delhi, India. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.</p>
            <p>By using our website, you agree to the collection and use of information in accordance with this policy.</p>
          </Section>

          <Section title="2. Information We Collect">
            <p><strong>Account Data:</strong> When you create an account, we collect your name, email address, and optionally your profile picture (via Google OAuth).</p>
            <p><strong>Browsing Data:</strong> We track which products you view, add to wishlists, or compare to provide personalized recommendations.</p>
            <p><strong>Contact Data:</strong> When you submit our contact form, we collect your name, email, phone number (optional), and message.</p>
            <p><strong>Cookies:</strong> We use essential cookies for authentication and optional analytics cookies to understand how visitors use our site.</p>
          </Section>

          <Section title="3. How We Use Your Data">
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide and maintain our digital catalog</li>
              <li>Personalize your browsing experience with recommendations</li>
              <li>Process your contact form inquiries</li>
              <li>Send newsletter updates (only with your explicit consent)</li>
              <li>Analyze site traffic and usage patterns</li>
              <li>Improve our website and services</li>
            </ul>
          </Section>

          <Section title="4. Cookies">
            <p><strong>Essential Cookies:</strong> Required for authentication and core website functionality. Cannot be disabled.</p>
            <p><strong>Analytics Cookies:</strong> We use Google Analytics to understand how visitors interact with our website. This data is anonymized and helps us improve our services.</p>
            <p><strong>Marketing Cookies:</strong> Currently not in use. If implemented, we will update this policy and request your consent.</p>
            <p>You can manage your cookie preferences at any time through the Cookie Settings banner.</p>
          </Section>

          <Section title="5. Data Retention">
            <p><strong>Account Data:</strong> Retained for as long as your account is active. You can delete your account at any time from your profile settings.</p>
            <p><strong>Browsing Data:</strong> Recently viewed products are stored for 90 days. Wishlist data is retained until you remove items or delete your account.</p>
            <p><strong>Contact Submissions:</strong> Retained for up to 2 years for customer service purposes.</p>
            <p><strong>Newsletter Data:</strong> Retained until you unsubscribe. You can unsubscribe at any time via the link in our emails.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the right to:</p>
            <ul>
              <li><strong>Access</strong> your personal data via the &quot;Download My Data&quot; feature in your profile</li>
              <li><strong>Delete</strong> your account and all associated data</li>
              <li><strong>Unsubscribe</strong> from our newsletter at any time</li>
              <li><strong>Manage</strong> cookie preferences via the Cookie Settings banner</li>
              <li><strong>Request correction</strong> of inaccurate personal data</li>
            </ul>
          </Section>

          <Section title="7. Third-Party Services">
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Cloudinary:</strong> For image hosting and optimization</li>
              <li><strong>Google Analytics:</strong> For website traffic analysis</li>
              <li><strong>Google OAuth:</strong> For social login authentication</li>
              <li><strong>Resend:</strong> For transactional email delivery</li>
              <li><strong>Sentry:</strong> For error monitoring and reporting</li>
            </ul>
            <p>Each of these services has their own privacy policy governing the use of your information.</p>
          </Section>

          <Section title="8. Contact Us">
            <p>If you have any questions about this Privacy Policy, you can contact us at:</p>
            <ul>
              <li><strong>Email:</strong> contact@delhishoepalace.com</li>
              <li><strong>WhatsApp:</strong> +91 99999 99999</li>
              <li><strong>Address:</strong> Delhi Shoe Palace, Karol Bagh, New Delhi, India — 110005</li>
            </ul>
          </Section>

          <Section title="9. Updates to This Policy">
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.</p>
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
