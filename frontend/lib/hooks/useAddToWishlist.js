import { useDispatch } from "react-redux";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { addToWishlist } from "@/features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

export default function useAddToWishlist() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const handleAddToWishlist = (item) => {
        if (!isAuthenticated) {
            toast.error("Please login first.")
            return;
        }
        dispatch(addToWishlist(item));
        return true;
    };

    return { handleAddToWishlist };
}

