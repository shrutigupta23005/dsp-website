import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireAdmin } from "@/lib/api";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  return ok(await prisma.category.findMany({ include: { subcategories: true } }));
}

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const parsed = categorySchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    const category = await prisma.category.create({
      data: { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name) },
    });
    return ok(category, { status: 201 });
  } catch (error) {
    console.error("Admin category create error:", error);
    return fail("Failed to create category", 500);
  }
}
