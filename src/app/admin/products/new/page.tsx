import { prisma } from "@/lib/prisma";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const [categories, brands] = await Promise.all([
    prisma.category.findMany({
      include: {
        subcategories: true,
      },
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <ProductForm categories={categories} brands={brands} />
    </div>
  );
}
