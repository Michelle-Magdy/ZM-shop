import { apiClient } from "@/lib/api/axios";
import ProductGrid from "@/app/components/category/ProductGrid";
import { getProductsByCategory } from "@/lib/api/products";
import Navigation from "@/app/components/category/Navigation.";
import { useCategories } from "@/app/context/CategoriesProvider";
import ProductsSection from "@/app/components/category/ProductsSection";
import Fitlers from "@/app/components/category/Filters";

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const queryParams = await searchParams;
  const page = parseInt(queryParams.page) || 1;
  const limit = parseInt(queryParams.limit) || 20;
  return (
    <div className="grid">
      <Fitlers />
      <div>
        <Navigation slug={slug} />
        <ProductsSection slug={slug} page={page} limit={limit || 20} />
      </div>
    </div>
  );
}
