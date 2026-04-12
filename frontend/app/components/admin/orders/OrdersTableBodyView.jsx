import { FaCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import OrderActionButton from "./OrderActionButton.jsx";

// Helper functions
const getStatusBadgeStyle = (status) => {
    const styles = {
        PENDING:
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
        SHIPPED:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        DELIVERED:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
        styles[status] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
};

const getStatusColor = (status) => {
    const colors = {
        PENDING: "#f59e0b", // amber
        SHIPPED: "#8b5cf6", // purple
        DELIVERED: "#22c55e", // green
        CANCELLED: "#ef4444", // red
    };
    return colors[status] || "#6b7280";
};

const getPaymentBadgeStyle = (status) => {
    const styles = {
        PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800",
        UNPAID: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border border-orange-200 dark:border-orange-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
};

// Price is in cents, convert to dollars
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount / 100);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

const getInitials = (name) => {
    if (!name) return "??";
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

export default function OrdersTableBodyView({
    data,
    loading,
    error,
    onPageChange,
    onOrderClick,
}) {

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <div className="text-center text-red-500">
                    Error: {error.message}
                </div>
            </div>
        );
    }

    // Handle your actual API response structure
    const orders = data?.data || [];
    const totalCount = data?.totalCount || 0;
    const currentPage = data?.currentPage || 1;
    const totalPages = data?.totalPages || 1;

    if (!orders.length) {
        return (
            <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <div className="text-center text-secondary-text">
                    No orders found
                </div>
            </div>
        );
    }

    const startRange = (currentPage - 1) * orders.length + 1;
    const endRange = startRange + orders.length - 1;

    return (
        <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Order
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Date
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Items
                            </th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Total
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {orders.map((order) => (
                            <tr
                                key={order._id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer"
                                onClick={() => onOrderClick?.(order)}
                            >
                                <td className="py-4 px-6">
                                    <span className="font-bold text-(--color-primary-text) dark:text-blue-400 text-sm hover:underline">
                                        {order.orderNumber}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs">
                                            {getInitials(order.userId?.name)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-(--color-primary-text) text-sm">
                                                {order.userId?.name ||
                                                    "Unknown"}
                                            </p>
                                            <p className="text-xs text-secondary-text">
                                                {order.paymentMethod} •{" "}
                                                {order.address?.label ||
                                                    "No label"}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-sm text-secondary-text">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="py-4 px-6 text-center text-sm text-secondary-text">
                                    {order.items?.length || 0} items
                                </td>
                                <td className="py-4 px-6 text-right font-semibold text-(--color-primary-text)">
                                    {formatCurrency(order.totalPrice)}
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <FaCircle
                                            className="w-2 h-2"
                                            style={{
                                                color: getStatusColor(
                                                    order.orderStatus,
                                                ),
                                            }}
                                        />
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeStyle(order.orderStatus)}`}
                                        >
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentBadgeStyle(order.paymentStatus)}`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-center">
                                    <OrderActionButton orderId={order._id} orderStatus={order.orderStatus} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between bg-gray-50 dark:bg-gray-900/50">
                <p className="text-sm text-secondary-text">
                    Showing{" "}
                    <span className="font-medium text-(--color-primary-text)">
                        {startRange}-{endRange}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-(--color-primary-text)">
                        {totalCount}
                    </span>{" "}
                    orders
                </p>
                <div className="flex items-center gap-1">
                    <button
                        disabled={currentPage === 1}
                        className="p-2 text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(currentPage - 1)}
                    >
                        <FaChevronLeft className="w-4 h-4" />
                    </button>

                    {Array.from(
                        { length: Math.min(totalPages, 3) },
                        (_, i) => i + 1,
                    ).map((page) => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                page === currentPage
                                    ? "bg-(--color-primary) text-white"
                                    : "text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-200 dark:hover:bg-gray-800"
                            }`}
                        >
                            {page}
                        </button>
                    ))}

                    {totalPages > 3 && (
                        <>
                            <span className="text-secondary-text px-2">
                                ...
                            </span>
                            <button
                                onClick={() => onPageChange(totalPages)}
                                className="px-3 py-1 text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-sm transition-colors"
                            >
                                {totalPages}
                            </button>
                        </>
                    )}

                    <button
                        disabled={currentPage === totalPages}
                        className="p-2 text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => onPageChange(currentPage + 1)}
                    >
                        <FaChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
