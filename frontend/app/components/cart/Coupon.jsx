import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { applyCoupon } from "../../../lib/api/coupon.js";

export default function Coupon({ onApply }) {
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCouponApply = async () => {
        const code = inputRef.current.value.trim();
        if (!code) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await applyCoupon(code);
            toast.success(response.message);
            const discount = response.discount;
            onApply(discount);
        } catch (err) {
            toast.error(err.message || "Failed to apply coupon");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-(--color-primary-text) mb-2 font-ubuntu">
                Coupon Code
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 bg-(--color-background) border border-badge rounded-lg text-(--color-primary-text) placeholder-secondary-text focus:outline-none focus:border-(--color-primary) transition-colors duration-200"
                    ref={inputRef}
                />
                <button
                    onClick={handleCouponApply}
                    disabled={isLoading}
                    className="px-4 py-2 bg-(--color-primary) text-(--color-brand-light) rounded-lg hover:bg-primary-hover transition-colors duration-200 font-medium"
                >
                    {isLoading ? "Applying..." : "Apply"}
                </button>
            </div>
        </div>
    );
}
