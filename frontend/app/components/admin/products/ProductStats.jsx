// src/components/admin/products/ProductStats.jsx
"use client";

import { useProductStats } from "@/lib/hooks/products/useProductStats";
import { Package, TrendingUp, Star, AlertCircle } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner";

export const ProductStats = () => {
  const { data, isLoading, isError, error } = useProductStats();
  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return <>Failed to fetch stats {error}</>;
  }
  const stats = data.data;

  const cards = [
    {
      label: "Total Products",
      value: stats.total,
      icon: Package,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Active Products",
      value: stats.active,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    {
      label: "Low Stock Alert",
      value: stats.lowStock,
      icon: AlertCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
    {
      label: "Featured",
      value: stats.featured,
      icon: Star,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl p-4 hover:border-(--color-primary)/30 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-(--color-secondary-text)">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-(--color-primary-text) mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg ${card.bgColor} ${card.color}`}>
                <Icon size={20} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
