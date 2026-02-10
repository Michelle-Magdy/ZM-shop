import Products from "./components/home/ProductList";
import TopDiscounts from "@/app/components/home/TopDiscounts";
import ShopByCategory from "@/app/components/home/ShopByCategory";
import BestSellerSection from "./components/home/BestSellerSection";
import FeaturedSection from "./components/home/FeaturedSection";

export default async function Home() {
  return (
    <>
      <TopDiscounts />
      <BestSellerSection />
      <ShopByCategory />
      <FeaturedSection />
    </>
  );
}
