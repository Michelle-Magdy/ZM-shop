import { useSelector } from "react-redux";
import CheckoutButton from "./checkout/CheckoutButton";
import Coupon from "./Coupon.jsx";

export default function OrderSummary({ items }) {
    const coupon = useSelector((state) => state.cart.coupon);
    const discountPercentage = coupon?.discountPercentage || null;
    
    const subtotal = items?.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0,
    );
    const itemCount = items?.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 15;

    const total =
        (subtotal + shipping) *
        (discountPercentage ? (100 - discountPercentage) / 100 : 1);

    return (
        <div className="w-full lg:w-96">
            <div className="bg-(--color-card) rounded-lg p-6 shadow-sm border border-badge">
                {/* Coupon Code */}
                <Coupon code={coupon?.code || null} />

                <hr className="border-badge mb-6" />

                {/* Order Summary */}
                <h2 className="text-xl font-bold text-(--color-primary-text) mb-4 font-ubuntu">
                    Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-secondary-text">
                        <span>Items ({itemCount})</span>
                        <span className="text-(--color-primary-text)">
                            ${subtotal.toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-secondary-text">
                        <span>Shipping</span>
                        <span className="text-(--color-primary-text)">
                            {shipping === 0
                                ? "Free"
                                : `$${shipping.toFixed(2)}`}
                        </span>
                    </div>
                    {shipping > 0 && (
                        <p className="text-xs text-(--color-primary)">
                            Free shipping on orders over $50!
                        </p>
                    )}
                    {discountPercentage !== null && (
                        <div className="flex justify-between text-secondary-text">
                            <span>Discount ({discountPercentage}%)</span>
                            <span className="text-(--color-primary) dark:text-primary-text">
                                -$
                                {(
                                    ((subtotal + shipping) *
                                        discountPercentage) /
                                    100
                                ).toFixed(2)}
                            </span>
                        </div>
                    )}
                    <hr className="border-badge" />
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-(--color-primary-text)">
                            Total
                        </span>
                        <span className="text-(--color-primary) dark:text-primary-text">
                            $
                            {discountPercentage === null ? (
                                total.toFixed(2)
                            ) : (
                                <>
                                    <span className="line-through mr-2">
                                        {(shipping + subtotal).toFixed(2)}
                                    </span>
                                    <span>{total.toFixed(2)}</span>
                                </>
                            )}
                        </span>
                    </div>
                </div>

                {/* Checkout Button */}
                <CheckoutButton />

                <p className="text-center text-sm text-secondary-text mt-4">
                    Shipping & taxes calculated at checkout
                </p>
            </div>
        </div>
    );
}
