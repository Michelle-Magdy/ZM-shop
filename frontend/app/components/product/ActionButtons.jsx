export default function ActionButtons({ selectedVariant }) {
    <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <button
            className="flex-1 bg-(--color-primary) text-(--color-brand-light) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-hover active:scale-95 transition-all duration-200 shadow-lg disabled:bg-badge disabled:text-secondary-text disabled:cursor-not-allowed disabled:shadow-none"
            disabled={
                !selectedVariant?.isActive || selectedVariant?.stock === 0
            }
        >
            {selectedVariant?.stock === 0
                ? "Out of Stock"
                : selectedVariant?.isActive
                  ? "Add to Cart"
                  : "Not active"}
        </button>
        <button className="flex-1 bg-badge text-(--color-primary-text) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-badge/80 active:scale-95 transition-all duration-200">
            Add to Wishlist
        </button>
    </div>;
}
