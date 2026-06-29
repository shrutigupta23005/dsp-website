import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { deleteImage } from "@/lib/cloudinary";

const productUpdateSchema = productSchema.partial();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        sizes: true,
        colors: true,
        brand: true,
        category: true,
        subcategory: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    // Partial Zod validation
    const validated = productUpdateSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { sizes, colors, ...productData } = validated.data;

    // Use transaction to update product and replace sizes/colors if provided
    const updatedProduct = await prisma.$transaction(async (tx) => {
      // 1. Update Sizes
      if (sizes) {
        await tx.productSize.deleteMany({
          where: { productId: id },
        });
        if (sizes.length > 0) {
          await tx.productSize.createMany({
            data: sizes.map((s) => ({
              productId: id,
              size: s.size,
              isAvailable: s.isAvailable,
            })),
          });
        }
      }

      // 2. Update Colors
      if (colors) {
        await tx.productColor.deleteMany({
          where: { productId: id },
        });
        if (colors.length > 0) {
          await tx.productColor.createMany({
            data: colors.map((c) => ({
              productId: id,
              name: c.name,
              hexCode: c.hexCode || null,
            })),
          });
        }
      }

      // 3. Update Product fields
      return await tx.product.update({
        where: { id },
        data: productData,
        include: {
          images: {
            orderBy: { order: "asc" },
          },
          sizes: true,
          colors: true,
        },
      });
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete all images from Cloudinary
    for (const image of product.images) {
      if (image.publicId) {
        try {
          await deleteImage(image.publicId);
        } catch (cloudinaryErr) {
          console.error("Cloudinary image deletion failed for", image.publicId, cloudinaryErr);
        }
      }
    }

    // Delete product (Cascade deletes sizes, colors, images, wishlist, recently viewed)
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("Failed to delete product:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
