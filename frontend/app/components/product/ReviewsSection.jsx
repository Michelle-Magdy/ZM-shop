"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@/lib/api/reviews";
import ReviewCard from "./ReviewCard";
import LoadingSpinner from "@/app/UI/LoadingSpinner";

export default function ReviewsSection({ productId }) {
    const { data: reviews, isLoading } = useQuery({
        queryKey: ["product-reviews", productId],
        queryFn: () => getProductReviews(productId),
    });

    if (isLoading) {
        return (
            <div className="w-full lg:w-2/3 py-12 text-center text-secondary-text">
                <LoadingSpinner text={"Loading reviews..."}/>
            </div>
        );
    }

    if (!reviews?.data?.length) {
        return (
            <div className="w-full lg:w-2/3">
                <div className="text-center py-12 text-secondary-text">
                    <p className="text-lg">No reviews yet</p>
                    <p className="text-sm mt-1">
                        Be the first to review this product
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full lg:w-2/3">
            <div className="space-y-6">
                {reviews.data.map((review) => (
                    <ReviewCard key={review._id || review.id} review={review} />
                ))}

                {reviews.data.length > 5 && (
                    <button className="w-full py-3 text-(--color-primary) font-semibold hover:underline">
                        Load more reviews
                    </button>
                )}
            </div>
        </div>
    );
}
