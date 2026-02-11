import { getBestSellerProducts } from "@/lib/api/products";
import Products from "./ProductList";

export default async function BestSellerSection() {
  const products = await getBestSellerProducts();
  return <Products products={products} type="bestSeller" />;
}
