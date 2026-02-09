"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Scrollbar } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import { useCategories } from "@/app/context/CategoriesProvider";

import "swiper/css";

export default function ShopByCategory() {
  const categories = useCategories();

  const CATEGORY_IMAGE_URL = "http://localhost:5000/images/categories";
  return (
    <section className="px-4 py-8 -ml-14 my-12 w-screen bg-primary">
      <h2 className="text-3xl font-semibold mb-2 text-white">
        Shop By Category
      </h2>
      <hr className="text-gray-300 mb-8" />

      <div className="relative">
        <Swiper
          modules={[Navigation, Scrollbar, Autoplay]}
          dir="rtl"
          spaceBetween={24}
          loop={false}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            reverseDirection: true,
          }}
          scrollbar={{
            draggable: true,
            hide: false,
            el: ".custom-scrollbar",
          }}
          navigation={{
            nextEl: ".cat-next-arrow",
            prevEl: ".cat-prev-arrow",
          }}
          slidesPerView={2.3}
          breakpoints={{
            640: { slidesPerView: 2.3, loop: false },
            768: { slidesPerView: 4, loop: false },
            1024: { slidesPerView: 6, loop: true },
          }}
        >
          {categories?.data?.map((cat) => (
            <SwiperSlide key={cat._id} className="h-fit">
              <Link
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-3 my-2 h-fit"
              >
                <div className="relative w-32 h-32 rounded-full bg-white shadow-md overflow-hidden transition-transform hover:scale-105">
                  <Image
                    src={`${CATEGORY_IMAGE_URL}/${cat.image}`}
                    alt={cat.name}
                    fill
                    sizes="128px"
                    className="object-contain"
                    unoptimized
                  />
                </div>

                <p className="text-sm font-medium text-center text-white transition">
                  {cat.name}
                </p>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="custom-scrollbar h-1 bg-white/20 rounded-full mt-4 mx-auto w-32 md:hidden">
          <div className="swiper-scrollbar-drag bg-white rounded-full" />
        </div>

        <div className="cat-prev-arrow text-primary absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:flex hidden items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition cursor-pointer">
          <FaArrowLeft />
        </div>

        <div className="cat-next-arrow text-primary absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 lg:flex hidden items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100 transition cursor-pointer">
          <FaArrowRight />
        </div>
      </div>
    </section>
  );
}
