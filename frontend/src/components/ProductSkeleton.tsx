/**
 * Product Skeleton Loader
 * Shows while products are loading
 */
export function ProductSkeleton() {
  return (
    <div className="theme-card animate-pulse overflow-hidden rounded-2xl border border-[#3D7A52]">
      {/* Image skeleton */}
      <div className="aspect-square w-full bg-[#1A3A2A]" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 w-3/4 rounded bg-[#1A3A2A]" />
        <div className="h-4 w-1/2 rounded bg-[#1A3A2A]" />
        <div className="h-4 w-full rounded bg-[#1A3A2A]" />
        <div className="h-4 w-5/6 rounded bg-[#1A3A2A]" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 flex-1 rounded bg-[#1A3A2A]" />
          <div className="h-10 w-10 rounded-full bg-[#1A3A2A]" />
        </div>
      </div>
    </div>
  );
}

export function ProductSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
