import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { StatCard } from "./StateCard";
import { useQuery } from "@tanstack/react-query";
import { getStats } from "@/lib/api/dashboard";
import LoadingSpinner from "../LoadingSpinner";

export default function StatsGrid({ dateRange }) {
  const fromDate = dateRange.from.toISOString().split("T")[0];
  const toDate = dateRange.to.toISOString().split("T")[0];
  const { isPending, error, data } = useQuery({
    queryKey: ["dashboard", "stats", fromDate, toDate],
    queryFn: () => getStats(fromDate, toDate),
    staleTime: 1000 * 60,
  });
  if (isPending) {
    return <LoadingSpinner />;
  }
  if (error) return <p>Error loading stats.</p>;
  const stats = data?.data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Revenue"
        value={`$${stats?.totalRevenue || 0}`}
        change={12.5}
        changeLabel="vs last period"
        icon={DollarSign}
        trend="up"
        color="primary"
        isLoading={isPending}
      />
      <StatCard
        title="Total Orders"
        value={stats?.totalOrders || 0}
        change={8.2}
        changeLabel="vs last period"
        icon={ShoppingBag}
        trend="up"
        color="success"
        isLoading={isPending}
      />
      <StatCard
        title="New Customers"
        value={stats?.numberOfCustomers || 0}
        change={-2.4}
        changeLabel="vs last period"
        icon={Users}
        trend="down"
        color="warning"
        isLoading={isPending}
      />
      <StatCard
        title="Avg. Order Value"
        value={`$${stats?.avgOrderValue?.toFixed(2) || 0}`}
        change={5.7}
        changeLabel="vs last period"
        icon={TrendingUp}
        trend="up"
        color="primary"
        isLoading={isPending}
      />
    </div>
  );
}
