import ProductView from "@/app/components/product/view/ProductView";
import RatingSection from "@/app/components/product/review/RatingSection";
import { getProduct } from "@/lib/api/products";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  try {
    product = await getProduct(slug);
  } catch (error) {
    console.error("Failed to fetch product:", slug, error);
    notFound();
  }

  if (!product || !product.data) {
    notFound();
  }
  return (
    <>
      <ProductView product={product.data} />
      <RatingSection product={product.data} />
    </>
  );
}
