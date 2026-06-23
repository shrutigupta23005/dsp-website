import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, message, ok, requireAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    return ok(await prisma.category.update({
      where: { id },
      data: { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name) },
    }));
  } catch (error) {
    console.error("Admin category update error:", error);
    return fail("Failed to update category", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return message("Category deleted");
  } catch (error) {
    console.error("Admin category delete error:", error);
    return fail("Failed to delete category", 500);
  }
}
