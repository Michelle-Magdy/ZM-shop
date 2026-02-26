import Image from "next/image";
import Link from "next/link";
import LikeButton from "./home/LikeButton";
import { FaStar } from "react-icons/fa";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";
import AddToCartButton from "../UI/AddToCartButton";

export default function ProductCard({ product }) {
    const selectedVariant = product.defaultVariant || null;
    return (
        // Single flex container - removed nested wrapper div
        <div className="border dark:border-0 border-gray-300 rounded-lg cursor-pointer flex flex-col w-full h-full bg-white overflow-hidden">
            {/* Image Link - separate from content */}
            <Link
                href={`/product/${product.slug}`}
                className="block relative overflow-hidden aspect-4/5 bg-white shrink-0 group"
            >
                <div className="absolute top-0 left-0 z-10 ">
                    {product.isBestSeller && !product.isFeatured && (
                        <p className="bg-[#0C4E4A] dark:bg-primary text-white rounded-tl-lg rounded-br-lg py-1 px-2 text-xs font-medium mb-2">
                            best seller
                        </p>
                    )}
                    {product.isFeatured && (
                        <p className="bg-[#0C4E4A] dark:bg-primary text-white rounded-tl-lg rounded-br-lg py-1 px-2 text-xs font-medium mb-2">
                            featured
                        </p>
                    )}
                </div>
                <Image
                    src={
                        product?.coverImage
                            ? `${PRODUCT_IMAGE_URL}/products/${product.coverImage}`
                            : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg"
                    }
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
                    alt={product.title || "Product"}
                    className="object-contain transform transition-transform duration-200 ease-in-out group-hover:scale-110"
                    unoptimized
                />
                <LikeButton productId={product._id} title={product.title} slug={product.slug} selectedVariant={selectedVariant} coverImage={product.coverImage}/>
            </Link>

            {/* Content - flex-1 pushes button to bottom */}
            <div className="p-2 bg-card flex-1 flex flex-col">
                <Link href={`/product/${product.slug}`}>
                    <p className="text-primary font-bold dark:text-primary-text text-sm line-clamp-2 mb-1 hover:underline">
                        {product.title}
                    </p>
                </Link>

                <div className="bg-badge w-fit rounded-lg flex items-center gap-1 py-0.5 px-1.5 text-xs mb-1">
                    <FaStar className="text-green-700 dark:text-button-label text-[10px]" />
                    <span className="font-bold">{product.avgRating}</span>
                    <span className="text-gray-500">({product.nReviews})</span>
                </div>

                <div className="flex items-center gap-1 w-fit mb-2">
                    <p className="font-serif text-xs text-gray-600">EGP</p>
                    <p className="font-bold text-sm">
                        {selectedVariant.price || product.price?.$numberDecimal || product.price}
                    </p>
                </div>

                {/* Button - mt-auto pushes to bottom of card */}
                <AddToCartButton
                    selectedVariant={selectedVariant}
                    productId={product._id}
                    title={product.title}
                    coverImage={product.coverImage}
                    slug={product.slug}
                    compact={true}
                />
            </div>
        </div>
    );
}
