"use client";

import { Package, Truck, CheckCircle2, Clock } from "lucide-react";
import OrderCard from "@/app/components/account/Orders/OrderCard";
import { useQuery } from "@tanstack/react-query";
import OrderStats from "@/app/components/account/Orders/OrderStats";
import { useAuth } from "@/app/context/AuthenticationProvider";
import OrderList from "@/app/components/account/Orders/OrderList";

// Main Track Orders Page
export default function TrackOrders() {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-(--color-primary-text) mb-2">
          Track Orders
        </h1>
        <p className="text-secondary-text">
          Monitor your order status and delivery progress
        </p>
      </div>

      <OrderStats user={user} />

      <OrderList user={user} />

      {/* Empty State (hidden by default, shown when no orders) */}
      {false && (
        <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-badge">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-badge/30 flex items-center justify-center">
            <Package size={32} className="text-secondary-text" />
          </div>
          <h3 className="text-lg font-semibold text-primary-text mb-2">
            No orders yet
          </h3>
          <p className="text-secondary-text mb-6">
            Start shopping to see your orders here
          </p>
          <button className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-hover transition-colors">
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}
