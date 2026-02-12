import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
      {Array.from({ length: 10 }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
