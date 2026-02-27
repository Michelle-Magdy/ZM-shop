import { useState } from "react";
import CheckoutModal from "./CheckoutModal.jsx";
import { getCheckoutSession } from "../../../lib/api/payment.js";
import toast from "react-hot-toast";
import { createOrder } from "../../../lib/api/order.js";
import { useRouter } from "next/navigation.js";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { clearCart, replaceCart } from "../../../features/cart/cartSlice.js";
import { useAuth } from "../../context/AuthenticationProvider.jsx";

export default function CheckoutButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const dispatch = useDispatch();
    const router = useRouter();
    const { user } = useAuth();

    const handleCheckout = async (paymentMethod, address, phone) => {
        try {
            setIsLoading(true);

            if (paymentMethod === "online") {
                const session = await getCheckoutSession(address, phone);
                if (session.priceChanged) {
                    toast("Take care that some prices were changed.");
                    setTimeout(() => {
                        window.location.href = session.url;
                    }, 2000);
                } else {
                    window.location.href = session.url;
                }
            } else {
                const order = await createOrder(address, phone);
                if (order.status === "price_changed") {
                    toast.error(order.message);
                    dispatch(replaceCart(order.items));
                    setIsModalOpen(false);
                    return;
                }

                toast.success("Order created");

                dispatch(clearCart(true));

                setIsModalOpen(false);

                queryClient.invalidateQueries({ queryKey: ["orders"] });

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
                user={user}
            />
        </>
    );
}
