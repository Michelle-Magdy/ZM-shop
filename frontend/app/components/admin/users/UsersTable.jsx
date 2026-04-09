"use client";
import { useState } from "react";
import UsersFilter from "./UsersFilter.jsx";
import UsersTableBody from "./UsersTableBody.jsx";
import useDebounced from "../../../../lib/hooks/useDebounced.js";

export default function UsersTable() {
    const [filters, setFilters] = useState({
        search: "",
        role: "",
        status: "",
    });

    const debouncedSearch = useDebounced(filters.search);

    const handleFilterChange = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <div className="space-y-6">
            <UsersFilter filters={filters} onChange={handleFilterChange} />
            <UsersTableBody
                searchTerm={debouncedSearch}
                role={filters.role}
                status={filters.status}
            />
        </div>
    );
}
