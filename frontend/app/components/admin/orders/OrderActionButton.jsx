import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { FaEllipsisV } from "react-icons/fa";
// import { updateOrder } from "../../../../lib/api/order.js";
import { toast } from "react-hot-toast";
import { updateOrder } from "../../../../lib/api/orders.js";

export default function OrderActionButton({ orderId, orderStatus }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const dropdownRef = useRef(null);
    const queryClient = useQueryClient();

    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data) => updateOrder(orderId, data),
    });

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsExpanded(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleExpanded = (e) => {
        e.stopPropagation();
        setIsExpanded((prev) => !prev);
    };

    const getActions = () => {
        const actions = [];

        // Status progression actions
        if (orderStatus === "PENDING") {
            actions.push({
                label: "Mark as Shipped",
                action: "SHIP",
                className: "text-purple-600 hover:bg-purple-50",
            });
        }

        if (orderStatus === "SHIPPED") {
            actions.push({
                label: "Mark as Delivered",
                action: "DELIVER",
                className: "text-green-600 hover:bg-green-50",
            });
        }

        // Cancellation (can cancel if not already delivered/cancelled)
        if (orderStatus !== "DELIVERED" && orderStatus !== "CANCELLED") {
            actions.push({
                label: "Cancel Order",
                action: "CANCEL",
                className: "text-red-600 hover:bg-red-50",
            });
        }

        return actions;
    };

    const actions = getActions();

    // No actions available
    if (actions.length === 0) {
        return <span className="w-4 h-4" />;
    }

    const getSuccessMessage = (action) => {
        switch (action) {
            case "SHIP":
                return "Order marked as shipped";
            case "DELIVER":
                return "Order marked as delivered";
            case "CANCEL":
                return "Order cancelled successfully";
            default:
                return "Action completed successfully";
        }
    };

    const handleAction = async (action) => {
        let data = {};

        switch (action) {
            case "SHIP":
                data.orderStatus = "SHIPPED";
                break;
            case "DELIVER":
                data.orderStatus = "DELIVERED";
                break;
            case "CANCEL":
                data.orderStatus = "CANCELLED";
                break;
            default:
                return;
        }

        try {
            await mutateAsync(data);
            toast.success(getSuccessMessage(action));
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        } catch (error) {
            toast.error(error?.message || "Something went wrong");
        } finally {
            setIsExpanded(false);
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            <button
                onClick={toggleExpanded}
                disabled={isPending}
                className="text-secondary-text hover:text-(--color-primary-text) transition-colors p-1 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? (
                    <div className="w-4 h-4 border-2 border-gray-300 border-t-current rounded-full animate-spin" />
                ) : (
                    <FaEllipsisV className="w-4 h-4" />
                )}
            </button>

            {isExpanded && (
                <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in duration-200">
                    {actions.map((action, index) => (
                        <button
                            disabled={isPending}
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAction(action.action);
                            }}
                            className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${action.className}`}
                        >
                            {action.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
