"use client";

import Link from "next/link";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";

export default function DiscountCard({ data }) {
    return (
        <div
            className="relative w-full bg-cover bg-center bg-no-repeat flex items-center"
            style={{
                backgroundImage: `url(${PRODUCT_IMAGE_URL}/products/${data?.coverImage})`,
                backgroundSize: "contain"
            }}
        >
            {/* Additional dark overlay for text readability */}
            <div className="absolute inset-0 dark:bg-linear-to-r dark:from-[#1c1c1d]/60 dark:to-transparent" />

            {/* Text Content */}
            <div className="relative z-10 w-full sm:w-3/4 lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
                <div className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 mb-2 bg-white/90 dark:bg-[#252728]/90 inline-block px-2 py-1 rounded w-fit">
                    {data?.isBestSeller
                        ? "Best Seller"
                        : data?.isFeatured
                          ? "Featured"
                          : ""}
                </div>

                {/* Title - white in dark mode */}
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 dark:text-white drop-shadow-lg leading-tight">
                    {data?.title.split(" ").slice(0, 2).join(" ")}
                    <br />
                    Ultra 5G Excellent
                    <br />
                    <strong>Edition</strong>
                </h2>

                {/* Price box - dark in dark mode */}
                <div className="mb-4 bg-white/95 dark:bg-[#252728]/95 inline-block px-3 sm:px-4 py-2 rounded-lg w-fit">
                    <span className="text-gray-500 dark:text-gray-400 line-through text-sm sm:text-base">
                        Old Price: ${data?.olderPrice}
                    </span>
                    <br />
                    <strong className="text-lg sm:text-xl dark:text-white">
                        New Price: ${data?.price}
                    </strong>
                </div>

                <Link
                    href={`/product/${data?.slug}`}
                    className="bg-primary px-4 sm:px-6 w-fit py-2.5 sm:py-3 rounded-md mt-2 inline-block sm:w-fit text-center sm:text-left dark:hover:bg-primary-hover transition-colors shadow-lg text-sm sm:text-base text-white"
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}
//http://localhost:5000/images/mencotton.webp)