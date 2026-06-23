import { randomBytes } from "crypto";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/resend";
import { fail, message } from "@/lib/api";
import { forgotPasswordSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (!user?.email || !user.password) {
      return message("If an account exists, a reset link has been sent.");
    }

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.deleteMany({ where: { email: user.email } });
    await prisma.passwordResetToken.create({
      data: { email: user.email, token, expires },
    });

    if (process.env.RESEND_API_KEY) {
      await sendPasswordResetEmail(user.email, token);
    } else {
      console.warn("RESEND_API_KEY is missing. Password reset token:", token);
    }

    return message("If an account exists, a reset link has been sent.");
  } catch (error) {
    console.error("Forgot password error:", error);
    return fail("Unable to start password reset", 500);
  }
}
