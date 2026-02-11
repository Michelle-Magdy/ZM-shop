import Image from "next/image";
import { useState, memo } from "react";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";

export default memo(function ProductImages({ product, selectedVariant }) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <>
            {/* Left Column - Images */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
                <div className="relative aspect-square w-full bg-(--color-card) rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden group">
                    <Image
                        src={`${PRODUCT_IMAGE_URL}/products/${product.images[selectedImage]}`}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                        priority
                    />
                    {selectedVariant?.stock <= 5 && (
                        <div className="absolute top-4 left-4 bg-primary dark:bg-black text-white px-3 py-1 rounded-full text-sm font-semibold">
                            Only {selectedVariant?.stock} left
                        </div>
                    )}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {product.images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedImage(i)}
                            className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                                selectedImage === i
                                    ? "border-(--color-primary) ring-2 ring-(--color-primary)/20"
                                    : "border-badge hover:border-secondary-text"
                            }`}
                        >
                            <Image
                                src={`${PRODUCT_IMAGE_URL}/products/${img}`}
                                alt={`${product.title} - View ${i + 1}`}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
});
