import { Resend } from "resend";
import { contactReplyHtml } from "./emails/contact-reply";
import { contactOwnerHtml } from "./emails/contact-owner";
import { newsletterWelcomeHtml } from "./emails/newsletter-welcome";
import { adminDailyDigestHtml } from "./emails/admin-daily-digest";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = `Delhi Shoe Palace <noreply@${process.env.NEXT_PUBLIC_SITE_DOMAIN || "delhishoepalace.com"}>`;

const emailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body {
        font-family: 'Inter', Arial, sans-serif;
        background-color: #F5F2EE;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 560px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      }
      .header {
        background: #0A0A0A;
        padding: 32px;
        text-align: center;
      }
      .header h1 {
        color: #C9933A;
        font-family: Georgia, serif;
        font-size: 24px;
        margin: 0;
        letter-spacing: -0.02em;
      }
      .body {
        padding: 32px;
        color: #1A1A1A;
        line-height: 1.6;
      }
      .body p {
        margin: 0 0 16px;
        font-size: 15px;
      }
      .button {
        display: inline-block;
        background: #C9933A;
        color: #0A0A0A !important;
        text-decoration: none;
        padding: 14px 32px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin: 8px 0 24px;
      }
      .otp-container {
        text-align: center;
        margin: 24px 0;
      }
      .otp-digit {
        display: inline-block;
        width: 48px;
        height: 48px;
        line-height: 48px;
        text-align: center;
        font-family: 'Courier New', monospace;
        font-size: 28px;
        font-weight: 700;
        color: #C9933A;
        border: 2px solid #C9933A;
        border-radius: 8px;
        margin: 0 4px;
      }
      .footer {
        padding: 24px 32px;
        border-top: 1px solid #E2DDD6;
        font-size: 12px;
        color: #6B6B6B;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Delhi Shoe Palace</h1>
      </div>
      ${content}
    </div>
  </body>
</html>
`;

/**
 * Send OTP email for password reset
 */
export async function sendOtpEmail(
  email: string,
  name: string,
  otp: string
): Promise<void> {
  try {
    const otpDigits = otp
      .split("")
      .map((d) => `<span class="otp-digit">${d}</span>`)
      .join("");

    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Your Password Reset Code — Delhi Shoe Palace",
      html: emailWrapper(`
        <div class="body">
          <p>Hi ${name || "there"},</p>
          <p>Your one-time password is:</p>
          <div class="otp-container">
            ${otpDigits}
          </div>
          <p>This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>Delhi Shoe Palace, Karol Bagh, New Delhi, India</p>
          <p>Visit us in store for the best experience</p>
        </div>
      `),
    });
  } catch (error) {
    console.error("Failed to send OTP email:", error);
  }
}

/**
 * Send a password reset email with a secure token link
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<void> {
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset Your Password — Delhi Shoe Palace",
      html: emailWrapper(`
        <div class="body">
          <p>You requested a password reset for your account.</p>
          <p>Click the button below to set a new password. This link will expire in 1 hour.</p>
          <a href="${resetLink}" class="button">Reset Password</a>
          <p>If you didn't request this, you can safely ignore this email. Your password will not be changed.</p>
        </div>
        <div class="footer">
          <p>Delhi Shoe Palace, Karol Bagh, New Delhi, India</p>
        </div>
      `),
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
  }
}

/**
 * Send a welcome email after signup
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to Delhi Shoe Palace",
      html: emailWrapper(`
        <div class="body">
          <p>Hello ${name},</p>
          <p>Welcome to Delhi Shoe Palace! We're thrilled to have you join our community of footwear enthusiasts.</p>
          <p>With your account, you now have access to our full catalog, personalized recommendations, wishlists, and more.</p>
          <a href="${process.env.NEXTAUTH_URL}" class="button">Explore Collection</a>
          <p>For any inquiries, feel free to reach out on WhatsApp or visit our store in Karol Bagh, New Delhi.</p>
        </div>
        <div class="footer">
          <p>Delhi Shoe Palace — 24 Years of Trust</p>
        </div>
      `),
    });
  } catch (error) {
    console.error("Failed to send welcome email:", error);
  }
}

// ─── Phase 6 Email Functions ─────────────────────────────────

/**
 * Send auto-reply to user when they submit contact form
 */
export async function sendContactReply(
  email: string,
  name: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your message — Delhi Shoe Palace",
      html: contactReplyHtml(name),
    });
  } catch (error) {
    console.error("Failed to send contact reply:", error);
  }
}

/**
 * Send notification to store owner on contact form submission
 */
export async function sendContactOwnerNotification(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: "contact@delhishoepalace.com",
      replyTo: data.email,
      subject: `[Website Contact] ${data.subject} — from ${data.name}`,
      html: contactOwnerHtml(data),
    });
  } catch (error) {
    console.error("Failed to send owner notification:", error);
  }
}

/**
 * Send welcome email to new newsletter subscriber
 */
export async function sendNewsletterWelcome(
  email: string,
  name: string,
  token: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome to the Delhi Shoe Palace Newsletter! 🎉",
      html: newsletterWelcomeHtml(name, email, token),
    });
  } catch (error) {
    console.error("Failed to send newsletter welcome:", error);
  }
}

/**
 * Send daily digest to admin
 */
export async function sendAdminDailyDigest(
  adminEmail: string,
  data: {
    newUsers: number;
    topProducts: { name: string; views: number }[];
    newWishlists: number;
    newContacts: number;
    date: string;
  }
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `Daily Summary — ${data.date} | Delhi Shoe Palace`,
      html: adminDailyDigestHtml(data),
    });
  } catch (error) {
    console.error("Failed to send admin daily digest:", error);
  }
}
