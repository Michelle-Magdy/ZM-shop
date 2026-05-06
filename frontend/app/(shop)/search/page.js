import ProductsSection from "@/app/components/category/ProductsSection";
import { Suspense } from "react";
import ProductGridSkeleton from "@/app/UI/Skeletons/ProductGridSkeletons";


export const dynamic = "force-dynamic";

export default async function SearchPage({ searchParams }) {
    const { search, page = 1 } = await searchParams;
    console.log(page);
    return (
        <div className="flex flex-col gap-5 overflow-hidden">
            <h1 className="mt-7">Search results for "{search}"</h1>
            <div className="lg:col-span-10 col-span-12 overflow-y-auto h-full ">
                <Suspense fallback={<ProductGridSkeleton />}>
                    <ProductsSection search={search} page={page}/>
                </Suspense>
            </div>
        </div>
    );
}
