"use client";

import { getRecentOrders } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
    Package,
    Truck,
    CheckCircle,
    Clock,
    MoreHorizontal,
    CreditCard, // Added for Paid
    AlertCircle, // Added for Unpaid
    HelpCircle, // Fallback icon
} from "lucide-react";
import { useRouter } from "next/navigation.js";
import LoadingSpinner from "../LoadingSpinner";

// 1. Updated Icon Map to include payment statuses
const STATUS_ICONS = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
    paid: CreditCard,
    unpaid: AlertCircle,
};

// 2. Updated Color Map to include payment colors
const STATUS_COLORS = {
    pending: "text-amber-600 bg-amber-50",
    processing: "text-blue-600 bg-blue-50",
    shipped: "text-purple-600 bg-purple-50",
    delivered: "text-emerald-600 bg-emerald-50",
    paid: "text-emerald-600 bg-emerald-50",
    unpaid: "text-rose-600 bg-rose-50",
};

export function RecentOrders() {
    const router = useRouter();

    const { isPending, isError, error, data } = useQuery({
        queryKey: ["dashboard", "recentOrders"],
        queryFn: getRecentOrders,
        staleTime: 1000 * 30,
    });

    if (isPending) return <LoadingSpinner />;
    if (isError)
        return <div className="p-4 text-red-500">Error loading orders</div>;

    const orders = data?.data || [];

    return (
        <div className="bg-(--color-card) rounded-xl shadow-sm border border-badge/30 overflow-hidden">
            <div className="px-6 py-4 border-b border-badge/30 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-(--color-primary-text)">
                    Recent Orders
                </h3>
                <button
                    onClick={() => router.push("/admin/orders")}
                    className="text-sm text-(--color-primary) hover:text-primary-hover font-medium"
                >
                    View All
                </button>
            </div>

            <div className="divide-y divide-badge/20">
                {orders.map((order) => {
                    // DEFENSIVE LOGIC: Safely look up icons using lowercase keys
                    // If the status doesn't exist in our map, we use HelpCircle so it doesn't crash
                    const OrderIcon =
                        STATUS_ICONS[order.orderStatus?.toLowerCase()] ||
                        HelpCircle;
                    const PaymentIcon =
                        STATUS_ICONS[order.paymentStatus?.toLowerCase()] ||
                        HelpCircle;

                    return (
                        <div
                            key={order._id}
                            className="px-6 py-4 flex items-center justify-between hover:bg-badge/10 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Order Status Icon */}
                                <div
                                    className={`p-2 rounded-lg ${STATUS_COLORS[order.orderStatus?.toLowerCase()] || "bg-gray-100"}`}
                                >
                                    <OrderIcon size={18} />
                                </div>

                                {/* Payment Status Icon */}
                                <div
                                    className={`p-2 rounded-lg ${STATUS_COLORS[order.paymentStatus?.toLowerCase()] || "bg-gray-100"}`}
                                >
                                    <PaymentIcon size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-(--color-primary-text)">
                                        {order.product}
                                    </p>
                                    <p className="text-xs text-secondary-text">
                                        {order.customerName} •{" "}
                                        {format(
                                            new Date(order.date),
                                            "MMM d, h:mm a",
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold text-(--color-primary-text)">
                                    ${order.totalPrice.toFixed(2)}
                                </span>
                                <span
                                    className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                                        STATUS_COLORS[
                                            order.orderStatus?.toLowerCase()
                                        ] || "bg-gray-100"
                                    }`}
                                >
                                    {order.orderStatus}
                                </span>
                                <button className="text-secondary-text hover:text-(--color-primary-text)">
                                    <MoreHorizontal size={18} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
