import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { fail, ok, requireUser } from "@/lib/api";

const recentlyViewedSchema = z.object({
  productId: z.string().cuid(),
});

export async function GET() {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const items = await prisma.recentlyViewed.findMany({
      where: { userId: session.user.id },
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
      orderBy: { viewedAt: "desc" },
      take: 24,
    });

    return ok(items);
  } catch (error) {
    console.error("Recently viewed GET error:", error);
    return fail("Failed to fetch recently viewed products", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session, response } = await requireUser();
    if (response) return response;

    const parsed = recentlyViewedSchema.safeParse(await request.json());
    if (!parsed.success) return fail(parsed.error.errors[0].message, 400);

    await prisma.recentlyViewed.upsert({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId: parsed.data.productId,
        },
      },
      create: {
        userId: session.user.id,
        productId: parsed.data.productId,
      },
      update: {
        viewedAt: new Date(),
      },
    });

    return ok({ productId: parsed.data.productId });
  } catch (error) {
    console.error("Recently viewed POST error:", error);
    return fail("Failed to log recently viewed product", 500);
  }
}
