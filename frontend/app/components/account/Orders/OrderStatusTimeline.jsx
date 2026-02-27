// Order status configuration with visual states

import { Package, Truck, CheckCircle2, XCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Order Placed",
    icon: Clock,
    description: "Your order has been received",
  },
  PROCESSING: {
    label: "Processing",
    icon: Package,
    description: "We're preparing your items",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    description: "On its way to you",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    description: "Package arrived successfully",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    description: "Order was cancelled",
  },
};

export default function OrderStatusTimeline({ currentStatus }) {
  const statusFlow = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"];

  // If cancelled, show different flow
  if (currentStatus === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 py-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-error shadow-lg shadow-red-500/30 ring-4 ring-red-500/20" />
          <span className="text-xs font-medium text-error">Cancelled</span>
        </div>
        <div className="h-0.5 flex-1 bg-badge rounded-full" />
        <div className="flex flex-col items-center gap-2 opacity-40">
          <div className="w-3 h-3 rounded-full bg-badge" />
          <span className="text-xs text-secondary-text">Placed</span>
        </div>
      </div>
    );
  }

  const currentIndex = statusFlow.indexOf(currentStatus);

  return (
    <div className="flex items-center justify-between py-4 px-2">
      {statusFlow.map((status, index) => {
        const isActive = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const config = STATUS_CONFIG[status];
        const Icon = config.icon;

        return (
          <div
            key={status}
            className="flex items-center flex-1 last:flex-initial"
          >
            {/* Status Node */}
            <div className="flex flex-col items-center gap-2 relative group">
              {/* Glow effect for active */}
              {isActive && (
                <div className="absolute inset-0 bg-(--color-primary) dark:bg-cyan-500 blur-xl opacity-20 rounded-full scale-100" />
              )}

              {/* Dot */}
              <div
                className={`
                  relative w-3 h-3 rounded-full transition-all duration-500
                  ${
                    isActive
                      ? "bg-(--color-primary) dark:bg-cyan-500 shadow-lg shadow-(--color-primary)/40 scale-110"
                      : "bg-badge scale-100"
                  }
                  ${isCurrent ? "ring-4 ring-(--color-primary)/20" : ""}
                `}
              />

              {/* Label */}
              <span
                className={`
                  text-[10px] font-medium uppercase tracking-wider transition-colors duration-300
                  ${isActive ? "text-(--color-primary-text) " : "text-secondary-text"}
                `}
              >
                {config.label}
              </span>

              {/* Tooltip on hover */}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                <span className="text-xs bg-(--color-card) text-(--color-primary-text) px-2 py-1 rounded shadow-lg border border-badge">
                  {config.description}
                </span>
              </div>
            </div>

            {/* Connector Line */}
            {index < statusFlow.length - 1 && (
              <div
                className={`
                  flex-1 h-0.5 mx-2 sm:mx-3 rounded-full transition-all duration-700
                  ${
                    index < currentIndex
                      ? "bg-(--color-primary) shadow-sm"
                      : "bg-badge"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
