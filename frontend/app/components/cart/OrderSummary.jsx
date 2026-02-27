import CheckoutButton from "./CheckoutButton";

export default function OrderSummary({ items }) {
    // Calculate totals
    const subtotal = items?.reduce(
        (sum, item) => sum + item.variant.price * item.quantity,
        0,
    );
    const itemCount = items?.reduce((sum, item) => sum + item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 15;
    const total = subtotal + shipping;

    return (
        <div className="w-full lg:w-96">
            <div className="bg-(--color-card) rounded-lg p-6 shadow-sm border border-badge">
                {/* Coupon Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-(--color-primary-text) mb-2 font-ubuntu">
                        Coupon Code
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Enter code"
                            className="flex-1 px-4 py-2 bg-(--color-background) border border-badge rounded-lg text-(--color-primary-text) placeholder-secondary-text focus:outline-none focus:border-(--color-primary) transition-colors duration-200"
                        />
                        <button className="px-4 py-2 bg-(--color-primary) text-(--color-brand-light) rounded-lg hover:bg-primary-hover transition-colors duration-200 font-medium">
                            Apply
                        </button>
                    </div>
                </div>

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
                    <hr className="border-badge" />
                    <div className="flex justify-between text-lg font-bold">
                        <span className="text-(--color-primary-text)">
                            Total
                        </span>
                        <span className="text-(--color-primary) dark:text-primary-text">
                            ${total.toFixed(2)}
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
