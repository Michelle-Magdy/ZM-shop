"use client";

import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";
import { FaTrash, FaShoppingCart, FaArrowLeft, FaRegHeart } from "react-icons/fa";
import { fetchWishlist, clearWishlist } from "@/features/wishlist/wishlistSlice";
import useAddToCart from "@/lib/hooks/useAddToCart";
import useRemoveFromWishlist from "@/lib/hooks/useRemoveFromWishlist";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function WishlistPage() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((state) => state.wishlist);
    const { handleRemoveFromWishlist } = useRemoveFromWishlist();
    const { handleAddToCart } = useAddToCart();

    const handleMoveToCart = (item) => {
        handleAddToCart(item);
        handleRemoveFromWishlist(item.productId);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <p className="text-primary-text/70">{error}</p>
                <button
                    onClick={() => dispatch(fetchWishlist())}
                    className="px-4 py-2 bg-primary text-button-label rounded-lg hover:bg-primary-hover transition-colors"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!items?.length) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
                <FaRegHeart className="w-20 h-20 text-secondary-text/30" />
                <h1 className="text-2xl font-semibold text-primary-text">
                    Your wishlist is empty
                </h1>
                <p className="text-secondary-text text-center max-w-md">
                    Save items you love to your wishlist and they&apos;ll appear here.
                </p>
                <Link
                    href="/"
                    className="flex items-center gap-2 px-6 py-3 dark:text-primary-text bg-primary text-button-label rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <FaArrowLeft />
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary-text">
                        My Wishlist
                    </h1>
                    <p className="text-secondary-text mt-1">
                        {items.length} {items.length === 1 ? "item" : "items"}
                    </p>
                </div>
                <button
                    onClick={() => dispatch(clearWishlist())}
                    className="text-secondary-text hover:text-primary-text text-sm font-medium self-start sm:self-auto transition-colors"
                >
                    Clear All
                </button>
            </div>

            {/* Wishlist Items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.productId}
                        className="bg-card rounded-xl shadow-sm border border-badge/30 p-4 flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow"
                    >
                        {/* Product Image */}
                        <Link
                            href={`/product/${item.slug}`}
                            className="relative w-full sm:w-24 h-48 sm:h-24 shrink-0 rounded-lg overflow-hidden bg-badge/20"
                        >
                            <Image
                                src={`${PRODUCT_IMAGE_URL}/products/${item.coverImage}`}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                            />
                        </Link>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <Link
                                href={`/product/${item.slug}`}
                                className="block"
                            >
                                <h3 className="text-lg font-semibold text-primary-text truncate hover:text-primary-hover transition-colors">
                                    {item.title}
                                </h3>
                            </Link>

                            {item.variant && (
                                <div className="mt-2 space-y-1 text-sm text-secondary-text">
                                    <p>SKU: {item.variant.sku}</p>
                                    <p className="text-lg font-bold text-primary dark:text-secondary-text">
                                        ${item.variant.price?.toFixed(2)}
                                    </p>
                                    <p
                                        className={`${item.variant.stock > 0
                                                ? "text-primary font-semibold dark:text-secondary-text"
                                                : "text-secondary-text/60"
                                            }`}
                                    >
                                        {item.variant.stock > 0
                                            ? `In Stock (${item.variant.stock})`
                                            : "Out of Stock"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex sm:flex-col gap-2 justify-center">
                            <button
                                onClick={() => handleMoveToCart(item)}
                                disabled={!item.variant?.stock}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-button-label rounded-lg hover:bg-primary-hover disabled:bg-badge disabled:text-secondary-text/50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                            >
                                <FaShoppingCart title="Move to cart"/>
                                <span className="sm:hidden">Move to Cart</span>
                            </button>

                            <button
                                onClick={() =>
                                    handleRemoveFromWishlist(item.productId)
                                }
                                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-secondary-text hover:text-red-500 hover:bg-badge/30 rounded-lg transition-colors text-sm font-medium"
                            >
                                <FaTrash title="Remove Item"/>
                                <span className="sm:hidden">Remove</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 dark:text-primary-text dark:hover:text-primary-hover text-primary font-medium transition-colors"
                >
                    <FaArrowLeft />
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}