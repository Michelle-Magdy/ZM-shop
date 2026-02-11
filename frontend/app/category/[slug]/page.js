import Navigation from "@/app/components/category/Navigation.";
import ProductsSection from "@/app/components/category/ProductsSection";
import Fitlers from "@/app/components/category/Filters";

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const queryParams = await searchParams;

  return (
    <div>
      <Navigation slug={slug} />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-2">
          <Fitlers slug={slug} />
        </div>
        <div className="col-span-10">
          <ProductsSection slug={slug} queryParams={queryParams} />
        </div>
      </div>
    </div>
  );
}
