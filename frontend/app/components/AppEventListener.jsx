"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    syncCart,
    resetLastAction as resetCartLastAction,
} from "@/features/cart/cartSlice";
import {
    syncWishlist,
    resetLastAction as resetWishlistLastAction,
} from "@/features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

export default function AppEventListener() {
    const dispatch = useDispatch();

    // Cart events
    const { lastAction: cartLastAction } = useSelector((state) => state.cart);

    useEffect(() => {
        if (!cartLastAction) return;
        console.log(cartLastAction);
        if (cartLastAction.status === "success") {
            cartLastAction.message && toast.success(cartLastAction.message);
            dispatch(syncCart());
        } else if (cartLastAction.status === "error") {
            cartLastAction.message && toast.error(cartLastAction.message);
        }

        dispatch(resetCartLastAction());
    }, [cartLastAction, dispatch]);

    //wishlist events
    const { lastAction: wishlistLastAction } = useSelector(
        (state) => state.wishlist,
    );

    useEffect(() => {
        if (!wishlistLastAction) return;
        if (wishlistLastAction.status === "success") {
            wishlistLastAction.message &&
                toast.success(wishlistLastAction.message);
            dispatch(syncWishlist());
        } else if (wishlistLastAction.status === "error") {
            wishlistLastAction.message &&
                toast.error(wishlistLastAction.message);
        }

        dispatch(resetWishlistLastAction());
    }, [dispatch, wishlistLastAction]);

    return null;
}
