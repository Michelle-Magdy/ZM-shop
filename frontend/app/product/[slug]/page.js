import ProductView from "@/app/components/product/ProductView";
import RatingSection from "@/app/components/product/RatingSection";
import { getProduct } from "@/lib/api/products";

export default async function ProductPage({params}){
    const {slug} = await params;
    const product = await getProduct(slug);
    return (
        <>
            <ProductView product={product.data}/>
            <RatingSection product={product.data}/>
        </>
    )
}