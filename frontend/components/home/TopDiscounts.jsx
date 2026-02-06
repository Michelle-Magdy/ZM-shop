"use client";
import DiscountCard from "./DiscountCards";
import { useEffect, useState } from "react";

const data = [
  {
    _id: "1234567890",
    name: "Samsung Galaxy S21 Ultra 5G Excellent Edition",
    oldPrice: 479,
    newPrice: 349,
    badge: "Gorilla Glass Victus",
    imageUrl:
      "https://coderplace.net/prestashop/PRS02/PRS02045/demo2/modules/cp_imageslider/views/images/sample-1.webp",
  },
  {
    _id: "0987654321",
    name: "Apple iPhone 13 Pro Max",
    oldPrice: 1099,
    newPrice: 999,
    badge: "Apple Certified Refurbished",
    imageUrl:
      "https://coderplace.net/prestashop/PRS02/PRS02045/demo2/modules/cp_imageslider/views/images/sample-2.webp",
  },
  {
    _id: "0987654322",
    name: "Apple iPhone 12 Pro Max",
    oldPrice: 12321,
    newPrice: 0,
    badge: "Apple Certified Refurbished",
    imageUrl:
      "https://coderplace.net/prestashop/PRS02/PRS02045/demo2/modules/cp_imageslider/views/images/sample-2.webp",
  },
];

export default function TopDiscounts() {
  const [slide, setSlide] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % data.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [resetKey]);

  // Go to specific slide and reset timer
  const goToSlide = (index) => {
    setSlide(index);
    setResetKey((prev) => prev + 1);
  };

  // Go to next slide and reset timer
  const handleNextSlide = () => {
    setSlide((prev) => (prev + 1) % data.length);
    setResetKey((prev) => prev + 1);
  };

  // Go to previous slide and reset timer
  const handlePrevSlide = () => {
    setSlide((prev) => (prev - 1 + data.length) % data.length);
    setResetKey((prev) => prev + 1);
  };

  return (
    <div className="container mx-auto ">
      <div className="py-6 sm:py-8 lg:py-10 w-full">
        <div className="relative overflow-hidden bg-[#F6F6F6] rounded-lg">
          {/* Slider track */}
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {data.map((item) => (
              <div key={item._id} className="w-full shrink-0">
                <DiscountCard data={item} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 bg-white/80 hover:bg-white opacity-0 hover:opacity-100 p-2 rounded-full shadow-lg z-10"
            aria-label="Previous slide"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={handleNextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 bg-white/80 hover:bg-white opacity-0 hover:opacity-100 p-2 rounded-full shadow-lg z-10"
            aria-label="Next slide"
          >
            <svg
              className="w-5 h-5 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Dots - positioned at bottom center inside container */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {data.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === slide
                    ? "bg-primary w-6"
                    : "bg-gray-400 hover:bg-gray-500 w-2.5"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
