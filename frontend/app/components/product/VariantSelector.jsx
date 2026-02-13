import { useState, useMemo, useCallback } from "react";

export default function VariantSelector({
    product,
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

    // Check if combination exists and is available
    const getCombinationState = useCallback(
        (dimension, value) => {
            // Build the potential new attributes
            const newAttributes = {
                ...selectedVariant.attributeValues,
                [dimension]: value,
            };

            const targetVariant = getVariantByAttributes(newAttributes);

            return {
                exists: !!targetVariant,
                isActive: targetVariant?.isActive ?? false,
                inStock: (targetVariant?.stock ?? 0) > 0,
                isSelected:
                    selectedVariant.attributeValues[dimension] === value,
            };
        },
        [selectedVariant, getVariantByAttributes],
    );

    const handleVariantChange = useCallback(
        (dimension, value) => {
            const newAttributes = {
                ...selectedVariant.attributeValues,
                [dimension]: value,
            };

            const matchedVariant = getVariantByAttributes(newAttributes);

            if (matchedVariant) {
                setSelectedVariant(matchedVariant);
                setQuantity(1);
            }
        },
        [
            selectedVariant,
            getVariantByAttributes,
            setSelectedVariant,
            setQuantity,
        ],
    );

    // Pre-compute all states to avoid recalculation in render
    const optionStates = useMemo(() => {
        const states = {};
        variantDimensions.forEach((dimension) => {
            states[dimension] = {};
            variantsOptions[dimension].forEach((value) => {
                states[dimension][value] = getCombinationState(
                    dimension,
                    value,
                );
            });
        });
        return states;
    }, [variantDimensions, variantsOptions, getCombinationState]);

    return (
        <div
            className="space-y-6"
            role="region"
            aria-label="Product variant selection"
        >
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
                            const state = optionStates[dimension][value];
                            const { isSelected, exists, isActive, inStock } =
                                state;

                            const isDisabled = !exists || !isActive || !inStock;
                            const isOutOfStock = exists && isActive && !inStock;

                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isSelected}
                                    aria-disabled={isDisabled}
                                    onClick={() =>
                                        handleVariantChange(dimension, value)
                                    }
                                    disabled={isDisabled}
                                    className={`
                                        relative px-4 py-2 rounded-lg border-2 text-sm font-medium 
                                        transition-all duration-200 focus:outline-none focus:ring-2 
                                        focus:ring-(--color-primary)/50 focus:ring-offset-2
                                        ${
                                            isSelected
                                                ? "border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary) shadow-sm"
                                                : isDisabled
                                                  ? "border-transparent bg-(--color-background) text-secondary-text cursor-not-allowed opacity-50"
                                                  : "border-badge bg-(--color-card) text-(--color-primary-text) hover:border-(--color-primary)/50 hover:shadow-sm"
                                        }
                                        ${isOutOfStock ? "line-through decoration-2" : ""}
                                    `}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {value}
                                        {isOutOfStock && (
                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-error opacity-80">
                                                Out
                                            </span>
                                        )}
                                        {!exists && (
                                            <span className="text-[10px] uppercase tracking-wider font-semibold text-warning opacity-80">
                                                N/A
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </fieldset>
            ))}
        </div>
    );
}
