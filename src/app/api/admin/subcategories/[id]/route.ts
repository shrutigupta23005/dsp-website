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
    const { name } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const subcategory = await prisma.subcategory.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!subcategory) {
      return NextResponse.json({ error: "Subcategory not found" }, { status: 404 });
    }

    // Generate unique slug
    const baseSlug = slugify(`${subcategory.category.slug}-${name}`);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await prisma.subcategory.findFirst({
        where: { slug, id: { not: id } },
      });
      if (!existingSlug) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const updatedSubcategory = await prisma.subcategory.update({
      where: { id },
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(updatedSubcategory);
  } catch (error) {
    console.error("Failed to update subcategory:", error);
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

    // Check if products exist in subcategory
    const productsCount = await prisma.product.count({
      where: { subcategoryId: id },
    });

    if (productsCount > 0) {
      return NextResponse.json(
        { error: "Remove products first" },
        { status: 409 }
      );
    }

    // Delete subcategory
    await prisma.subcategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete subcategory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
