import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireAdmin } from "@/lib/api";

const userUpdateSchema = z.object({
  role: z.enum(["USER", "ADMIN"]).optional(),
  isBlocked: z.boolean().optional(),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    const parsed = userUpdateSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    const user = await prisma.user.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true, email: true, role: true, isBlocked: true },
    });
    return ok(user);
  } catch (error) {
    console.error("Admin user update error:", error);
    return fail("Failed to update user", 500);
  }
}
