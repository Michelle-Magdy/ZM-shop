"use client";

import { getOrderStats } from "@/lib/api/orders";
import { useQuery } from "@tanstack/react-query";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

export default function OrderStats({ user }) {
  const { data, isError, isFetching, error, isSuccess } = useQuery({
    queryKey: ["orders", user?.id, "stats"],
    queryFn: getOrderStats,
    enabled: !!user?.id, // Only run query if user exists
    staleTime: 1000 * 60 * 5,
  });

  if (isError) {
    console.log("error", error);

    return (
      <main className="min-h-screen p-4">
        <div className="text-red-500 text-center">
          Error loading Orders: {error?.message || "Something went wrong"}
        </div>
      </main>
    );
  }

  if (isFetching) {
    return (
      <main className="min-h-screen p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }
  if (isSuccess) console.log(data);

  return (
    <>
      {isSuccess && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Orders",
              value: data?.data?.totalCount,
              icon: Package,
            },
            { label: "In Transit", value: data?.data?.shipped, icon: Truck },
            {
              label: "Delivered",
              value: data?.data?.delivered,
              icon: CheckCircle2,
            },
            { label: "Pending", value: data?.data?.pending, icon: Clock },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-card p-4 rounded-xl border border-badge/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 dark:shadow  dark:shadow-white flex items-center justify-center">
                  <stat.icon
                    size={16}
                    className="text-primary dark:text-white"
                  />
                </div>
                <span className="text-2xl font-bold text-primary-text">
                  {stat.value}
                </span>
              </div>
              <p className="text-xs text-secondary-text uppercase tracking-wide font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
