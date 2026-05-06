"use client";

import { useState } from "react";
import { X, AlertTriangle, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cancelOrder } from "../../../../lib/api/order.js";
import { useAuth } from "../../../context/AuthenticationProvider.jsx";

export default function CancelOrderButton({
    orderStatus,
    orderId,
    className = "",
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const queryClient = useQueryClient();

    // Only show for pending or processing orders
    const canCancel = ["PENDING", "PROCESSING"].includes(orderStatus);

    if (!canCancel) return null;

    const handleCancel = async () => {
        setIsLoading(true);
        try {
            await cancelOrder(orderId);

            // Invalidate orders query to refresh the list
            queryClient.invalidateQueries({ queryKey: ["orders", user.id] });

            toast.success("Order cancelled successfully", {
                icon: "✅",
                duration: 3000,
            });
        } catch (error) {
            toast.error(error?.message || "Failed to cancel order", {
                icon: "❌",
                duration: 4000,
            });
        } finally {
            setIsLoading(false);
            setIsModalOpen(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl
                    text-sm font-medium
                    bg-red-500/10 text-red-600 
                    hover:bg-red-500/20 hover:text-red-700
                    active:scale-95
                    transition-all duration-200
                    ml-auto
                    mb-5
                    ${className}
                `}
            >
                <X size={16} />
                <span>Cancel Order</span>
            </button>

            {/* Confirmation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                        onClick={() => !isLoading && setIsModalOpen(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-(--color-card) rounded-2xl border border-badge/50 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-(--color-primary-text)">
                                    Cancel Order?
                                </h3>
                                <p className="text-sm text-secondary-text mt-1">
                                    Are you sure you want to cancel this order?
                                    This action cannot be undone.
                                </p>
                            </div>

                            <div className="flex gap-3 w-full mt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                                        bg-badge/50 text-secondary-text
                                        hover:bg-badge
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-200"
                                >
                                    Keep Order
                                </button>
                                <button
                                    onClick={handleCancel}
                                    disabled={isLoading}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
                                        bg-red-600 text-white
                                        hover:bg-red-700
                                        disabled:opacity-70 disabled:cursor-not-allowed
                                        active:scale-95
                                        transition-all duration-200
                                        flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={16}
                                                className="animate-spin"
                                            />
                                            <span>Cancelling...</span>
                                        </>
                                    ) : (
                                        <span>Yes, Cancel</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
