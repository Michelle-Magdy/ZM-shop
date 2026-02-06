"use client";
import Link from "next/link";

export default function DiscountCard({ data }) {
  return (
    <div
      className="relative w-full  bg-[#F6F6F6] bg-cover bg-center bg-no-repeat flex items-center"
      style={{
        backgroundImage: `url(${data?.imageUrl})`,
      }}
    >
      {/* Overlay - stronger on mobile for readability */}
      <div className="absolute inset-0 " />

      {/* Text Content - full width on mobile, half on larger screens */}
      <div className="relative z-10 w-full sm:w-3/4 lg:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Badge */}
        <div className="text-xs sm:text-sm text-gray-800 mb-2 bg-white/90 sm:bg-white/80 inline-block px-2 py-1 rounded w-fit">
          {data?.badge}
        </div>

        {/* Title - smaller on mobile */}
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-gray-900 drop-shadow-lg leading-tight">
          {data?.name.split(" ").slice(0, 2).join(" ")}
          <br />
          Ultra 5G Excellent
          <br />
          <strong>Edition</strong>
        </h2>

        {/* Price */}
        <div className="mb-4 bg-white/95 sm:bg-white/90 inline-block px-3 sm:px-4 py-2 rounded-lg w-fit">
          <span className="text-gray-500 line-through text-sm sm:text-base">
            Old Price: ${data?.oldPrice}
          </span>
          <br />
          <strong className="text-lg sm:text-xl">
            New Price: ${data?.newPrice}
          </strong>
        </div>

        <Link
          href={`/product/${data?._id}`}
          className="bg-primary px-4 sm:px-6 w-fit py-2.5 sm:py-3 rounded-md mt-2 inline-block sm:w-fit text-center sm:text-left hover:bg-primary-hover transition-colors shadow-lg text-sm sm:text-base text-white"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
