import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { sendContactReply, sendContactOwnerNotification } from "@/lib/resend";

const contactSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid Indian phone number")
    .optional()
    .or(z.literal("")),
  subject: z.enum(
    ["General Inquiry", "Product Availability", "Bulk Order", "Feedback", "Other"],
    { message: "Please select a subject" }
  ),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(500, "Message must be under 500 characters"),
  token: z.string().optional(),
  honeypot: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Rate limit: 3 requests per hour per IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = rateLimit(ip, 3, 3600);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Honeypot check — if filled, it's a bot
    if (body.honeypot) {
      // Silently succeed to not alert bots
      return NextResponse.json({
        success: true,
        message: "Your message has been sent!",
      });
    }

    const validated = contactSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          success: false,
          error: validated.error.errors[0]?.message || "Invalid form data",
        },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message, token } = validated.data;

    // reCAPTCHA v3 verification (skip if no secret key configured)
    if (process.env.RECAPTCHA_SECRET_KEY && token) {
      try {
        const recaptchaRes = await fetch(
          `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        const recaptchaData = await recaptchaRes.json();
        if (recaptchaData.score < 0.5) {
          return NextResponse.json(
            { success: false, error: "Spam detected. Please try again." },
            { status: 400 }
          );
        }
      } catch (error) {
        console.error("reCAPTCHA verification failed:", error);
        // Continue even if reCAPTCHA fails — don't block legitimate users
      }
    }

    // Send both emails in parallel (fire-and-forget)
    Promise.all([
      sendContactOwnerNotification({ name, email, phone: phone || undefined, subject, message }),
      sendContactReply(email, name),
    ]).catch((error) => {
      console.error("Email sending failed:", error);
    });

    // Also log in dev when Resend isn't configured
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_your-resend-api-key") {
      console.log("Contact form submission (Resend not configured):", {
        name,
        email,
        phone,
        subject,
        message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
