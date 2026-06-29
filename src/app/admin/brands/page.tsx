import { prisma } from "@/lib/prisma";
import BrandsManager from "@/components/admin/BrandsManager";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <BrandsManager initialBrands={brands} />
    </div>
  );
}
