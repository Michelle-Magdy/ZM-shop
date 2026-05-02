import { getFeaturedProducts } from "@/lib/api/products";
import Products from "./ProductList";

export default async function FeaturedSection() {
  let products = null;

  try {
    products = await getFeaturedProducts();
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return null; // Return null to hide section on error
  }

  if (!products) return null;

  return <Products products={products} type="featured" />;
}
