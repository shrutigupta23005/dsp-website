import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";
import { categorySchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        subcategories: {
          include: {
            _count: {
              select: { products: true },
            },
          },
          orderBy: { name: "asc" },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to query categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const validated = categorySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, gender, image } = validated.data;

    // Check unique category name + gender
    const existing = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          ...caseInsensitive(),
        },
        gender,
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A category with this name and gender already exists" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(`${gender}-${name}`);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await prisma.category.findUnique({
        where: { slug },
      });
      if (!existingSlug) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const category = await prisma.category.create({
      data: {
        name,
        gender,
        slug,
        image: image || null,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to create category:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
