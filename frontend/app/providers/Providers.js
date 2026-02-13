"use client";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationProvider } from "../context/AuthenticationProvider";
import { useMemo } from "react";

export function Provider({ children }) {
  const queryClient = useMemo(() => new QueryClient(), []); 
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthenticationProvider>
          {children}
        </AuthenticationProvider>
      </ThemeProvider>
    </QueryClientProvider>

  );
}
