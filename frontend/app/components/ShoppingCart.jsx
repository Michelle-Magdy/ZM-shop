"use client";
import { CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import LoadingSpinner from "../UI/LoadingSpinner";
import { useEffect } from "react";
import { fetchCart } from "@/features/cart/cartSlice";
import { useAuth } from "../context/AuthenticationProvider";

export default function ShoppingCart() {
    const dispatch = useDispatch();
    const { loading, items } = useSelector((state) => state.cart);
    const { isAuthenticated, user } = useAuth();

    let itemsNumber = 0;
    if (items?.length > 0) {
        itemsNumber = items.reduce((acc, curr) => acc + curr.quantity, 0);
    }

    useEffect(() => {
        if (!isAuthenticated) return;
        dispatch(fetchCart());
    }, [dispatch, isAuthenticated, user?.id]);

    return (
        <>
            <Link href="/cart" className="flex items-center">
                <CiShoppingCart className="w-9 h-9 md:w-11 md:h-11" />
                <span className="-ml-2 -mt-7.5 md:-ml-2.5 md:-mt-9 text-sm md:text-base">
                    {loading ? <LoadingSpinner size="sm" /> : itemsNumber}
                </span>
            </Link>
        </>
    );
}
