import { Suspense } from 'react';
import UsersStatsGridWrapper from '../../../components/admin/users/UsersStatsGridWrapper.jsx';
import LoadingSpinner from '../../../components/LoadingSpinner.jsx';
import UsersTable from '../../../components/admin/users/UsersTable.jsx';
import AddUserButton from '../../../components/admin/users/AddUserButton.jsx';

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
                <AddUserButton />
            </div>

            {/* Stats Cards */}
            <Suspense fallback={<LoadingSpinner/>}>
                <UsersStatsGridWrapper />
            </Suspense>

            {/* Users table */}
            <UsersTable />
        </div>
    );
}