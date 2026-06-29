import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma, caseInsensitive } from "@/lib/prisma";
import { brandSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const brands = await prisma.brand.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(brands);
  } catch (error) {
    console.error("Failed to query brands:", error);
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
    const validated = brandSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, logo, description } = validated.data;

    // Check unique brand name
    const existing = await prisma.brand.findFirst({
      where: {
        name: {
          equals: name,
          ...caseInsensitive(),
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A brand with this name already exists" },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = slugify(name);
    let slug = baseSlug;
    let counter = 1;
    while (true) {
      const existingSlug = await prisma.brand.findUnique({
        where: { slug },
      });
      if (!existingSlug) break;
      counter++;
      slug = `${baseSlug}-${counter}`;
    }

    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        logo: logo || null,
        description: description || null,
      },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Failed to create brand:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
