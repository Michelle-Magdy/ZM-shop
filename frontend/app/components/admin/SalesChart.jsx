// src/components/admin/SalesChart.tsx
"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import {
  format,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  eachQuarterOfInterval,
  eachYearOfInterval,
  isSameDay,
  isSameWeek,
  isSameMonth,
  isSameQuarter,
  isSameYear,
} from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { getChartData } from "@/lib/api/dashboard";
import LoadingSpinner from "../LoadingSpinner";

export function SalesChart({
  dateRange,
  type = "area",
  metric = "sales",
  groupBy = "day",
}) {
  const fromDate = dateRange.from.toISOString().split("T")[0];
  const toDate = dateRange.to.toISOString().split("T")[0];

  const { isPending, error, isError, data } = useQuery({
    queryKey: ["chart", "dashboard", fromDate, toDate, groupBy],
    queryFn: () => getChartData(fromDate, toDate, groupBy),
    enabled: !!fromDate && !!toDate && !!groupBy,
    staleTime: 1000 * 60,
  });
  // Fill in missing dates with zeros
  const chartData = useMemo(() => {
    const config = {
      day: {
        interval: eachDayOfInterval,
        check: isSameDay,
        labelFormat: "MMM dd",
      },
      month: {
        interval: eachMonthOfInterval,
        check: isSameMonth,
        labelFormat: "MMM yyyy",
      },
      quarter: {
        interval: eachQuarterOfInterval,
        check: isSameQuarter,
        labelFormat: "QQQ yyyy",
      },
      year: {
        interval: eachYearOfInterval,
        check: isSameYear,
        labelFormat: "yyyy",
      },
    };

    const { interval, check, labelFormat } = config[groupBy] || config.day;
    const allDates = interval({
      start: dateRange.from,
      end: dateRange.to,
    });

    return allDates.map((date) => {
      const dayData = data?.data.find((item) =>
        check(
          new Date(
            item.label.year,
            (item.label.month || 1) - 1, // months are 0-indexed in JS
            item.label.day || 1,
          ),
          date,
        ),
      );
      return {
        date: format(date, labelFormat),
        fullDate: date,
        sales: dayData?.revenue || 0,
        orders: dayData?.orders || 0,
        customers: dayData?.numberOfCustomers || 0,
      };
    });
  }, [data, dateRange]);

  if (isPending) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <>{error}</>;
  }

  const metricConfig = {
    sales: {
      label: "Sales",
      color: "#104e64",
      gradient: ["#104e64", "#167685"],
    },
    orders: {
      label: "Orders",
      color: "#2563eb",
      gradient: ["#2563eb", "#3b82f6"],
    },
    customers: {
      label: "New Customers",
      color: "#10b981",
      gradient: ["#10b981", "#34d399"],
    },
  };

  const config = metricConfig[metric];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-(--color-card) p-3 rounded-lg shadow-lg border border-badge/30">
          <p className="text-sm font-medium text-(--color-primary-text) mb-1">
            {label}
          </p>
          <p className="text-lg font-bold" style={{ color: config.color }}>
            {metric === "sales"
              ? `$${payload[0].value.toLocaleString()}`
              : payload[0].value.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {

    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 10, left: 0, bottom: 0 },
    };

    switch (type) {
      case "area":
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={config.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={config.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-badge)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
              tickFormatter={(value) =>
                metric === "sales" ? `$${value / 1000}k` : value
              }
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              fillOpacity={1}
              fill="url(#colorMetric)"
              strokeWidth={2}
            />
          </AreaChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-badge)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={metric} fill={config.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-badge)"
              opacity={0.3}
            />
            <XAxis
              dataKey="date"
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
            />
            <YAxis
              stroke="var(--color-secondary-text)"
              fontSize={12}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={metric}
              stroke={config.color}
              strokeWidth={3}
              dot={{ fill: config.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="h-100 w-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
