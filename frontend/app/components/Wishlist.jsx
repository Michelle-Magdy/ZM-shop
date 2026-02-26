"use client";
import Link from "next/link";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { fetchWishlist } from "@/features/wishlist/wishlistSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthenticationProvider";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useTheme } from "next-themes";

export default function Wishlist() {
    const dispatch = useDispatch();
    const { isAuthenticated, user } = useAuth();
    const { loading, items } = useSelector((state) => state.wishlist);
    const { resolvedTheme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Set mounted after client renders
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(fetchWishlist());
    }, [dispatch, isAuthenticated, user?._id]);

    // Only render after mounted to avoid SSR mismatch
    if (!mounted) return null;

    const theme = resolvedTheme || systemTheme || "light";

    return (
        <Link href="/wishlist" className="flex items-center relative mr-1">
            <div className={"relative text-gray-700 dark:text-secondary-text md:text-inherit"}>
                {theme === "dark" ? (
                    <FaRegHeart
                        className="w-6 h-6 md:w-7.5 md:h-7.5 mx-1 md:mx-2 hover:text-primary-hover"
                        title="Wishlist"
                    />
                ) : (
                    <FaHeart
                        className="w-6 h-6 md:w-7.5 md:h-7.5 mx-1 md:mx-2"
                        title="Wishlist"
                    />
                )}

                <span className="absolute -top-1 -right-1 text-sm md:text-base leading-none">
                    {loading ? <LoadingSpinner size="sm" /> : items.length}
                </span>
            </div>
            <span className="md:hidden ml-3">Wishlist</span>
        </Link>
    );
}
