import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const PRODUCT_IMAGE_URL = "http://localhost:5000/images/products";

  return (
    // Single flex container - removed nested wrapper div
    <div className="border dark:border-0 border-gray-300 rounded-lg cursor-pointer flex flex-col w-full h-full bg-white overflow-hidden">
      {/* Image Link - separate from content */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative overflow-hidden aspect-[4/5] bg-white shrink-0 group"
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
              ? `${PRODUCT_IMAGE_URL}/${product.coverImage}`
              : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg"
          }
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
          alt={product.title || "Product"}
          className="object-contain transform transition-transform duration-200 ease-in-out group-hover:scale-110"
          unoptimized
        />
        <LikeButton />
      </Link>

      {/* Content - flex-1 pushes button to bottom */}
      <div className="p-2 bg-card flex-1 flex flex-col">
        <Link href={`/product/${product.slug}`}>
          <p className="text-primary font-bold dark:text-primary-text text-sm line-clamp-2 mb-1 hover:underline">
            {product.title}
          </p>
        </Link>

        <div className="bg-badge w-fit rounded-lg flex items-center gap-1 py-0.5 px-1.5 text-xs mb-1">
          <FaStar className="text-green-700 dark:text-[#e3e3e3] text-[10px]" />
          <span className="font-bold">{product.avgRating}</span>
          <span className="text-gray-500">({product.nReviews})</span>
        </div>

        <div className="flex items-center gap-1 w-fit mb-2">
          <p className="font-serif text-xs text-gray-600">EGP</p>
          <p className="font-bold text-sm">
            {product.price?.$numberDecimal || product.price}
          </p>
        </div>

        {/* Button - mt-auto pushes to bottom of card */}
        <button className="w-full p-2 text-center text-white bg-primary rounded-lg shadow-md transition-all duration-300 hover:bg-primary-hover text-sm font-medium mt-auto">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
