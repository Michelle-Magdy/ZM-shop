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
    <div>
      <Navigation slug={slug} />
      <div className="grid grid-cols-12 gap-8">
        <div className="lg:col-span-2 lg:block">
          <Suspense fallback={<FiltersSkeleton />}>
            <Filters slug={slug} />
          </Suspense>
        </div>
        <div className="lg:col-span-10 col-span-12 ">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductsSection slug={slug} queryParams={queryParams} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
