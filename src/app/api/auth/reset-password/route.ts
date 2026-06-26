import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, message } from "@/lib/api";
import { resetPasswordSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const { email, resetToken, newPassword } = parsed.data;

    // Find the reset token
    const token = await prisma.verificationToken.findFirst({
      where: { identifier: `reset_${email}` },
    });

    if (!token || token.token !== resetToken) {
      return fail("Invalid or expired reset token", 400);
    }

    if (token.expires < new Date()) {
      return fail("Reset token has expired. Please start over.", 400);
    }

    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });

    // Clean up reset token
    await prisma.verificationToken.deleteMany({
      where: { identifier: `reset_${email}` },
    });

    return message("Password reset successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    return fail("Unable to reset password", 500);
  }
}
