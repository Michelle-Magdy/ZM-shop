"use client";
import { FaUsers } from "react-icons/fa";
import { StatCard } from "../StateCard.jsx";

export default function UsersStatsGrid({ stats }) {
    const newUsersPercent =
        stats.newLastMonth === 0
            ? stats.newThisMonth > 0
                ? 100
                : 0 // or null, or 'N/A'
            : ((stats.newThisMonth - stats.newLastMonth) / stats.newLastMonth) *
              100;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title={"Total Users"}
                value={stats.total}
                change={null}
                changeLabel={null}
                icon={FaUsers}
            />
            <StatCard
                title={"Active Users"}
                value={stats.active}
                change={null}
                changeLabel={null}
                icon={FaUsers}
            />
            <StatCard
                title={"New This Month"}
                value={stats.newThisMonth}
                change={newUsersPercent}
                changeLabel="vs last month"
                trend={
                    newUsersPercent > 0
                        ? "up"
                        : newUsersPercent < 0
                          ? "down"
                          : "neutral"
                }
                icon={FaUsers}
            />
            <StatCard
                title={"Admins"}
                value={stats.admins}
                change={null}
                changeLabel={null}
                icon={FaUsers}
            />
        </div>
    );
}
