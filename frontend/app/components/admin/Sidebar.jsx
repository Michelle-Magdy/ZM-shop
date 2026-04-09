// src/components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  ShoppingCart,
  Truck,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthenticationProvider";
// import { cn } from "@/lib/utils";
import { logout } from "@/lib/api/auth";
const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/vendors",
    label: "Vendors",
    icon: Store,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/deliveries",
    label: "Deliveries",
    icon: Truck,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  function onLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-(--color-primary) text-button-label flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight text-(--color-brand-light)">
          ZM shop
        </h1>
        <p className="text-xs text-link mt-1">E-Commerce Management</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-white/15 text-(--color-brand-light) font-medium shadow-lg"
                  : "text-link hover:bg-white/10 hover:text-(--color-link-hover)"
              }`}
            >
              <Icon
                size={20}
                className={`
                  transition-transform duration-200 ${isActive ? "scale-110" : "group-hover:scale-105"}`}
              />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={16} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/5">
          <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-(--color-brand-light) truncate">
              {user?.name || ""}
            </p>
            <p className="text-xs text-link truncate">{user?.email || ""}</p>
          </div>
        </div>

        <button
          className="flex items-center gap-3 px-4 py-3 mt-2 w-full rounded-lg text-link hover:bg-white/10 hover:text-error transition-all duration-200"
          onClick={onLogout}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
