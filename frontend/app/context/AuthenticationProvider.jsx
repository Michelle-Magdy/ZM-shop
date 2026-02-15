"use client";

import { createContext, useContext, useEffect, useState } from "react";
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

    const isAuthenticated = !!user;

    useEffect(() => {
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
    }, []);

    return (
        <AuthContext.Provider
            value={{ user, setUser, isAuthenticated, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
