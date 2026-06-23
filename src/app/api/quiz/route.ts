import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma, caseInsensitive } from "@/lib/prisma";
import { fail, ok, requireUser } from "@/lib/api";
import { quizSchema } from "@/lib/validators";

const colorFamilies: Record<string, string[]> = {
  Neutral: ["Black", "White", "Grey", "Brown", "Tan", "Navy", "Beige"],
  Bold: ["Red", "Blue", "Green", "Orange", "Yellow", "Multi", "Burgundy"],
  Pastel: ["Pink", "Lavender", "Rose", "Pale Ivory"],
  All: [],
};

const budgetRanges: Record<string, { lte?: number; gte?: number }> = {
  under500: { lte: 500 },
  "500to1500": { gte: 500, lte: 1500 },
  "1500to3000": { gte: 1500, lte: 3000 },
  above3000: { gte: 3000 },
};

export async function POST(request: NextRequest) {
  try {
    const { response } = await requireUser();
    if (response) return response;

    const parsed = quizSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const answers = parsed.data;
    const where: Prisma.ProductWhereInput = {
      gender: answers.gender,
      subcategory: { name: { contains: answers.occasion, ...caseInsensitive() } },
      price: budgetRanges[answers.budget],
    };

    const colors = colorFamilies[answers.colorFamily];
    if (colors.length) {
      where.colors = { some: { name: { in: colors, ...caseInsensitive() } } };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        brand: { select: { id: true, name: true, slug: true, logo: true } },
        category: { select: { id: true, name: true, slug: true, gender: true } },
        subcategory: { select: { id: true, name: true, slug: true } },
        images: { orderBy: { order: "asc" } },
        sizes: true,
        colors: true,
      },
      orderBy: [{ isFeatured: "desc" }, { viewCount: "desc" }],
      take: 12,
    });

    return ok(products);
  } catch (error) {
    console.error("Quiz POST error:", error);
    return fail("Failed to calculate recommendations", 500);
  }
}
