import { useState } from "react";
import { getCheckoutSession } from "../../../lib/api/payment.js";
import toast from "react-hot-toast";
import { redirect } from "next/dist/server/api-utils/index.js";

export default function CheckoutButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsLoading(true);
            const session = await getCheckoutSession();

            if (session.priceChanged) {
                toast("Take care that some prices were changed.");
                setTimeout(() => {
                    window.location.href = session.url;
                }, 3000);
            } else {
                window.location.href = session.url;
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="w-full py-3 bg-(--color-primary) text-(--color-brand-light) rounded-lg hover:bg-primary-hover transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
        >
            {isLoading ? "Processing..." : "Proceed to Checkout"}
        </button>
    );
}
