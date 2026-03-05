export default function QuantitySelector({selectedVariant, quantity, setQuantity}) {

    return (
        <div className="space-y-3">
            <label className="text-sm font-semibold text-secondary-text uppercase tracking-wide">
                Quantity
            </label>
            <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-badge rounded-lg bg-(--color-card)">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-2 hover:bg-badge text-(--color-primary-text) transition-colors"
                        disabled={quantity <= 1}
                    >
                        -
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-12 text-center text-(--color-primary-text)">
                        {quantity}
                    </span>
                    <button
                        onClick={() =>
                            setQuantity(
                                Math.min(
                                    selectedVariant?.stock || 1,
                                    quantity + 1,
                                ),
                            )
                        }
                        className="px-4 py-2 hover:bg-badge text-(--color-primary-text) transition-colors"
                        disabled={quantity >= (selectedVariant?.stock || 1)}
                    >
                        +
                    </button>
                </div>
                <span className="text-sm text-secondary-text">
                    {selectedVariant?.stock} available
                </span>
            </div>
        </div>
    );
}
