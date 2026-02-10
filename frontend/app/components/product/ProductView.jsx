"use client";
import StarRating from "@/app/UI/StarRating";
import Image from "next/image";
import { useState } from "react";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";

export default function ProductView({ product }) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
    const [quantity, setQuantity] = useState(1);

    // Get attribute definitions map for easy lookup
    const attrDefinitionsMap =
        product.attributeDefinitions?.reduce((acc, def) => {
            acc[def.key] = def;
            return acc;
        }, {}) || {};

    // Get attributes map
    const attributesMap =
        product.attributes?.reduce((acc, attr) => {
            acc[attr.key] = attr;
            return acc;
        }, {}) || {};

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
        }
    };

    return (
        <div className="min-h-screen bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column - Images */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        <div className="relative aspect-square w-full bg-(--color-card) rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden group">
                            <Image
                                src={`${PRODUCT_IMAGE_URL}/products/${product.images[selectedImage]}`}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                unoptimized
                                priority
                            />
                            {selectedVariant?.stock < 5 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    Only {selectedVariant?.stock} left
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images.map((img, i) => (
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
                                        src={`${PRODUCT_IMAGE_URL}/products/${img}`}
                                        alt={`${product.title} - View ${i + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        {/* Title & Rating */}
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary-text) leading-tight">
                                {product.title}
                            </h1>
                            <div className="flex items-center gap-3">
                                <StarRating rating={product.avgRating} />
                                <span className="text-sm text-secondary-text">
                                    ({product.avgRating?.toFixed(1) || "0.0"}{" "}
                                    out of 5)
                                </span>
                            </div>
                        </div>

                        {/* Price & SKU */}
                        <div className="pt-4 border-t border-badge space-y-2">
                            <div className="flex items-baseline gap-3">
                                <p className="text-4xl font-bold text-(--color-primary-text)">
                                    $
                                    {(selectedVariant?.price / 100)?.toFixed(
                                        2,
                                    ) || "0.00"}
                                </p>
                                {product.originalPrice && (
                                    <p className="text-lg text-secondary-text line-through">
                                        $
                                        {(product.originalPrice / 100)?.toFixed(
                                            2,
                                        )}
                                    </p>
                                )}
                            </div>
                            <p className="text-sm text-secondary-text">
                                SKU:{" "}
                                <span className="font-mono text-(--color-primary-text)">
                                    {selectedVariant?.sku}
                                </span>
                            </p>
                        </div>

                        {/* Variant Selectors */}
                        {variantDimensions.map((dimension) => (
                            <div key={dimension} className="space-y-3">
                                <label className="text-sm font-semibold text-secondary-text uppercase tracking-wide">
                                    {dimension}:{" "}
                                    <span className="text-(--color-primary-text) capitalize">
                                        {
                                            selectedVariant?.attributeValues[
                                                dimension
                                            ]
                                        }
                                    </span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {getDimensionOptions(dimension).map(
                                        (value) => {
                                            const isSelected =
                                                selectedVariant
                                                    ?.attributeValues[
                                                    dimension
                                                ] === value;
                                            const available =
                                                isVariantAvailable(
                                                    dimension,
                                                    value,
                                                );

                                            return (
                                                <button
                                                    key={value}
                                                    onClick={() =>
                                                        handleVariantChange(
                                                            dimension,
                                                            value,
                                                        )
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
                                        },
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Quantity Selector */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-secondary-text uppercase tracking-wide">
                                Quantity
                            </label>
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border-2 border-badge rounded-lg bg-(--color-card)">
                                    <button
                                        onClick={() =>
                                            setQuantity(
                                                Math.max(1, quantity - 1),
                                            )
                                        }
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
                                        disabled={
                                            quantity >=
                                            (selectedVariant?.stock || 1)
                                        }
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-sm text-secondary-text">
                                    {selectedVariant?.stock} available
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                className="flex-1 bg-(--color-primary) text-(--color-brand-light) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-hover active:scale-95 transition-all duration-200 shadow-lg disabled:bg-badge disabled:text-secondary-text disabled:cursor-not-allowed disabled:shadow-none"
                                disabled={
                                    !selectedVariant?.isActive ||
                                    selectedVariant?.stock === 0
                                }
                            >
                                {selectedVariant?.stock === 0
                                    ? "Out of Stock"
                                    : "Add to Cart"}
                            </button>
                            <button className="flex-1 bg-badge text-(--color-primary-text) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-badge/80 active:scale-95 transition-all duration-200">
                                Add to Wishlist
                            </button>
                        </div>

                        {/* Product Specifications */}
                        {product.attributes?.length > 0 && (
                            <div className="bg-(--color-card) rounded-xl p-6 shadow-sm border border-badge">
                                <h3 className="text-lg font-bold text-(--color-primary-text) mb-4">
                                    Specifications
                                </h3>
                                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {product.attributes.map((attr) => {
                                        const definition =
                                            attrDefinitionsMap[attr.key];
                                        return (
                                            <div
                                                key={attr.key}
                                                className="space-y-1"
                                            >
                                                <dt className="text-sm text-secondary-text">
                                                    {definition?.displayName ||
                                                        attr.key}
                                                </dt>
                                                <dd className="text-sm font-semibold text-(--color-primary-text)">
                                                    {attr.displayValue ||
                                                        attr.value}
                                                    {definition?.unit &&
                                                        !attr.displayValue?.includes(
                                                            definition.unit,
                                                        ) && (
                                                            <span className="text-secondary-text font-normal ml-1">
                                                                {
                                                                    definition.unit
                                                                }
                                                            </span>
                                                        )}
                                                </dd>
                                            </div>
                                        );
                                    })}
                                </dl>
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="prose prose-gray max-w-none pt-4 border-t border-badge">
                                <h3 className="text-lg font-bold text-(--color-primary-text) mb-2">
                                    Description
                                </h3>
                                <p className="text-secondary-text leading-relaxed">
                                    {product.description}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
