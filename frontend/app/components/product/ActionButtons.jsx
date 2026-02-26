import AddToCartButton from "@/app/UI/AddToCartButton";
import AddToWishlistButton from "@/app/UI/AddToWishlistButton";

export default function ActionButtons({
    selectedVariant,
    productId,
    title,
    coverImage,
    slug,
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
            <AddToWishlistButton
                productId={productId}
                selectedVariant={selectedVariant}
                title={title}
                coverImage={coverImage}
                slug={slug}
            />
        </div>
    );
}
