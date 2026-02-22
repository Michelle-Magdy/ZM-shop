"use client";
import Sidebar from "../components/account/Sidebar";
import { useAuth } from "../context/AuthenticationProvider";

export default function Layout({ children }) {
  const { user } = useAuth();
  console.log("layout");

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 min-h-screen gap-8 mt-8">
      <aside className="hidden md:block md:col-span-3 lg:col-span-2">
        <Sidebar user={user} />
      </aside>
      <main className="col-span-1 md:col-span-9 lg:col-span-10">
        {children}
      </main>
    </div>
  );
}
