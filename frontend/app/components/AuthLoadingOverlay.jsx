"use client";

import { useAuth } from "../context/AuthenticationProvider";
import LoadingSpinner from "../UI/LoadingSpinner";

export default function AuthLoadingOverlay() {
    const { isLoading } = useAuth();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-9999 bg-black/40 flex items-center justify-center">
            <LoadingSpinner size="xl" text="Loading..." white />
        </div>
    );
}
