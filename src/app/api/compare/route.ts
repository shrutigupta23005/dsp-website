import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireUser } from "@/lib/api";

const compareSchema = z.object({
  productId: z.string().cuid(),
});

async function getOrCreateComparison(userId: string) {
  const existing = await prisma.comparison.findFirst({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
  if (existing) return existing;
  return prisma.comparison.create({ data: { userId } });
}

export async function GET() {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const comparison = await prisma.comparison.findFirst({
      where: { userId: session.user.id },
      include: {
        products: {
          include: {
            product: {
              include: {
                brand: { select: { id: true, name: true, slug: true, logo: true } },
                category: { select: { id: true, name: true, slug: true, gender: true } },
                subcategory: { select: { id: true, name: true, slug: true } },
                images: { orderBy: { order: "asc" } },
                sizes: true,
                colors: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return ok(comparison?.products.map((item) => item.product) || []);
  } catch (error) {
    console.error("Compare GET error:", error);
    return fail("Failed to fetch comparison list", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const parsed = compareSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    const comparison = await getOrCreateComparison(session.user.id);
    const count = await prisma.comparisonProduct.count({ where: { comparisonId: comparison.id } });
    const existing = await prisma.comparisonProduct.findUnique({
      where: {
        comparisonId_productId: {
          comparisonId: comparison.id,
          productId: parsed.data.productId,
        },
      },
    });

    if (existing) return ok({ productId: parsed.data.productId });
    if (count >= 3) return fail("You can compare up to 3 products at a time", 409);

    await prisma.comparisonProduct.create({
      data: {
        comparisonId: comparison.id,
        productId: parsed.data.productId,
      },
    });
    await prisma.comparison.update({ where: { id: comparison.id }, data: { updatedAt: new Date() } });

    return ok({ productId: parsed.data.productId }, { status: 201 });
  } catch (error) {
    console.error("Compare POST error:", error);
    return fail("Failed to add product to comparison", 500);
  }
}
