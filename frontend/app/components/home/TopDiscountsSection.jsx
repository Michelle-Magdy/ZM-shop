import { getTopDiscountedProducts } from "@/lib/api/products";
import TopDiscounts from "./TopDiscounts";

export default async function TopDiscountsSection(){
    const products = await getTopDiscountedProducts();
    return (
        <TopDiscounts data={products.data}/>
    )
}