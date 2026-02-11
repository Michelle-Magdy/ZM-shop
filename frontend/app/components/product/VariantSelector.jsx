export default function VariantSelector({product, setQuantity, setSelectedVariant, selectedVariant}) {
    // Group variants by dimension (color, storage, etc.)
    const variantDimensions = product.variantDimensions || [];

    // Get unique values for each dimension
    const getDimensionOptions = (dimension) => {
        const values = new Set();
        product.variants?.forEach((variant) => {
            if (variant.attributeValues[dimension]) {
                values.add(variant.attributeValues[dimension]);
            }
        });
        return Array.from(values);
    };

    // Check if variant is available for selected combination
    const isVariantAvailable = (dimension, value) => {
        return product.variants?.some(
            (v) => v.attributeValues[dimension] === value && v.isActive,
        );
    };

    // Handle variant selection
    const handleVariantChange = (dimension, value) => {
        const newVariant = product.variants?.find(
            (v) => v.attributeValues[dimension] === value && v.isActive,
        );
        if (newVariant) {
            setSelectedVariant(newVariant);
            setQuantity(1);
        }
    };

    return (
        <>
            {variantDimensions.map((dimension) => (
                <div key={dimension} className="space-y-3">
                    <label className="text-sm font-semibold text-secondary-text uppercase tracking-wide">
                        {dimension}:{" "}
                        <span className="text-(--color-primary-text) capitalize">
                            {selectedVariant?.attributeValues[dimension]}
                        </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {getDimensionOptions(dimension).map((value) => {
                            const isSelected =
                                selectedVariant?.attributeValues[dimension] ===
                                value;
                            const available = isVariantAvailable(
                                dimension,
                                value,
                            );

                            return (
                                <button
                                    key={value}
                                    onClick={() =>
                                        handleVariantChange(dimension, value)
                                    }
                                    disabled={!available}
                                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                                        isSelected
                                            ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)"
                                            : available
                                              ? "border-badge bg-(--color-card) text-(--color-primary-text) hover:border-secondary-text"
                                              : "border-badge/50 bg-(--color-background) text-secondary-text cursor-not-allowed opacity-60"
                                    }`}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </>
    );
}
