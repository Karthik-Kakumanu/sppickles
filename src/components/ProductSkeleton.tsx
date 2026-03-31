/**
 * Product Skeleton Loader
 * Shows while products are loading
 */
export function ProductSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-gray-200 animate-pulse">
      {/* Image skeleton */}
      <div className="w-full aspect-square bg-gray-300" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-4 bg-gray-300 rounded w-full" />
        <div className="h-4 bg-gray-300 rounded w-5/6" />
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-gray-300 rounded flex-1" />
          <div className="h-10 bg-gray-300 rounded-full w-10" />
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
