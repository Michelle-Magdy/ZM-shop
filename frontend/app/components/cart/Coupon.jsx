import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { applyCoupon, removeCoupon } from "../../../lib/api/coupon.js";
import { updateCoupon } from "../../../features/cart/cartSlice.js";
import { useDispatch } from "react-redux";

export default function Coupon({ code }) {
    const inputRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const handleCouponApply = async () => {
        const inputCode = inputRef.current.value.trim();
        if (!inputCode) {
            return;
        }
        try {
            setIsLoading(true);
            const response = await applyCoupon(inputCode);
            toast.success(response.message || "Coupon applied");
            dispatch(updateCoupon(response.coupon));
        } catch (err) {
            toast.error(err.message || "Failed to apply coupon");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCouponRemove = async () => {
        try {
            setIsLoading(true);
            const response = await removeCoupon();
            toast.success(response.message || "Coupon removed");
            dispatch(updateCoupon(null));
        } catch (err) {
            toast.error(err.message || "Failed to remove coupon");
        } finally {
            setIsLoading(false);
        }
    };

    const isApplied = Boolean(code);

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-(--color-primary-text) mb-2 font-ubuntu">
                Coupon Code
            </label>
            <div className="flex gap-2">
                <input
                    type="text"
                    placeholder={isApplied ? "" : "Enter code"}
                    defaultValue={code || ""}
                    disabled={isApplied}
                    className={`flex-1 px-4 py-2 bg-(--color-background) border border-badge rounded-lg text-(--color-primary-text) placeholder-secondary-text focus:outline-none focus:border-(--color-primary) transition-colors duration-200 ${
                        isApplied
                            ? "bg-badge opacity-75 cursor-not-allowed font-medium"
                            : ""
                    }`}
                    ref={inputRef}
                />
                <button
                    onClick={isApplied ? handleCouponRemove : handleCouponApply}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 font-medium ${
                        isApplied
                            ? "bg-primary-hover text-(--color-brand-light) hover:bg-(--color-primary)"
                            : "bg-(--color-primary) text-(--color-brand-light) hover:bg-primary-hover"
                    }`}
                >
                    {isLoading ? "Applying..." : isApplied ? "Remove" : "Apply"}
                </button>
            </div>
            {isApplied && (
                <p className="mt-2 text-sm text-secondary-text flex items-center gap-1">
                    <span className="text-(--color-primary)">✓</span>
                    Coupon applied successfully
                </p>
            )}
        </div>
    );
}
