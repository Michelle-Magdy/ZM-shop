// src/app/(admin)/admin/page.js
"use client";

import { useState } from "react";
import {
  Users,
  Calendar,
  Download,
  RefreshCw,
  BarChart3,
  LineChart,
  AreaChart,
  Package,
} from "lucide-react";
import { subDays, format } from "date-fns";
import { DateRangePicker } from "../../components/admin/DateRangePicker";
import { SalesChart } from "../../components/admin/SalesChart";
import { RecentOrders } from "../../components/admin/RecentOrders";
import { cn } from "../../../lib/utils.js";
import StatsGrid from "@/app/components/admin/StatsGrid";
import { useRouter } from "next/navigation.js";

const CHART_TYPES = [
  { type: "area", icon: AreaChart, label: "Area" },
  { type: "bar", icon: BarChart3, label: "Bar" },
  { type: "line", icon: LineChart, label: "Line" },
];

const METRICS = [
  { value: "sales", label: "Revenue", color: "#104e64" },
  { value: "orders", label: "Orders", color: "#2563eb" },
  { value: "customers", label: "Customers", color: "#10b981" },
];

const GROUP_BY_OPTS = [
  { value: "day", label: "Day" },
  { value: "quarter", label: "Quarter" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export default function AdminDashboardPage() {
  // Date range state
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
    label: "Last 30 days",
  });

  // Chart settings
  const [chartType, setChartType] = useState("area");
  const [activeMetric, setActiveMetric] = useState("sales");
  const [groupBy, setGroupBy] = useState("day");
  const router = useRouter();

  return (
    <div className="space-y-8 animate-enter">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-(--color-primary-text)">
            Dashboard
          </h1>
          <p className="text-secondary-text mt-1">
            Welcome back! Here's what's happening with your store.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />

        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid dateRange={dateRange} />

      {/* Main Chart Section */}
      <div className="bg-(--color-card) rounded-xl shadow-sm border border-badge/30 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-(--color-primary-text)">
              Performance Overview
            </h3>
            <p className="text-sm text-secondary-text">
              Track your sales, orders, and customer growth over time
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Metric Selector */}
            <div className="flex items-center bg-badge/20 rounded-lg p-1">
              {METRICS.map((metric) => (
                <button
                  key={metric.value}
                  onClick={() => setActiveMetric(metric.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    activeMetric === metric.value
                      ? "bg-(--color-card) text-(--color-primary-text) shadow-sm"
                      : "text-secondary-text hover:text-(--color-primary-text)",
                  )}
                >
                  {metric.label}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center gap-1 border-l border-badge/30 pl-3">
              {CHART_TYPES.map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    chartType === type
                      ? "bg-(--color-primary)/10 text-(--color-primary)"
                      : "text-secondary-text hover:bg-badge/20",
                  )}
                  title={`${type} chart`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            <div className="border-l border-badge/30 pl-3">
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
                className="p-2 rounded-lg transition-colors bg-(--color-primary)/10 text-(--color-primary)"
              >
                {GROUP_BY_OPTS.map(({ value, label }) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <SalesChart
          dateRange={dateRange}
          type={chartType}
          metric={activeMetric}
          groupBy={groupBy}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>

        {/* Quick Actions / Info Card */}
        <div className="bg-(--color-card) rounded-xl shadow-sm border border-badge/30 p-6">
          <h3 className="text-lg font-semibold text-(--color-primary-text) mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-(--color-primary)/10 text-(--color-primary) hover:bg-(--color-primary)/20 transition-colors text-left">
              <Package size={20} />
              <div>
                <p className="font-medium" onClick={() => router.push('/admin/products/new')}>Add New Product</p>
                <p className="text-xs opacity-80">
                  Create a new product listing
                </p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-badge/20 text-(--color-primary-text) hover:bg-badge/30 transition-colors text-left">
              <Users size={20} />
              <div>
                <p className="font-medium" onClick={() => router.push('/admin/users')}>Manage Users</p>
                <p className="text-xs text-secondary-text">
                  View and edit user accounts
                </p>
              </div>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-badge/20 text-(--color-primary-text) hover:bg-badge/30 transition-colors text-left">
              <Calendar size={20} />
              <div>
                <p className="font-medium" onClick={() => router.push('/admin/reports')}>View Reports</p>
                <p className="text-xs text-secondary-text">
                  Generate detailed reports
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
