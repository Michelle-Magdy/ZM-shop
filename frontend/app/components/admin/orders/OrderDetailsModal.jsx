import {
    FaTimes,
    FaMapMarkerAlt,
    FaPhone,
    FaUser,
    FaCreditCard,
    FaTruck,
    FaCalendar,
    FaClock,
} from "react-icons/fa";

// Helper functions (can be imported from a utils file)
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount / 100);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getStatusBadgeStyle = (status) => {
    const styles = {
        PENDING:
            "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
        SHIPPED:
            "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200 dark:border-purple-800",
        DELIVERED:
            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
        CANCELLED:
            "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
    };
    return (
        styles[status] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
};

const getPaymentBadgeStyle = (status) => {
    const styles = {
        PAID: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800",
        UNPAID: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200 dark:border-orange-800",
    };
    return styles[status] || "bg-gray-100 text-gray-800";
};

export default function OrderDetailsModal({ order, onClose }) {
    if (!order) return null;

    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Prevent click propagation from modal content
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-(--color-card) w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-200"
                onClick={handleContentClick}
            >
                {/* Header */}
                <div className="sticky top-0 bg-(--color-card) border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-bold text-(--color-primary-text)">
                            Order {order.orderNumber}
                        </h2>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(order.orderStatus)}`}
                        >
                            {order.orderStatus}
                        </span>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentBadgeStyle(order.paymentStatus)}`}
                        >
                            {order.paymentStatus}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Order Meta Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-secondary-text">
                            <FaCalendar className="w-4 h-4" />
                            <span>Placed on {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary-text">
                            <FaClock className="w-4 h-4" />
                            <span>Updated {formatDate(order.updatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary-text">
                            <FaCreditCard className="w-4 h-4" />
                            <span>{order.paymentMethod} Payment</span>
                        </div>
                        <div className="flex items-center gap-2 text-secondary-text">
                            <FaTruck className="w-4 h-4" />
                            <span>{order.items?.length || 0} Items</span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                            <h3 className="font-semibold text-(--color-primary-text) mb-3 flex items-center gap-2">
                                <FaUser className="w-4 h-4 text-blue-500" />
                                Customer
                            </h3>
                            <div className="space-y-2">
                                <p className="text-sm font-medium text-(--color-primary-text)">
                                    {order.userId?.name || "Unknown Customer"}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-secondary-text">
                                    <FaPhone className="w-3 h-3" />
                                    <span>{order.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                            <h3 className="font-semibold text-(--color-primary-text) mb-3 flex items-center gap-2">
                                <FaMapMarkerAlt className="w-4 h-4 text-red-500" />
                                Shipping Address
                            </h3>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-(--color-primary-text)">
                                    {order.address?.label || "Address"}
                                </p>
                                <p className="text-sm text-secondary-text">
                                    {order.address?.fullAddress}
                                </p>
                                {order.address?.location?.coordinates && (
                                    <p className="text-xs text-secondary-text font-mono mt-2">
                                        Lat:{" "}
                                        {order.address.location.coordinates[1]},
                                        Lng:{" "}
                                        {order.address.location.coordinates[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items List */}
                    <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                                <tr>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-text uppercase">
                                        Item
                                    </th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-secondary-text uppercase">
                                        Variant
                                    </th>
                                    <th className="text-center py-3 px-4 text-xs font-semibold text-secondary-text uppercase">
                                        Qty
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-text uppercase">
                                        Price
                                    </th>
                                    <th className="text-right py-3 px-4 text-xs font-semibold text-secondary-text uppercase">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {order.items?.map((item, index) => (
                                    <tr
                                        key={index}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900/30"
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                {item.coverImage && (
                                                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-xs text-gray-500">
                                                        IMG
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-sm font-medium text-(--color-primary-text)">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-xs text-secondary-text">
                                                        {item.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-secondary-text">
                                            {item.variant?.attributeValues && (
                                                <div className="space-y-0.5">
                                                    {Object.entries(
                                                        item.variant
                                                            .attributeValues,
                                                    ).map(([key, value]) => (
                                                        <span
                                                            key={key}
                                                            className="inline-block mr-2"
                                                        >
                                                            <span className="text-xs text-gray-500">
                                                                {key}:
                                                            </span>{" "}
                                                            {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500 mt-1">
                                                SKU: {item.variant?.sku}
                                            </p>
                                        </td>
                                        <td className="py-3 px-4 text-center text-sm text-(--color-primary-text)">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3 px-4 text-right text-sm text-secondary-text">
                                            {formatCurrency(
                                                item.variant?.price || 0,
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right text-sm font-medium text-(--color-primary-text)">
                                            {formatCurrency(
                                                (item.variant?.price || 0) *
                                                    item.quantity,
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="py-3 px-4 text-right text-sm font-medium text-secondary-text"
                                    >
                                        Total
                                    </td>
                                    <td className="py-3 px-4 text-right text-lg font-bold text-(--color-primary-text)">
                                        {formatCurrency(order.totalPrice)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/*Payment status*/}
                    <div className="bg-gray-50 w-md mx-auto dark:bg-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-800">
                        <h3 className="font-semibold text-(--color-primary-text) mb-3">
                            Payment Details
                        </h3>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-secondary-text">
                                    Method
                                </span>
                                <span className="font-medium text-(--color-primary-text)">
                                    {order.paymentMethod}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-secondary-text">
                                    Status
                                </span>
                                <span
                                    className={`font-medium ${order.paymentStatus === "PAID" ? "text-green-600" : "text-orange-600"}`}
                                >
                                    {order.paymentStatus}
                                </span>
                            </div>

                            {/* Stripe Details (Collapsible) */}
                            {(order.stripeSessionId ||
                                order.stripePaymentIntentId) && (
                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-secondary-text mb-2">
                                        Transaction Details
                                    </p>
                                    {order.stripeSessionId && (
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">
                                                Session ID
                                            </span>
                                            <span className="font-mono text-gray-600 truncate max-w-37.5">
                                                {order.stripeSessionId}
                                            </span>
                                        </div>
                                    )}
                                    {order.stripePaymentIntentId && (
                                        <div className="flex justify-between text-xs mt-1">
                                            <span className="text-gray-500">
                                                Payment Intent
                                            </span>
                                            <span className="font-mono text-gray-600 truncate max-w-37.5">
                                                {order.stripePaymentIntentId}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-(--color-primary) hover:bg-primary-hover rounded-lg transition-colors"
                            onClick={() => window.print()}
                        >
                            Print Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
