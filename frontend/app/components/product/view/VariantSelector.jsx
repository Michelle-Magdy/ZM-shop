import { useState, useMemo, useCallback } from "react";

export default function VariantSelector({
    product,
    quantity,
    setQuantity,
    setSelectedVariant,
    selectedVariant,
    variantsOptions,
}) {
    const variantDimensions = product.variantDimensions || [];

    // Pre-compute variant lookup map for O(1) access
    const variantsMap = useMemo(() => {
        const map = new Map();
        product.variants.forEach((variant) => {
            const key = JSON.stringify(variant.attributeValues);
            map.set(key, variant);
        });
        return map;
    }, [product.variants]);

    // Get variant by attribute values
    const getVariantByAttributes = useCallback(
        (attributes) => {
            return variantsMap.get(JSON.stringify(attributes));
        },
        [variantsMap],
    );

    // Check if current selection exists and get its state
    const currentVariantState = useMemo(() => {
        const exists = !!selectedVariant && !selectedVariant._isInvalid;
        const isActive = selectedVariant?.isActive ?? false;
        const inStock = (selectedVariant?.stock ?? 0) > 0;

        return {
            exists,
            isActive,
            inStock,
            isValid: exists && isActive,
            isAvailable: exists && isActive && inStock,
            message: !exists
                ? "Not Available"
                : !isActive
                  ? "Not Available"
                  : !inStock
                    ? "Out of Stock"
                    : null,
        };
    }, [selectedVariant]);

    const handleVariantChange = useCallback(
        (dimension, value) => {
            const newAttributes = {
                ...selectedVariant.attributeValues,
                [dimension]: value,
            };

            const matchedVariant = getVariantByAttributes(newAttributes);

            if (matchedVariant) {
                setSelectedVariant(matchedVariant);
            } else {
                setSelectedVariant({
                    ...selectedVariant,
                    attributeValues: newAttributes,
                    _isInvalid: true,
                    stock: 0,
                    isActive: false,
                });
            }
            setQuantity(1);
        },
        [
            selectedVariant,
            getVariantByAttributes,
            setSelectedVariant,
            setQuantity,
        ],
    );

    return (
        <div
            className="space-y-6"
            role="region"
            aria-label="Product variant selection"
        >
            {/* Status indicator - only place where availability is shown */}
            {currentVariantState.message && (
                <div className="text-sm font-semibold">
                    <span
                        className={`${
                            currentVariantState.message === "Out of Stock"
                                ? "text-error"
                                : "text-warning"
                        }`}
                    >
                        {currentVariantState.message}
                    </span>
                </div>
            )}

            {variantDimensions.map((dimension) => (
                <fieldset key={dimension} className="space-y-3">
                    <legend className="text-sm font-semibold text-secondary-text uppercase tracking-wide">
                        {dimension}:{" "}
                        <span className="text-(--color-primary-text) capitalize">
                            {selectedVariant?.attributeValues[dimension]}
                        </span>
                    </legend>
                    <div
                        className="flex flex-wrap gap-2"
                        role="radiogroup"
                        aria-label={`Select ${dimension}`}
                    >
                        {variantsOptions[dimension].map((value) => {
                            const isSelected =
                                selectedVariant?.attributeValues[dimension] ===
                                value;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    onClick={() =>
                                        handleVariantChange(dimension, value)
                                    }
                                    className={`
                                        px-4 py-2 rounded-lg border-2 text-sm font-medium 
                                        transition-all duration-200 focus:outline-none focus:ring-2 
                                        focus:ring-(--color-primary)/50 focus:ring-offset-2
                                        ${
                                            isSelected
                                                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary) shadow-sm"
                                                : "border-badge bg-(--color-card) text-(--color-primary-text) hover:border-(--color-primary)/50 hover:shadow-sm"
                                        }
                                    `}
                                >
                                    {value}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>
            ))}
        </div>
    );
}
