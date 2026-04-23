import { getProductsByCategory } from "@/lib/api/products";
import { notFound } from "next/navigation";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

export default async function ProductsSection({ slug, filters }) {
  const products = await getProductsByCategory(slug, filters);

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
