import { FaSearch, FaDownload } from "react-icons/fa";

export default function UsersFilter({ onChange, filters }) {
    return (
        <div className="bg-(--color-card) rounded-xl border border-gray-200 dark:border-gray-800 p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-3 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={filters.search}
                            onChange={(e) =>
                                onChange({ search: e.target.value })
                            }
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-(--color-primary) text-(--color-primary-text)"
                        />
                    </div>

                    <div className="ml-auto">
                        {/* Role */}
                        <select
                            value={filters.role}
                            onChange={(e) => onChange({ role: e.target.value })}
                            className="px-4 py-2.5 bg-gray-50 mx-5 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-(--color-primary-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        >
                            <option value="">All Roles</option>
                            <option value="admin">Admin</option>
                            <option value="user">Customer</option>
                            <option value="vendor">Vendor</option>
                        </select>

                        {/* Status */}
                        <select
                            value={filters.status}
                            onChange={(e) =>
                                onChange({ status: e.target.value })
                            }
                            className="px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-(--color-primary-text) focus:outline-none focus:ring-2 focus:ring-(--color-primary)"
                        >
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="deleted">Deleted</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
