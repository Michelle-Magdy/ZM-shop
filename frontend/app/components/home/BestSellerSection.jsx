import { getBestSellerProducts } from "@/lib/api/products";
import Products from "./ProductList";

export default async function BestSellerSection() {
  let products = null;

  try {
    products = await getBestSellerProducts();
  } catch (error) {
    console.error("Failed to fetch best seller products:", error);
    return null; // Return null to hide section on error
  }

  if (!products) return null;

  return <Products products={products} type="bestSeller" />;
}
