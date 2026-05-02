import { getTopDiscountedProducts } from "@/lib/api/products";
import TopDiscounts from "./TopDiscounts";

export default async function TopDiscountsSection() {
  let products = null;

  try {
    products = await getTopDiscountedProducts();
  } catch (error) {
    console.error("Failed to fetch top discounted products:", error);
    return null; // Return null to hide section on error
  }

  if (!products) return null;

  return <TopDiscounts data={products.data} />;
}
