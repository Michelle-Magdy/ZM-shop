import Image from "next/image";
import { useState, memo } from "react";
import { IMAGES_BASE_URL } from "@/lib/apiConfig";

export default memo(function ProductImages({ product, selectedVariant }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const imagePath = product.images[selectedImage]
        ? product.images[selectedImage].includes("media-amazon")
            ? `${product.images[selectedImage]}`
            : `${IMAGES_BASE_URL}/products/${product.images[selectedImage]}`
        : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg";

    return (
        <>
            {/* Left Column - Images */}
            <div className="w-full flex flex-col gap-4 lg:sticky lg:top-8 lg:self-start">
                <div className="relative aspect-square w-full bg-(--color-card) rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden group">
                    <Image
                        src={imagePath}
                        alt={product.title}
                        fill
                        className="object-contain transition-transform duration-500 group-hover:scale-105"
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
                    {product.images.map((img, i) => {
                        const thumbPath = img
                            ? img.includes("media-amazon")
                                ? img
                                : `${IMAGES_BASE_URL}/products/${img}`
                            : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg";

                        return (
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
                                    src={thumbPath}
                                    alt={`${product.title} - View ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </button>
                        );
                    })}
                </div>
            </div>
        </>
    );
});
