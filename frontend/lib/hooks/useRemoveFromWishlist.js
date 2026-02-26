import { useDispatch } from "react-redux";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { removeFromWishlist } from "@/features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

export default function useRemoveFromWishlist() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const handleRemoveFromWishlist = (productId) => {
        if (!isAuthenticated) {
            toast.error("Please login first.");
            return;
        }
        dispatch(removeFromWishlist(productId));
        return true;
    };

    return { handleRemoveFromWishlist };
}