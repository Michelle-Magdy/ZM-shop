import ProductView from "@/app/components/product/ProductView";
import { getProduct } from "@/lib/api/products";

export default async function ProductPage({params}){
    const {slug} = await params;
    const product = await getProduct(slug);
    return (
        <>
            <ProductView product={product.data}/>
        </>
    )
}