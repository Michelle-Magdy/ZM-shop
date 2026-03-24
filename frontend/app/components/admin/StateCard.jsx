// src/components/admin/StatCard.tsx
"use client";

import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../../lib/utils";
import LoadingSpinner from "../LoadingSpinner";
export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last period",
  icon: Icon,
  trend = "neutral",
  color = "primary",
}) {
  const colorStyles = {
    primary: "bg-[var(--color-primary)]/10 text-[var(--color-primary)]",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    danger: "bg-red-500/10 text-red-600",
  };

  return (
    <div className="bg-(--color-card) rounded-xl p-6 shadow-sm border border-badge/30 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-text">{title}</p>
          <h3 className="text-3xl font-bold text-(--color-primary-text) mt-2">
            {value}
          </h3>

          {change !== undefined && (
            <div className="flex items-center gap-2 mt-3">
              <span
                className={`
                flex items-center gap-1 text-sm font-medium
                ${
                  trend === "up"
                    ? "text-emerald-600"
                    : trend === "down"
                      ? "text-red-600"
                      : "text-secondary-text"
                }`}
              >
                {trend === "up" && <TrendingUp size={16} />}
                {trend === "down" && <TrendingDown size={16} />}
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              <span className="text-xs text-secondary-text">{changeLabel}</span>
            </div>
          )}
        </div>

        <div className={cn("p-3 rounded-xl", colorStyles[color])}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
