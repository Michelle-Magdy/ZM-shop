import Products from "./components/home/ProductList";
import TopDiscounts from "@/app/components/home/TopDiscounts";
import ShopByCategory from "@/app/components/home/ShopByCategory";
import { getBestSellerProducts, getFeaturedProducts } from "@/lib/api/products";

export default async function Home() {
  const [featuredProducts, bestSellerProducts] = await Promise.all([
    getFeaturedProducts(),
    getBestSellerProducts(),
  ]);
  return (
    <>
      <TopDiscounts />
      <Products products={featuredProducts} type="featured" />
      <ShopByCategory />
      <Products products={bestSellerProducts} type="bestSeller" />
    </>
  );
}
