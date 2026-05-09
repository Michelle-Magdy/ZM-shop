"use client";

import { getUserOrders } from "@/lib/api/orders";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import OrderCard from "./OrderCard";
import LoadingSpinner from "../../LoadingSpinner";
import PaginationClient from "../../PaginationClient.jsx";

const STATUS_FILTERS = ["ALL", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

export default function OrderList({ user }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("ALL");

    const { data, isError, isFetching, error, isSuccess } = useQuery({
        queryKey: ["orders", user?.id, currentPage, statusFilter],
        queryFn: () =>
            getUserOrders({
                page: currentPage,
                status: statusFilter === "ALL" ? undefined : statusFilter,
            }),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
        placeholderData: (previousData) => previousData,
    });

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleFilterChange = (filter) => {
        setStatusFilter(filter);
        setCurrentPage(1);
    };

    if (isError) {
        return (
            <main className="min-h-screen p-4">
                <div className="text-red-500 text-center">
                    Error loading Orders:{" "}
                    {error?.message || "Something went wrong"}
                </div>
            </main>
        );
    }

    // Extract from nested response structure
    const orders = data?.orders?.documents || [];
    const pagination = data?.orders || {
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
    };

    return (
        <div className="space-y-6">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
                {STATUS_FILTERS.map((filter) => (
                    <button
                        key={filter}
                        onClick={() => handleFilterChange(filter)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            statusFilter === filter
                                ? "bg-primary text-white"
                                : "bg-card border border-badge/50 text-secondary-text hover:border-primary/30 hover:text-primary-text"
                        }`}
                    >
                        {filter === "ALL"
                            ? "All Orders"
                            : filter.charAt(0) + filter.slice(1).toLowerCase()}
                    </button>
                ))}
            </div>

            {/* Order Count */}
            {isSuccess && (
                <p className="text-sm text-secondary-text">
                    Showing {orders.length} of {pagination.totalCount} orders
                    {statusFilter !== "ALL" &&
                        ` • Filtered by: ${statusFilter.toLowerCase()}`}
                </p>
            )}

            {/* Orders List */}
            {isFetching && !data ? (
                <LoadingSpinner />
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard key={order._id} order={order} />
                    ))}

                    {isSuccess && orders.length === 0 && (
                        <div className="text-center py-12 bg-card rounded-2xl border border-dashed border-badge">
                            <p className="text-secondary-text">
                                No{" "}
                                {statusFilter !== "ALL"
                                    ? statusFilter.toLowerCase()
                                    : ""}{" "}
                                orders found
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {isSuccess && pagination.totalPages > 1 && (
                <PaginationClient
                    currentPage={currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
