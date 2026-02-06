"use client";
import DiscountCard from "./DiscountCards";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

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
    return (
        <div className="py-6 sm:py-8 lg:py-10 w-full">
            <div className="relative overflow-hidden bg-[#F6F6F6] rounded-lg">
                {/* Slider track */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    navigation={{
                        prevEl: ".custom-prev",
                        nextEl: ".custom-next",
                    }}
                    pagination={{
                        el: ".custom-pagination",
                        clickable: true,
                    }}
                >
                    {data.map((item) => (
                        <SwiperSlide key={item._id}>
                            <DiscountCard data={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Navigation Arrows */}
                <button
                    className="custom-prev absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 bg-white/80 hover:bg-white opacity-0 hover:opacity-100 p-2 rounded-full shadow-lg z-10"
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
                    className="custom-next absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 bg-white/80 hover:bg-white opacity-0 hover:opacity-100 p-2 rounded-full shadow-lg z-10"
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
                <div className="custom-pagination absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"></div>
            </div>
        </div>
    );
}
