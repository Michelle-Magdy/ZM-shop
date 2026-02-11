"use client";
import { useState } from "react";
import ProductImages from "./ProductImages";
import ProductInfo from "./ProductInfo";
import QuantitySelector from "./QuantitySelector";
import ActionButtons from "./ActionButtons";
import ProductSpecifications from "./ProductSpecifications";
import VariantSelector from "./VariantSelector";

export default function ProductView({ product }) {
    const [selectedVariant, setSelectedVariant] = useState(
        product.variants?.[0] ?? null,
    );
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="min-h-screen bg-(--color-background) py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 border-b-2 border-badge">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column - Images */}
                    <ProductImages
                        product={product}
                        selectedVariant={selectedVariant}
                    />

                    {/* Right Column - Product Info */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-6">
                        <ProductInfo
                            product={product}
                            selectedVariant={selectedVariant}
                        />

                        {/* Variant Selectors */}
                        <VariantSelector
                            product={product}
                            setQuantity={setQuantity}
                            setSelectedVariant={setSelectedVariant}
                            selectedVariant={selectedVariant}
                        />

                        {/* Quantity Selector */}
                        <QuantitySelector
                            selectedVariant={selectedVariant}
                            quantity={quantity}
                            setQuantity={setQuantity}
                        />

                        {/* Action Buttons */}
                        <ActionButtons selectedVariant={selectedVariant} />

                        {/* Product Specifications */}
                        <ProductSpecifications product={product} />

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
