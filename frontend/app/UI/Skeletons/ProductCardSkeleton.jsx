export default function ProductCardSkeleton() {
  return (
    <div className="border dark:border-0 border-gray-300 rounded-lg flex flex-col w-full h-full bg-white overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="relative overflow-hidden aspect-4/5 bg-gray-200 shrink-0">
        {/* Badge Skeleton */}
        <div className="absolute top-0 left-0 z-10">
          <div className="bg-gray-300 rounded-tl-lg rounded-br-lg py-1 px-2 w-20 h-6"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-2 bg-card flex-1 flex flex-col">
        {/* Title Skeleton */}
        <div className="h-4 bg-gray-200 rounded mb-1 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-3 w-1/2"></div>

        {/* Rating Skeleton */}
        <div className="bg-gray-200 w-fit rounded-lg flex items-center gap-1 py-0.5 px-1.5 mb-1 h-5"></div>

        {/* Price Skeleton */}
        <div className="flex items-center gap-1 w-fit mb-2">
          <div className="h-4 w-8 bg-gray-200 rounded"></div>
          <div className="h-4 w-12 bg-gray-200 rounded"></div>
        </div>

        {/* Button Skeleton */}
        <div className="w-full p-2 bg-gray-300 rounded-lg h-9 mt-auto"></div>
      </div>
    </div>
  );
}
