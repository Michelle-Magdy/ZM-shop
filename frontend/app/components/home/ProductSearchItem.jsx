// ProductSearchItem.jsx
import Link from "next/link";
import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function ProductSearchItem({ product }) {
  const PRODUCT_IMAGE_URL = "http://localhost:5000/images/products";
  return (
    <Link
      href={`/product/${product.slug}`}
      className="flex items-start gap-4 p-3 border-b border-gray-200 dark:border-primary hover:bg-gray-100 dark:hover:bg-card transition-colors cursor-pointer"
    >
      {/* Image on the left */}
      <div className="relative w-20 h-20 shrink-0 bg-white rounded overflow-hidden">
        {product.isBestSeller && (
          <p className="bg-[#0C4E4A] text-white text-[10px] rounded-tl rounded-br absolute top-0 left-0 z-10 py-0.5 px-1.5">
            Best Seller
          </p>
        )}
        <Image
          src={
            `${PRODUCT_IMAGE_URL}/${product?.coverImage}` ||
            "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg "
          }
          fill
          sizes="80px"
          alt={product.title}
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Content on the right */}
      <div className="flex-1 min-w-0 flex flex-col justify-center dark:text-primary-text">
        {/* Title */}
        <p className="text-sm font-medium text-gray-900 dark:text-inherit truncate mb-1">
          {product.title}
        </p>

        {/* Price under title */}
        <div className="flex items-center gap-1 mb-1">
          <span className="text-xs text-gray-500">EGP</span>
          <span className="text-base font-bold text-gray-900 dark:text-inherit">
            {product.price?.$numberDecimal || product.price}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <FaStar className="text-green-600 w-3 h-3" />
          <span className="font-medium text-gray-700">{product.avgRating}</span>
          <span className="text-gray-500">({product.nReviews})</span>
        </div>
      </div>
    </Link>
  );
}
