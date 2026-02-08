import { getProductsByCategory } from "@/lib/api/products";
import Navigation from "@/app/components/category/Navigation.";

export default async function categoryPage({ params }) {
    const { slug } = await params;
    // const products = await getProductsByCategory(slug);

    return <Navigation slug={slug} />;
}
