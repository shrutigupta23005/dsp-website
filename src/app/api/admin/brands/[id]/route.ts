import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, message, ok, requireAdmin } from "@/lib/api";
import { brandSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    const parsed = brandSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    return ok(await prisma.brand.update({
      where: { id },
      data: { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name) },
    }));
  } catch (error) {
    console.error("Admin brand update error:", error);
    return fail("Failed to update brand", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    await prisma.brand.delete({ where: { id } });
    return message("Brand deleted");
  } catch (error) {
    console.error("Admin brand delete error:", error);
    return fail("Failed to delete brand", 500);
  }
}
