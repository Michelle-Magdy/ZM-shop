import Categories from "@/app/components/home/Categories";
import Menu from "@/app/components/Menu";
import Products from "./components/home/ProductList";
import TopDiscounts from "@/app/components/home/TopDiscounts";
import ShopByCategory from "@/app/components/home/ShopByCategory";

export default function Home() {
  return (
    <>
      <TopDiscounts />
      <Products />
      <ShopByCategory />
    </>
  );
}
