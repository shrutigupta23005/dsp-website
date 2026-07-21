import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { sendNewsletterWelcome } from "@/lib/resend";

const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  name: z.string().max(100).optional(),
  consent: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimitResult = rateLimit(ip, 2, 3600);
    if (!rateLimitResult) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validated = newsletterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || "Invalid data" },
        { status: 400 }
      );
    }

    const { email, name, consent } = validated.data;

    if (!consent) {
      return NextResponse.json(
        { success: false, error: "Consent required to subscribe" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await prisma.newsletter.findUnique({ where: { email } });

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json({
          success: true,
          message: "You're already subscribed!",
        });
      }

      // Re-subscribe
      await prisma.newsletter.update({
        where: { email },
        data: { subscribed: true, name: name || existing.name },
      });

      // Fire-and-forget welcome email
      sendNewsletterWelcome(email, name || "", existing.unsubscribeToken).catch(
        console.error
      );

      return NextResponse.json(
        { success: true, message: "Welcome back! You've been re-subscribed." },
        { status: 201 }
      );
    }

    // Create new subscriber
    const subscriber = await prisma.newsletter.create({
      data: { email, name },
    });

    // Fire-and-forget welcome email
    sendNewsletterWelcome(email, name || "", subscriber.unsubscribeToken).catch(
      console.error
    );

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
