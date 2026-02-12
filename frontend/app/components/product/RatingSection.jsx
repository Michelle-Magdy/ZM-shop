import StarRating from "@/app/UI/StarRating";
import ReviewsSection from "./ReviewsSection";
import AddReview from "./AddReview";

export default function RatingSection({ product }) {
    const {
        average: avgRating,
        count: nReviews,
        distribution,
    } = product.ratingStats;

    const getPercentage = (star) => {
        return distribution?.[star.toString()] || 0;
    };

    return (
        <>
            <div className="mt-8 bg-(--color-card) rounded-2xl p-6 sm:p-8 border border-badge">
                <h2 className="text-2xl font-bold text-(--color-primary-text) mb-6">
                    Product Ratings & Reviews
                </h2>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Left Column - Ratings Summary */}
                    <div className="w-full lg:w-1/3 space-y-6">
                        {/* Big Rating Display */}
                        <div className="text-center p-6 bg-(--color-background) rounded-xl border border-badge">
                            <div className="text-5xl font-bold text-(--color-primary-text) mb-2">
                                {avgRating?.toFixed(1) || "0.0"}
                            </div>
                            <div className="flex justify-center mb-2">
                                <StarRating rating={avgRating} size="lg" />
                            </div>
                            <p className="text-sm text-secondary-text">
                                Based on {nReviews || 0} reviews
                            </p>
                        </div>

                        {/* Rating Distribution Bars */}
                        <div className="space-y-3">
                            {[5, 4, 3, 2, 1].map((star) => (
                                <div
                                    key={star}
                                    className="flex items-center gap-3"
                                >
                                    <span className="text-sm font-medium text-(--color-primary-text) w-8">
                                        {star} ★
                                    </span>
                                    <div className="flex-1 h-2.5 bg-badge rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-(--color-primary) dark:bg-primary-text rounded-full transition-all duration-500"
                                            style={{
                                                width: `${getPercentage(star)}%`,
                                            }}
                                        />
                                    </div>
                                    <span className="text-sm text-secondary-text w-10 text-right">
                                        {getPercentage(star)}%
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Write Review Button */}
                        <AddReview product={product} />
                    </div>

                    {/* Right Column - Reviews List */}
                    <ReviewsSection productId={product._id} />
                </div>
            </div>
        </>
    );
}
