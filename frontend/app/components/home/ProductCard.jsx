import Image from "next/image";
import Link from "next/link";
import LikeButton from "./LikeButton";
import { FaStar } from "react-icons/fa";

export default function ProductCard({ product }) {
  const PRODUCT_IMAGE_URL = "http://localhost:5000/images/products";
  return (
    //1. Added 'group' here to track hover state
    <Link
      href=""
      className="border border-gray-300 rounded-lg cursor-pointer block w-full"
    >
      <div className="group rounded-lg overflow-hidden relative w-full">
        <div className="relative overflow-hidden aspect-4/5 bg-white">
          {product.isBestSeller && (
            <p className="bg-[#0C4E4A] text-white rounded-tl-lg rounded-br-lg absolute top-0 left-0 z-10 py-1 px-2">
              best seller
            </p>
          )}
          <Image
            src={
              `${PRODUCT_IMAGE_URL}/${product?.coverImage}` ||
              "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg"
            }
            fill // Changed from fixed width/height
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 16vw"
            alt="Product"
            className="object-contain transform transition-normal duration-200 ease-in-out group-hover:scale-110"
            unoptimized
          />
          {/* Like button positioning */}

          <LikeButton />
        </div>
        <div className="p-2 bg-card">
          <p className="text-primary font-bold dark:text-primary-text">{product.title}</p>
          <div className="bg-badge w-fit rounded-lg flex justify-center items-center gap-1 py-0 px-1 text-xs">
            <FaStar className="text-green-700" />
            <span className="font-bold">{product.avgRating}</span>
            <span>({product.nReviews})</span>
          </div>
          <div className="flex justify-center items-center gap-1 w-fit">
            <p className="font-serif text-xs">EGP</p>
            <p className="font-bold">
              {product.price?.$numberDecimal || product.price}
            </p>
          </div>
        </div>
        <div className="p-1 text-center text-white bg-primary rounded-lg shadow-md transition-all duration-300 hover:bg-primary-hover cursor-pointer">
          Add to Cart
        </div>
      </div>
    </Link>
  );
}
