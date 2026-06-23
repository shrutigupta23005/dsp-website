import { NextRequest } from "next/server";
import { productSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

type AdminProductImageInput = {
  url: string;
  publicId?: string | null;
  type?: "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE";
  alt?: string | null;
};

export async function GET() {
  const { response } = await requireAdmin();
  if (response) return response;
  const products = await prisma.product.findMany({
    include: { brand: true, category: true, subcategory: true, images: true, sizes: true, colors: true },
    orderBy: { updatedAt: "desc" },
  });
  return ok(products);
}

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const images = Array.isArray(body.images) ? (body.images as AdminProductImageInput[]) : [];
    const product = await prisma.product.create({
      data: {
        name: parsed.data.name,
        slug: parsed.data.slug || slugify(parsed.data.name),
        description: parsed.data.description,
        price: parsed.data.price,
        brandId: parsed.data.brandId,
        categoryId: parsed.data.categoryId,
        subcategoryId: parsed.data.subcategoryId,
        gender: parsed.data.gender,
        material: parsed.data.material,
        status: parsed.data.status,
        isFeatured: parsed.data.isFeatured,
        images: { create: images.map((image, order) => ({ url: image.url, publicId: image.publicId, type: image.type, order, alt: image.alt })) },
        sizes: { create: parsed.data.sizes },
        colors: { create: parsed.data.colors },
      },
    });
    return ok(product, { status: 201 });
  } catch (error) {
    console.error("Admin product create error:", error);
    return fail("Failed to create product", 500);
  }
}
