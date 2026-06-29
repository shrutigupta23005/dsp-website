import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

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
    const { name, description, logo } = body;

    const brand = await prisma.brand.findUnique({ where: { id } });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    let slug = brand.slug;
    if (name && name !== brand.name) {
      // Re-generate slug
      const baseSlug = slugify(name);
      slug = baseSlug;
      let counter = 1;
      while (true) {
        const existingSlug = await prisma.brand.findFirst({
          where: { slug, id: { not: id } },
        });
        if (!existingSlug) break;
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    }

    const updatedBrand = await prisma.brand.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        slug,
      },
    });

    return NextResponse.json(updatedBrand);
  } catch (error) {
    console.error("Failed to update brand:", error);
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

    // Check if products exist under brand
    const productsCount = await prisma.product.count({
      where: { brandId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "This brand has products. Reassign or delete products first." },
        { status: 409 }
      );
    }

    // Delete brand
    await prisma.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
