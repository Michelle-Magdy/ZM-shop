import { getProductsByCategory } from "@/lib/api/products";
import { notFound } from "next/navigation";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

export default async function ProductsSection({ slug, filters }) {
  let products = null;

  try {
    products = await getProductsByCategory(slug, filters);
  } catch (error) {
    console.error("Failed to fetch products for category:", slug, error);
    // Return empty state instead of crashing
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

      <Pagination
        currentPage={products.currentPage}
        totalPages={products.totalPages}
        baseUrl={`/category/${slug}`}
      />
    </div>
  );
}
