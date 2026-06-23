import { NextRequest } from "next/server";
import { productSchema } from "@/lib/validators";
import { prisma } from "@/lib/prisma";
import { fail, message, ok, requireAdmin } from "@/lib/api";
import { slugify } from "@/lib/utils";

type AdminProductImageInput = {
  url: string;
  publicId?: string | null;
  type?: "PRIMARY" | "GALLERY" | "LIFESTYLE" | "ALT_ANGLE";
  alt?: string | null;
};

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);
    const images = Array.isArray(body.images) ? (body.images as AdminProductImageInput[]) : [];

    const product = await prisma.$transaction(async (tx) => {
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productSize.deleteMany({ where: { productId: id } });
      await tx.productColor.deleteMany({ where: { productId: id } });
      return tx.product.update({
        where: { id },
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
    });

    return ok(product);
  } catch (error) {
    console.error("Admin product update error:", error);
    return fail("Failed to update product", 500);
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { response } = await requireAdmin();
    if (response) return response;
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return message("Product deleted");
  } catch (error) {
    console.error("Admin product delete error:", error);
    return fail("Failed to delete product", 500);
  }
}
