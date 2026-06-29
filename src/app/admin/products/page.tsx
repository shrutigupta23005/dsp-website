import { prisma } from "@/lib/prisma";
import ProductsTable from "@/components/admin/ProductsTable";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [initialProducts, categories, brands, initialTotal] = await Promise.all([
    prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        images: {
          where: { type: "PRIMARY" },
          take: 1,
        },
        brand: true,
        category: true,
        subcategory: true,
        sizes: true,
        colors: true,
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.brand.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.product.count(),
  ]);

  return (
    <ProductsTable
      initialProducts={initialProducts}
      initialTotal={initialTotal}
      categories={categories}
      brands={brands}
    />
  );
}
