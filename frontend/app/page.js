import Categories from "@/components/home/Categories";
import Header from "@/components/home/Header";
import Menu from "@/components/home/Menu";
import ProductCard from "@/components/home/ProductCard";
import TopHeader from "@/components/home/TopHeader";
import Image from "next/image";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";
import Products from "../components/home/ProductList";
import TopDiscounts from "@/components/home/TopDiscounts";
import ShopByCategory from "@/components/home/ShopByCategory";

export default function Home() {
  return (
    <>
      <TopHeader />
      <Header />
      <Menu>
        <Categories />
      </Menu>
      <main className="px-6 lg:px-14">
        <TopDiscounts />
        <Products />
        <ShopByCategory />
      </main>
    </>
  );
}
