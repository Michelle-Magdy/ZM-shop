"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { syncCart, resetLastAction } from "@/features/cart/cartSlice";
import toast from "react-hot-toast";

export default function AppEventListener() {
    const dispatch = useDispatch();

    // Cart events
    const { lastAction } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!lastAction) return;

        if (lastAction.status === "success") {
            lastAction.message && toast.success(lastAction.message);
            dispatch(syncCart());
        } else if (lastAction.status === "error") {
            lastAction.message && toast.error(lastAction.message);
        }

        dispatch(resetLastAction());
    }, [lastAction, dispatch]);


    return null;
}
