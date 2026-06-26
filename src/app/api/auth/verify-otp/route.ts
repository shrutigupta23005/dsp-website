import crypto from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api";
import { verifyOtpSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const { email, otp } = parsed.data;

    // Find the OTP token
    const token = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (!token) {
      return fail("Invalid or expired code", 400);
    }

    if (token.token !== otp) {
      return fail("Invalid code. Please check and try again.", 400);
    }

    if (token.expires < new Date()) {
      return fail("Code has expired. Please request a new one.", 400);
    }

    // Generate a temporary reset token
    const resetToken = crypto.randomUUID();

    // Store reset token with "reset_" prefix identifier
    await prisma.verificationToken.create({
      data: {
        identifier: `reset_${email}`,
        token: resetToken,
        expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      },
    });

    // Delete the OTP token
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    return ok({ resetToken });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return fail("Unable to verify code", 500);
  }
}
