import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireUser } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET() {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
        _count: {
          select: {
            wishlist: true,
            recentlyViewed: true,
          },
        },
      },
    });

    if (!user) return fail("User not found", 404);

    return ok(user);
  } catch (error) {
    console.error("Profile GET error:", error);
    return fail("Failed to fetch profile", 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const body = await request.json();
    const parsed = profileUpdateSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const { name, email } = parsed.data;

    // If email is being changed, check uniqueness
    if (email && email !== session.user.email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });
      if (existing && existing.id !== session.user.id) {
        return fail("Email is already taken", 409);
      }
    }

    const updateData: Record<string, string> = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        role: true,
      },
    });

    return ok(updatedUser);
  } catch (error) {
    console.error("Profile PATCH error:", error);
    return fail("Failed to update profile", 500);
  }
}
