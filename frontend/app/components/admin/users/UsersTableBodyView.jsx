import {
    FaCircle,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import ActionButton from "./ActionButton.jsx";

// Helper functions
const getRoleBadgeStyle = (role) => {
    const styles = {
        admin: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
        user: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
        vendor: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return (
        styles[role] ||
        "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
    );
};

const getStatusColor = (status) => {
    const colors = {
        active: "#22c55e", // green
        suspended: "#f59e0b", // amber
        deleted: "#ef4444", // red
    };
    return colors[status] || "#6b7280";
};

const getStatus = (user) => {
    if (user.isDeleted) return "deleted";
    if (user.isSuspended) return "suspended";
    return "active";
};

const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(amount);
};

const getInitials = (name) => {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
};

const getRoleColor = (role) => {
    const colors = {
        admin: "#8b5cf6", // purple
        user: "#3b82f6", // blue
        vendor: "#10b981", // green
        // Add more roles as needed
    };
    return colors[role] || "#6b7280"; // default gray
};

const getUserColor = (roles) => {
    const priority = ["admin", "vendor", "user"]; // highest to lowest
    const roleNames = roles.map((r) => r.name);

    // Find highest priority role
    const primaryRole =
        priority.find((r) => roleNames.includes(r)) || roleNames[0];

    return getRoleColor(primaryRole);
};

export default function UsersTableBodyView({
    data,
    loading,
    error,
    onPageChange,
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

    if (!data?.data?.length) {
        return (
            <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
                <div className="text-center text-secondary-text">
                    No users found
                </div>
            </div>
        );
    }

    const { data: users, totalCount, currentPage, totalPages } = data;
    const startRange = (currentPage - 1) * users.length + 1;
    const endRange = startRange + users.length - 1;
    
    return (
        <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                        <tr>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                User
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Roles
                            </th>
                            <th className="text-left py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Orders
                            </th>
                            <th className="text-right py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Total Spent
                            </th>
                            <th className="text-center py-4 px-6 text-xs font-semibold text-secondary-text uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {users.map((user) => {
                            const status = getStatus(user);
                            const statusColor = getStatusColor(status);

                            return (
                                <tr
                                    key={user._id}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                                >
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                                                style={{
                                                    backgroundColor:
                                                        getUserColor(
                                                            user.roles,
                                                        ),
                                                }}
                                            >
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-(--color-primary-text) text-sm">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-secondary-text">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex flex-wrap gap-1">
                                            {user.roles.map((role) => (
                                                <span
                                                    key={role._id}
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeStyle(role.name)}`}
                                                >
                                                    {role.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-2">
                                            <FaCircle
                                                className="w-2 h-2"
                                                style={{ color: statusColor }}
                                            />
                                            <span className="text-sm text-(--color-primary-text) capitalize">
                                                {status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-center text-sm text-secondary-text">
                                        {user.ordersStats?.count || 0}
                                    </td>
                                    <td className="py-4 px-6 text-right font-semibold text-(--color-primary-text)">
                                        {formatCurrency(
                                            user.ordersStats?.totalSpent || 0,
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <ActionButton userId={user._id} status={status}/>
                                    </td>
                                </tr>
                            );
                        })}
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
                    users
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
                            <button className="px-3 py-1 text-secondary-text hover:text-(--color-primary-text) hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg text-sm transition-colors">
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
