import Navigation from "@/app/components/category/Navigation.";
import ProductsSection from "@/app/components/category/ProductsSection";
import Filters from "@/app/components/category/Filters";
import { Suspense } from "react";
import ProductGridSkeleton from "@/app/UI/Skeletons/ProductGridSkeletons";
import FiltersSkeleton from "@/app/UI/Skeletons/FiltersSkeleton";

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const queryParams = await searchParams;

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      <Navigation slug={slug} />
      <div className="lg:flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        <div className="lg:col-span-2 lg:block overflow-y-auto h-full scrollbar-hide">
          <Suspense fallback={<FiltersSkeleton />}>
            <Filters slug={slug} />
          </Suspense>
        </div>
        <div className="lg:col-span-10 col-span-12 overflow-y-auto h-full ">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsSection slug={slug} queryParams={queryParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
