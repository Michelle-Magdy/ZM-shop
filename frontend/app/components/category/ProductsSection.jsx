import { getProductsByCategory, searchProducts } from "@/lib/api/products";
import { notFound } from "next/navigation";
import ProductGrid from "./ProductGrid";
import PaginationServer from "../PaginationServer.jsx";

export default async function ProductsSection({ slug, filters, search, page }) {
    let products = null;

    try {
        if (search) products = await searchProducts(search, page);
        else products = await getProductsByCategory(slug, filters, page);
    } catch (error) {
        console.error(error.message);
        return (
            <div className="flex justify-center items-center font-bold text-4xl text-neutral-500">
                Unable to load products. Please try again later.
            </div>
        );
    }

    if (!products) notFound();
    if (!products.results)
        return (
            <div className="flex justify-center items-center font-bold text-4xl text-neutral-500">
                Products Not Found
            </div>
        );

        return (
        <div>
            <ProductGrid products={products.data} />
            <PaginationServer
                currentPage={products.currentPage}
                totalPages={products.totalPages}
                baseUrl={search ? "/search" : `/category/${slug}`}
            />
        </div>
    );
}
