import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireAdmin } from "@/lib/api";
import { brandSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  return ok(await prisma.brand.findMany({ include: { _count: { select: { products: true } } } }));
}

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const parsed = brandSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    const brand = await prisma.brand.create({
      data: { ...parsed.data, slug: parsed.data.slug || slugify(parsed.data.name) },
    });
    return ok(brand, { status: 201 });
  } catch (error) {
    console.error("Admin brand create error:", error);
    return fail("Failed to create brand", 500);
  }
}
