import Navigation from "@/app/components/category/Navigation.";
import ProductsSection from "@/app/components/category/ProductsSection";
import Filters from "@/app/components/category/Filters";
import { Suspense } from "react";
import ProductGridSkeleton from "@/app/UI/Skeletons/ProductGridSkeletons";
import FiltersSkeleton from "@/app/UI/Skeletons/FiltersSkeleton";
import { parseCategoryFilters } from "@/lib/util/ParseCategoryFilters";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const initialFilters = parseCategoryFilters(queryParams, null);
  
  return (
    <div className="flex flex-col">
      <Navigation slug={slug} />
      <div className="lg:flex-1 grid grid-cols-12 gap-8 overflow-hidden">
        <div className="lg:col-span-2 lg:block overflow-y-auto h-full lg:h-[calc(100vh-64px)] scrollbar-hide">
          <Suspense fallback={<FiltersSkeleton />}>
            <Filters slug={slug} initialFilters={initialFilters} />
          </Suspense>
        </div>
        <div className="lg:col-span-10 col-span-12 overflow-y-auto h-full ">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsSection slug={slug} filters={initialFilters} page={queryParams.page}/>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
