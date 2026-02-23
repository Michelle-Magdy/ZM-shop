"use client"
import CartItems from "../components/cart/CartItems";
import { useSelector } from "react-redux";
import OrderSummary from "../components/cart/OrderSummary";
import Link from "next/link";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useDispatch } from "react-redux";
import { clearCart } from "@/features/cart/cartSlice";

export default function CartPage() {
    const { items, loading } = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    
    const handleClearCart = () => {
        dispatch(clearCart());
    }
    
    if (loading)
        return (
            <div className="py-8">
                <h1 className="text-3xl font-bold text-(--color-primary-text) mb-8 font-ubuntu">
                    Shopping Cart
                </h1>
                <LoadingSpinner text={"Loading your cart items..."} size="lg" />
            </div>)

    if (items.length === 0) {
        return (
            <div className="py-8">
                <h1 className="text-3xl font-bold text-(--color-primary-text) mb-8 font-ubuntu">
                    Shopping Cart
                </h1>
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="w-24 h-24 mb-6 text-secondary-text">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-full h-full"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-(--color-primary-text) mb-2">
                        Your cart is empty
                    </h2>
                    <p className="text-secondary-text mb-8 max-w-sm">
                        Looks like you haven&apos;t added anything to your cart yet.
                        Explore our products and find something you&apos;ll love!
                    </p>
                    <Link
                        href="/"
                        className="px-8 py-3 bg-(--color-primary) text-white rounded-lg font-medium 
                            hover:bg-primary-hover transition-colors duration-200"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }



    return (
        <div className="py-8">
            <h1 className="text-3xl font-bold text-(--color-primary-text) mb-8 font-ubuntu">
                Shopping Cart
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left side - Products */}
                <div className="flex-1">
                    {/* Clear Cart Button */}
                    <div className="flex justify-end mb-4">
                        {<button onClick={handleClearCart} className="text-sm text-secondary-text hover:text-(--color-primary) transition-colors duration-200 underline">
                            Clear Cart
                        </button>}
                    </div>

                    {/* Cart Items */}
                    <CartItems loading={loading} items={items} />
                </div>

                {/* Right side - Order Summary */}
                <OrderSummary loading={loading} items={items} />
            </div>
        </div>
    );
}