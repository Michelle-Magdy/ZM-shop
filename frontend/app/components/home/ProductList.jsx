"use client";
import { getAllProducts, getFeaturedProducts } from "@/lib/api/products";
import ProductCard from "@/app/components/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";

const titleMap = {
  featured: "Featured Products",
  bestSeller: "Best Seller Products",
};

// Define breakpoints to match Swiper config
const breakpoints = {
  0: { slidesPerView: 2.3 },
  640: { slidesPerView: 2.3 },
  768: { slidesPerView: 4 },
  1024: { slidesPerView: 6 },
};

export default function Products({ products, type }) {
  const [slidesPerView, setSlidesPerView] = useState(2.3);
  const productCount = products.data.length;
  const shouldShowNavigation = productCount > slidesPerView;

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setSlidesPerView(breakpoints[1024].slidesPerView);
      else if (width >= 768) setSlidesPerView(breakpoints[768].slidesPerView);
      else if (width >= 640) setSlidesPerView(breakpoints[640].slidesPerView);
      else setSlidesPerView(breakpoints[0].slidesPerView);
    };

    handleResize(); // Set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="my-3 px-4 relative">
      <h2 className="my-1 text-3xl">{titleMap[type]}</h2>
      <hr className="text-gray-300 mb-4" />
      <div className="relative lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          scrollbar={{
            draggable: true,
            hide: false,
            el: ".custom-products-scrollbar",
          }}
          autoHeight={false}
          spaceBetween={8}
          navigation={
            shouldShowNavigation
              ? {
                  prevEl: ".swiper-button-prev",
                  nextEl: ".swiper-button-next",
                }
              : false
          }
          loop={false}
          pagination={{ clickable: true, dynamicBullets: true }}
          slidesPerView={2.3}
          breakpoints={breakpoints}
          className="h-auto! [&_.swiper-wrapper]:h-auto! [&_.swiper-slide]:h-auto!"
        >
          {products.data.map((product) => (
            <SwiperSlide key={product._id} className="h-auto flex">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-products-scrollbar h-1 bg-white/20 rounded-full mt-4 mx-auto w-32 md:hidden">
          <div className="swiper-scrollbar-drag bg-primary rounded-full" />
        </div>

        {/* Conditionally render navigation buttons */}
        {shouldShowNavigation && (
          <>
            <div className="swiper-button-prev absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden lg:flex items-center justify-center rounded-full bg-primary shadow-lg hover:bg-primary-hover transition-colors disabled:opacity-30 text-white cursor-pointer">
              <FaArrowLeft />
            </div>
            <div className="swiper-button-next absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 items-center justify-center rounded-full bg-primary shadow-lg hover:bg-primary-hover transition-colors disabled:opacity-30 text-white cursor-pointer hidden lg:flex">
              <FaArrowRight />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
