import ProductCardSkeleton from "./ProductCardSkeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

export default function ProductGridSkeleton({
  count = 12,
}: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
