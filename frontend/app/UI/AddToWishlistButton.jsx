import useAddToWishlist from "@/lib/hooks/useAddToWishlist";

export default function AddToWishlistButton({
    productId,
    slug,
    title,
    coverImage,
    selectedVariant,
}) {
    const { handleAddToWishlist } = useAddToWishlist();

    const onClick = () => {
        const item = {
            productId,
            slug,
            title,
            coverImage,
            variant: selectedVariant,
        };
        handleAddToWishlist(item);
    };

    return (
        <button
            onClick={onClick}
            className="flex-1 bg-badge text-(--color-primary-text) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-badge/80 active:scale-95 transition-all duration-200"
        >
            Add to Wishlist
        </button>
    );
}
