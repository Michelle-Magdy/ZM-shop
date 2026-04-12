"use client";
import { useState } from "react";
import OrdersFilter from "./OrdersFilter.jsx";
import OrdersTableBody from "./OrdersTableBody.jsx";
import useDebounced from "../../../../lib/hooks/useDebounced.js";

export default function OrdersTable() {
    const [filters, setFilters] = useState({
        search: "",
        status: "", // PENDING, SHIPPED, DELIVERED, CANCELLED
        paymentStatus: "", // PAID, UNPAID
    });

    const debouncedSearch = useDebounced(filters.search);

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <div className="space-y-6">
            <OrdersFilter filters={filters} onChange={handleFilterChange} />
            <OrdersTableBody
                searchTerm={debouncedSearch}
                status={filters.status}
                paymentStatus={filters.paymentStatus}
            />
        </div>
    );
}
