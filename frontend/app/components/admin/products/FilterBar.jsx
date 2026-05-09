// src/components/admin/products/FilterBar.jsx
"use client";

import { useState, useCallback } from "react";
import {
    Search,
    Filter,
    Grid3X3,
    List,
    Download,
    Plus,
    Loader2,
} from "lucide-react";
import { debounce } from "../../../../lib/util/productUtils";
import { useCategories } from "@/lib/hooks/categories/useCategories";
import LoadingSpinner from "../../LoadingSpinner";

export const FilterBar = ({
    filters,
    onFilterChange,
    viewMode,
    onViewModeChange,
    onAddNew,
    selectedCount,
    onBulkAction,
}) => {
    const [searchValue, setSearchValue] = useState(filters.search || "");

    const { data, isLoading, isError, error } = useCategories();

    const categories = data?.data;
    // Debounced search
    const debouncedSearch = useCallback(
        debounce((value) => {
            onFilterChange({ ...filters, search: value, page: 1 });
        }, 300),
        [filters],
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        debouncedSearch(value);
    };

    const statusOptions = [
        { value: "", label: "All Status" },
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
        { value: "archived", label: "Archived" },
        { value: "discontinued", label: "Discontinued" },
    ];

    return (
        <div className="space-y-4">
            {/* Main Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[280px]">
                    <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-secondary-text)"
                        size={18}
                    />
                    <input
                        type="text"
                        placeholder="Search products, SKUs..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-(--color-primary-text) placeholder:text-(--color-secondary-text) focus:outline-none focus:border-(--color-primary) transition-colors"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={filters.status}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            status: e.target.value,
                            page: 1,
                        })
                    }
                    className="px-4 py-2.5 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-(--color-primary-text) focus:outline-none focus:border-(--color-primary) cursor-pointer"
                >
                    {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Category Filter */}
                <select
                    value={filters.category}
                    onChange={(e) =>
                        onFilterChange({
                            ...filters,
                            category: e.target.value,
                            page: 1,
                        })
                    }
                    className="px-4 py-2.5 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-(--color-primary-text) focus:outline-none focus:border-(--color-primary) cursor-pointer"
                >
                    <option value="all">All Categories</option>
                    <option value="none">UnCategorized</option>
                    {isLoading ? (
                        <option disabled>Loading...</option>
                    ) : isError ? (
                        <option disabled className="text-red-500">
                            {error}
                        </option>
                    ) : (
                        categories.map((c) => (
                            <option key={c.slug} value={c.slug}>
                                {c.name}
                            </option>
                        ))
                    )}
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-(--color-card) border border-(--color-badge)/30 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange("grid")}
                        className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-(--color-primary) text-white" : "text-(--color-secondary-text) hover:text-(--color-primary-text)"}`}
                    >
                        <Grid3X3 size={18} />
                    </button>
                    <button
                        onClick={() => onViewModeChange("list")}
                        className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-(--color-primary) text-white" : "text-(--color-secondary-text) hover:text-(--color-primary-text)"}`}
                    >
                        <List size={18} />
                    </button>
                </div>

                {/* Add New Button */}
                <button
                    onClick={onAddNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-(--color-primary) hover:bg-(--color-primary-hover) text-white rounded-lg transition-colors font-medium"
                >
                    <Plus size={18} />
                    <span>Add Product</span>
                </button>
            </div>

            {/* Bulk Actions Bar */}
            {selectedCount > 0 && (
                <div className="flex items-center gap-3 px-4 py-3 bg-(--color-primary)/10 border border-(--color-primary)/30 rounded-lg animate-enter">
                    <span className="text-sm font-medium text-(--color-primary-text)">
                        {selectedCount} product{selectedCount !== 1 ? "s" : ""}{" "}
                        selected
                    </span>
                    <div className="h-4 w-px bg-(--color-badge)" />
                    <button
                        onClick={() => onBulkAction("activate")}
                        className="text-sm text-(--color-primary) hover:underline"
                    >
                        Activate
                    </button>
                    <button
                        onClick={() => onBulkAction("archive")}
                        className="text-sm text-(--color-primary) hover:underline"
                    >
                        Archive
                    </button>
                    <button
                        onClick={() => onBulkAction("delete")}
                        className="text-sm text-red-400 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
};
