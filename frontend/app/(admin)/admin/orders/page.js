import OrdersStatsGridWrapper from "../../../components/admin/orders/OrdersStatsGridWrapper.jsx";
import OrdersTable from "../../../components/admin/orders/OrdersTable.jsx";

export default function OrdersPage() {
    return (
        <div className="space-y-8 animate-enter mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-(--color-primary-text)">
                        Orders
                    </h1>
                    <p className="text-secondary-text mt-1">
                        Manage and track customer orders, payment and shipments.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            {/* <Suspense fallback={<LoadingSpinner />}> */}
                <OrdersStatsGridWrapper />
            {/* </Suspense> */}

            {/* Orders table */}
            <OrdersTable />
        </div>
    )
}