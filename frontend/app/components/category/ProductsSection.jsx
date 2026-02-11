import { getAllProducts, getProductsByCategory } from "@/lib/api/products";
import { notFound } from "next/navigation";
import ProductGrid from "./ProductGrid";
import Pagination from "./Pagination";

export default async function ProductsSection({ slug, page = 1, limit }) {
  const products = await getProductsByCategory(slug, page, limit);
  if (!products) notFound();
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
