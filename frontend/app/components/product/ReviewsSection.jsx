import { getProductReviews } from "@/lib/api/products";
import ReviewCard from "./ReviewCard";

export default async function ReviewsSection({ productId }) {
    const reviews = await getProductReviews(productId);
    return (
        <>
            <div className="w-full lg:w-2/3">
                {reviews.data.length === 0 ? (
                    <div className="text-center py-12 text-secondary-text">
                        <p className="text-lg">No reviews yet</p>
                        <p className="text-sm mt-1">
                            Be the first to review this product
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reviews.data.map((review) => (
                            <ReviewCard
                                key={review._id || review.id}
                                review={review}
                            />
                        ))}

                        {/* Load More */}
                        {reviews.data.length > 5 && (
                            <button className="w-full py-3 text-(--color-primary) font-semibold hover:underline">
                                Load more reviews
                            </button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
