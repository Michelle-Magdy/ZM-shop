"use client";
import { useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import useAddToWishlist from "@/lib/hooks/useAddToWishlist";
import useRemoveFromWishlist from "@/lib/hooks/useRemoveFromWishlist";

export default function LikeButton({
    productId,
    slug,
    title,
    coverImage,
    selectedVariant,
}) {
    const wishlist = useSelector((state) => state.wishlist);
    const { handleAddToWishlist } = useAddToWishlist();
    const { handleRemoveFromWishlist } = useRemoveFromWishlist();

    const liked = wishlist.items?.some((item) => item.productId === productId);

    const toggleLike = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (liked) {
            handleRemoveFromWishlist(productId);
        } else {
            handleAddToWishlist({
                productId,
                slug,
                title,
                coverImage,
                variant: selectedVariant
            });
        }
    };

    const cssClass = liked
        ? "bg-white dark:bg-primary rounded-full w-7 h-7 shadow-lg flex justify-center items-center p-1 hover:cursor-pointer absolute top-2 right-2 transition-all duration-300 ease-in-out z-10"
        : "bg-white dark:bg-primary rounded-full w-7 h-7 shadow-lg flex justify-center items-center p-1 hover:cursor-pointer absolute top-2 right-2 lg:-right-10 transition-all duration-300 ease-in-out group-hover:right-2 z-10";

    return (
        <button className={cssClass} onClick={toggleLike}>
            {liked ? (
                <FaHeart className="hover:cursor-pointer text-primary dark:text-white" />
            ) : (
                <FaRegHeart />
            )}
        </button>
    );
}
