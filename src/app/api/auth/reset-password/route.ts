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
    if (!body.token || typeof body.token !== "string") return fail("Reset token is required", 400);

    const token = await prisma.passwordResetToken.findUnique({
      where: { token: body.token },
    });

    if (!token || token.expires < new Date()) {
      return fail("This reset link is invalid or expired", 400);
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
    await prisma.user.update({
      where: { email: token.email },
      data: { password: hashedPassword },
    });
    await prisma.passwordResetToken.deleteMany({ where: { email: token.email } });

    return message("Password updated successfully");
  } catch (error) {
    console.error("Reset password error:", error);
    return fail("Unable to reset password", 500);
  }
}
