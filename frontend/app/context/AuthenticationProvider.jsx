"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getMe } from "@/lib/api/auth";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  isLoading: true,
});

export function AuthenticationProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  const isAuthenticated = !!user;

  useEffect(() => {
    const isAuthRoute =
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/forgot-password" ||
      pathname === "/verify-email" ||
      pathname.startsWith("/reset-password");

    if (isAuthRoute) {
      setIsLoading(false);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const res = await getMe();
        setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
  }, [pathname]);

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
