import { useState } from "react";
import CheckoutModal from "./CheckoutModal.jsx";
import { getCheckoutSession } from "../../../lib/api/payment.js";
import toast from "react-hot-toast";
import { createOrder } from "../../../lib/api/order.js";
import { useRouter } from "next/navigation.js"

export default function CheckoutButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const handleCheckout = async (paymentMethod, address) => {
        try {
            setIsLoading(true);

            if (paymentMethod === "online") {
                const session = await getCheckoutSession(address);
                if (session.priceChanged) {
                    toast("Take care that some prices were changed.");
                    setTimeout(() => {
                        window.location.href = session.url;
                    }, 3000);
                } else {
                    window.location.href = session.url;
                }
            }
            else{
                const order = await createOrder(address);
                toast.success("Order created");
                router.push("/orders");
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-3 bg-(--color-primary) text-(--color-brand-light) rounded-lg hover:bg-primary-hover transition-all duration-200 font-semibold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
                Continue to Checkout
            </button>
            <CheckoutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCheckout}
                isLoading={isLoading}
            />
        </>
    );
}
