import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/resend";
import { fail, message } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const { email } = parsed.data;

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user?.email || !user.password) {
      return message("If this email is registered, you'll receive an OTP");
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email, then create new
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      },
    });

    // Send OTP email (fire-and-forget)
    if (process.env.RESEND_API_KEY) {
      sendOtpEmail(email, user.name || "", otp).catch(() => undefined);
    } else {
      console.warn("RESEND_API_KEY missing. OTP:", otp);
    }

    return message("If this email is registered, you'll receive an OTP");
  } catch (error) {
    console.error("Forgot password error:", error);
    return fail("Unable to start password reset", 500);
  }
}
