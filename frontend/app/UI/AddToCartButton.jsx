"use client";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/features/cart/cartSlice";
import { useAuth } from "../context/AuthenticationProvider";
import toast from "react-hot-toast";

export default function AddToCartButton({
    selectedVariant,
    productId,
    title,
    coverImage,
    slug,
    compact = false,
}) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.error("Please login first.")
            return;
        }
        const item = {
            productId,
            slug,
            title,
            coverImage,
            variant: selectedVariant,
        };

        dispatch(addToCart(item));
    };

    const buttonClasses = compact
        ? "w-full p-2 text-center text-white bg-primary rounded-lg shadow-md transition-all duration-300 hover:bg-primary-hover text-sm font-medium mt-auto disabled:bg-badge disabled:text-secondary-text disabled:cursor-not-allowed disabled:shadow-none"
        : "flex-1 bg-(--color-primary) text-(--color-brand-light) px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-hover active:scale-95 transition-all duration-200 shadow-lg disabled:bg-badge disabled:text-secondary-text disabled:cursor-not-allowed disabled:shadow-none";

    return (
        <button
            className={buttonClasses}
            disabled={
                selectedVariant &&
                (!selectedVariant?.isActive || selectedVariant?.stock === 0)
            }
            onClick={handleAddToCart}
        >
            {!selectedVariant
                ? "Add to Cart"
                : selectedVariant?.stock === 0
                  ? "Out of Stock"
                  : selectedVariant?.isActive
                    ? "Add to Cart"
                    : "Not active"}
        </button>
    );
}
