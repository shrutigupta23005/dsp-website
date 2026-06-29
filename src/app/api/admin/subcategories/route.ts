import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";
import { subcategorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = subcategorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, categoryId } = validated.data;

    // Verify parent category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return NextResponse.json({ error: "Parent category not found" }, { status: 404 });
    }

    // Check unique subcategory name under the same category
    const existing = await prisma.subcategory.findFirst({
      where: {
        name: {
          equals: name,
          ...caseInsensitive(),
        },
        categoryId,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A subcategory with this name already exists in this category" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(`${category.slug}-${name}`);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await prisma.subcategory.findUnique({
        where: { slug },
      });
      if (!existingSlug) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const subcategory = await prisma.subcategory.create({
      data: {
        name,
        slug,
        categoryId,
      },
    });

    return NextResponse.json(subcategory);
  } catch (error) {
    console.error("Failed to create subcategory:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
