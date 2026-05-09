import Image from "next/image";
import { useState, memo } from "react";
import getProductImageSrc from "../../../../lib/util/ImageHelper.js";

export default memo(function ProductImages({ product, selectedVariant }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const imagePath = getProductImageSrc(product.images[selectedImage]);

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
                        const thumbPath = getProductImageSrc(img);

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
