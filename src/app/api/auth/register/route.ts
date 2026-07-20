import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signupSchema } from "@/lib/validators";
import { sendWelcomeEmail } from "@/lib/resend";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get("x-forwarded-for") ?? "anonymous";
    if (!rateLimit(`register:${ip}`, 5, 3600)) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    const validated = signupSchema.safeParse({
      ...body,
      confirmPassword: body.confirmPassword || body.password,
    });

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0].message },
        { status: 400 }
      );
    }

    // Zod schema already trims and lowercases email
    const { name, email, password } = validated.data;

    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          emailVerified: new Date(),
        },
      });
    } catch (error: unknown) {
      // Catch Prisma unique constraint violation (duplicate email)
      // Handles race condition from rapid double submissions
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "P2002"
      ) {
        return NextResponse.json(
          { error: "An account with this email already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    // Fire-and-forget welcome email
    sendWelcomeEmail(email, name).catch(() => undefined);

    return NextResponse.json(
      { message: "Account created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
