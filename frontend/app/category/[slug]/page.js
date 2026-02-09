import { apiClient } from "@/lib/api/axios";
import ProductGrid from "@/app/components/category/ProductGrid";
import { getProductsByCategory } from "@/lib/api/products";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  console.log(products);

  return (
    <div>
      <ProductGrid products={products} />
    </div>
  );
}
