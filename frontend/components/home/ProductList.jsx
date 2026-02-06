"use client";
import { getAllProducts } from "@/lib/api/products";
import ProductCard from "@/components/home/ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar } from "swiper/modules";
import { useQuery } from "@tanstack/react-query";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function Products() {
  const {
    data: products,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["products", "featured"],
    queryFn: getAllProducts,
  });
  // Add this before your return
  if (isLoading)
    return <div className="text-center p-10">Loading products...</div>;
  if (isError)
    return <div className="text-center text-red-500">Error loading data.</div>;

  return (
    <div className="my-3 px-4 relative">
      <h2 className="my-1 text-3xl">Featured Products</h2>
      <hr className="text-gray-300 mb-4" />
      <div className=" relative lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Scrollbar]}
          scrollbar={{
            draggable: true,
            hide: false, // Always show on mobile
            el: ".custom-products-scrollbar",
          }}

          spaceBetween={8}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          loop={false}
          pagination={{ clickable: true, dynamicBullets: true }}
          slidesPerView={2.3}
          breakpoints={{
            640: { slidesPerView: 2.3, loop: false },
            768: { slidesPerView: 4, loop: false }, // Enable loop on larger screens
            1024: { slidesPerView: 6, loop: true },
          }}
        >
          {products.data.map((product) => (
            <SwiperSlide key={product._id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="custom-products-scrollbar h-1 bg-white/20 rounded-full mt-4 mx-auto w-32 md:hidden">
          <div className="swiper-scrollbar-drag bg-primary rounded-full" />
        </div>
        <div className="swiper-button-prev  absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 hidden lg:flex items-center justify-center rounded-full bg-primary  shadow-lg hover:bg-primary-hover transition-colors disabled:opacity-30 text-white cursor-pointer ">
          <FaArrowLeft />
        </div>
        <div className="swiper-button-next absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10  items-center justify-center rounded-full bg-primary shadow-lg hover:bg-primary-hover transition-colors disabled:opacity-30 text-white cursor-pointer hidden lg:flex">
          <FaArrowRight />
        </div>
      </div>
    </div>
  );
}
