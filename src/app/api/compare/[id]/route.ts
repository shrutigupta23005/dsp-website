import { prisma } from "@/lib/prisma";
import { fail, message, requireUser } from "@/lib/api";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { session, response } = await requireUser();
    if (response) return response;
    const { id: productId } = await params;

    const comparison = await prisma.comparison.findFirst({ where: { userId: session.user.id } });
    if (!comparison) return message("Product removed from compare");

    await prisma.comparisonProduct.deleteMany({
      where: {
        comparisonId: comparison.id,
        productId,
      },
    });

    return message("Product removed from compare");
  } catch (error) {
    console.error("Compare DELETE error:", error);
    return fail("Failed to remove product from comparison", 500);
  }
}
