import { useDispatch } from "react-redux";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { addToCart } from "@/features/cart/cartSlice";
import toast from "react-hot-toast";

export default function useAddToCart() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();

    const handleAddToCart = (item) => {
        if (!isAuthenticated) {
            toast.error("Please login first.")
            return;
        }
        dispatch(addToCart(item));
        return true;
    };

    return { handleAddToCart };
}