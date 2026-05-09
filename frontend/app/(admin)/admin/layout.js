"use client";

import { Sidebar } from "@/app/components/admin/Sidebar";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const isAdmin = user?.roles?.includes("admin");

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/");
    }
  }, [isLoading, isAdmin]);

  if (isLoading || !isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-(--color-background)">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}