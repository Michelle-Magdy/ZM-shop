import Categories from "@/components/Categories";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import ProductCard from "@/components/ProductCard";
import TopHeader from "@/components/TopHeader";
import Image from "next/image";
import Link from "next/link";
import { FaMoon, FaSun } from "react-icons/fa";

export default function Home() {
  return (
    <>
      <TopHeader />
      <Header />
      <Menu>
        <Categories />
      </Menu>
      <ProductCard />
    </>
  );
}
