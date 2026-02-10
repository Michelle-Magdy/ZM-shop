import { apiClient } from "@/lib/api/axios";
import ProductGrid from "@/app/components/category/ProductGrid";
import { getProductsByCategory } from "@/lib/api/products";
import Navigation from "@/app/components/category/Navigation.";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  console.log(products);

  return (
    <div>
      <Navigation slug={slug} />
      <ProductGrid products={products} />
    </div>
  );
}
