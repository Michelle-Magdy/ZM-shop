import ShopByCategory from "@/app/components/home/ShopByCategory";
import BestSellerSection from "./components/home/BestSellerSection";
import FeaturedSection from "./components/home/FeaturedSection";
import TopDiscountsSection from "./components/home/TopDiscountsSection";

export default async function Home() {
  return (
    <>
      <TopDiscountsSection />
      <BestSellerSection />
      <ShopByCategory />
      <FeaturedSection />
    </>
  );
}
