"use client";

import { useAuth } from "../context/AuthenticationProvider";
import LoadingSpinner from "../UI/LoadingSpinner";
import Link from "next/link";
import { LuUserRound } from "react-icons/lu";

export default function UserAccount() {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    if (!isAuthenticated)
        return (
            <Link href="/login">
                <LuUserRound
                    className="mr-1 w-7 h-7 md:w-9 md:h-9"
                    alt="User Account"
                />
            </Link>
        );

    return (
        <LuUserRound
            className="mr-1 w-7 h-7 md:w-9 md:h-9"
            alt="User Account"
        />
        
    );
}
