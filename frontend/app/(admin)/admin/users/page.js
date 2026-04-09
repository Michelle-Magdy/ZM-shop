import { Suspense } from 'react';
import {
    FaPlus,
    FaUsers,
    FaSearch,
    FaDownload,
    FaEllipsisV,
    FaChevronLeft,
    FaChevronRight,
    FaCircle
} from 'react-icons/fa';
import UsersStatsGridWrapper from '../../../components/admin/users/UsersStatsGridWrapper.jsx';
import LoadingSpinner from '../../../components/LoadingSpinner.jsx';
import UsersTable from '../../../components/admin/users/UsersTable.jsx';

export default function UsersPage() {

    return (
        <div className="space-y-8 animate-enter mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-(--color-primary-text)">
                        Users
                    </h1>
                    <p className="text-secondary-text mt-1">
                        Manage user accounts, roles and permissions.
                    </p>
                </div>
                <button className="bg-(--color-primary) hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm">
                    <FaPlus className="w-4 h-4" />
                    Add User
                </button>
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<LoadingSpinner/>}>
                <UsersStatsGridWrapper />
            </Suspense>

            <UsersTable />
        </div>
    );
}