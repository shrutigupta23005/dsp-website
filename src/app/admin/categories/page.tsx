import { prisma } from "@/lib/prisma";
import CategoriesManager from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
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

  return (
    <div className="space-y-6">
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
