import { useConfirm } from "../../../../lib/hooks/useConfirm.js";
import { deleteReview } from "../../../../lib/api/reviews.js";
import { useState } from "react";
import LoadingSpinner from "../../../UI/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import useProduct from "./ProductContext.js";

export default function ReviewDelete({ reviewId }) {
    const confirm = useConfirm();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const product = useProduct();

    const handleDelete = async () => {
        const confirmed = await confirm("Delete this review permanently?");
        if (!confirmed) return;
        setIsLoading(true);
        try {
            await deleteReview(reviewId);
            toast.success("Review deleted successfully");
            queryClient.invalidateQueries({
                queryKey: ["product-reviews", product._id],
            });
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Failed to delete review",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isLoading}
            className="text-sm text-secondary-text hover:text-(--color-primary-text) transition-colors"
        >
            {isLoading ?"Deleting..." : "Delete"}
        </button>
    );
}
