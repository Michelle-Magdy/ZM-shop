import { getFeaturedProducts } from "@/lib/api/products";
import Products from "./ProductList";

export default async function FeaturedSection() {
  const products = await getFeaturedProducts();
  return <Products products={products} type="featured" />;
}
