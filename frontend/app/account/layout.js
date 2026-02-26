"use client";
import { useState } from "react";
import Sidebar from "../components/account/Sidebar";
import { useAuth } from "../context/AuthenticationProvider";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      {/* Desktop Layout */}
      <div className="hidden md:grid md:grid-cols-12 gap-8 mt-8 px-4">
        <aside className="md:col-span-4 lg:col-span-3">
          <Sidebar user={user} />
        </aside>
        <main className="md:col-span-8 lg:col-span-9">{children}</main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden">
        <main className="p-4 pb-24">{children}</main>

        {/* Floating Hamburger Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-primary hover:bg-primary/90 
                     text-white rounded-full shadow-lg hover:shadow-xl 
                     flex items-center justify-center transition-all duration-300 
                     hover:scale-110 active:scale-95"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Drawer */}
            <div
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-background shadow-2xl z-50 
                         transform transition-transform duration-300 ease-out
                         animate-in slide-in-from-right"
            >
              {/* Close Button */}
              <div className="flex justify-end p-4 border-b">
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Sidebar Content */}
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                <Sidebar
                  user={user}
                  onNavigate={() => setIsMobileMenuOpen(false)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
