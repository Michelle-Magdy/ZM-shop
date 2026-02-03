import Categories from "@/components/Categories";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import TopHeader from "@/components/TopHeader";

export default function Home() {
  
  return (
    <>
      <TopHeader />
      <Header />
      <Menu>
        <Categories />
      </Menu>
    </>
  );
}
