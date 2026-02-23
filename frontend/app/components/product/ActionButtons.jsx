import AddToCartButton from "@/app/UI/AddToCartButton";

export default function ActionButtons({
    selectedVariant,
    productId,
    title,
    coverImage,
    slug
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <AddToCartButton
                selectedVariant={selectedVariant}
                productId={productId}
                title={title}
                coverImage={coverImage}
                slug={slug}
            />
            <button className="flex-1 bg-badge text-(--color-primary-text) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-badge/80 active:scale-95 transition-all duration-200">
                Add to Wishlist
            </button>
        </div>
    );
}
