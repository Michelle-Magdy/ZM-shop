"use client";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthenticationProvider } from "../context/AuthenticationProvider";
import { useMemo } from "react";
import { store } from "@/store";
import { Provider as ReduxProvider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Provider({ children }) {
  const queryClient = useMemo(() => new QueryClient(), []);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthenticationProvider>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
            >
              {children}
            </GoogleOAuthProvider>
          </AuthenticationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
