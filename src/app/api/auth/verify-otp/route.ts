import crypto from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok } from "@/lib/api";
import { verifyOtpSchema } from "@/lib/validators";

const MAX_OTP_ATTEMPTS = 5;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = verifyOtpSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    // Zod schema already trims OTP and lowercases email
    const { email, otp } = parsed.data;

    // Find the OTP token
    const token = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (!token) {
      return fail("Invalid or expired code", 400);
    }

    // Check expiry first (clearer error message)
    if (token.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });
      return fail("This code has expired. Please request a new one.", 400);
    }

    // Check if too many failed attempts
    if (token.attempts >= MAX_OTP_ATTEMPTS) {
      // Invalidate the OTP — require a fresh request
      await prisma.verificationToken.deleteMany({
        where: { identifier: email },
      });
      return fail(
        "Too many incorrect attempts. Please request a new code.",
        400
      );
    }

    // Check OTP match
    if (token.token !== otp) {
      // Increment attempt counter
      await prisma.verificationToken.update({
        where: { identifier_token: { identifier: email, token: token.token } },
        data: { attempts: { increment: 1 } },
      });

      const remaining = MAX_OTP_ATTEMPTS - token.attempts - 1;
      return fail(
        remaining > 0
          ? `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`
          : "Too many incorrect attempts. Please request a new code.",
        400
      );
    }

    // OTP is correct — generate a temporary reset token
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
