"use client";
import { StatCard } from "../StateCard.jsx";
import { Package, Truck, CheckCircle2, Clock, Ban } from "lucide-react";

export default function OrdersStatsGrid({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title={"Total Orders"}
                value={stats.totalOrders}
                description={`${stats.delivered} completed`}
                icon={Package}
            />
            <StatCard
                title={"Pending Orders"}
                value={stats.pending}
                change={null}
                changeLabel={null}
                icon={Clock}
            />
            <StatCard
                title={"Shipped Orders"}
                value={stats.shipped}
                change={null}
                changeLabel={null}
                icon={Truck}
            />
            <StatCard
                title={"Cancelled Orders"}
                value={stats.cancelled}
                change={null}
                changeLabel={null}
                icon={Ban}
            />
        </div>
    );
}
