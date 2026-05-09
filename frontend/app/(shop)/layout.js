import TopHeader from "@/app/components/TopHeader";
import Menu from "@/app/components/Menu";
import Footer from "@/app/components/Footer";

export default function ShopLayout({ children }) {
  return (
    <>
      <TopHeader />
      <Menu />

      <main className="px-3 m-0 md:px-6 lg:px-14">
        <div className="container mx-auto">{children}</div>
      </main>

      <Footer />
    </>
  );
}