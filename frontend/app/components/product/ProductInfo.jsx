import StarRating from "@/app/UI/StarRating";

export default function ProductInfo({ product, selectedVariant }) {
    return (
        <>
            {/* Title & Rating */}
            <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary-text) leading-tight">
                    {product.title}
                </h1>
                <div className="flex items-center gap-3">
                    <StarRating rating={product.ratingStats.average} />
                    {product.ratingStats.average && (
                        <span className="text-sm text-secondary-text">
                            ({product.ratingStats.average.toFixed(1)} out of 5)
                        </span>
                    )}
                </div>
            </div>

            {/* Price */}
            <div className="pt-4 border-t border-badge space-y-2">
                <div className="flex items-baseline gap-3">
                    <p className="text-4xl font-bold text-(--color-primary-text)">
                        ${(selectedVariant?.price / 100)?.toFixed(2) || "0.00"}
                    </p>
                    {product.originalPrice && (
                        <p className="text-lg text-secondary-text line-through">
                            ${(product.originalPrice / 100)?.toFixed(2)}
                        </p>
                    )}
                </div>
            </div>
        </>
    );
}
