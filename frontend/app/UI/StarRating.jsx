import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

export default function StarRating({ rating, maxStars = 5, size = "sm" }) {
    const clampedRating = Math.max(0, Math.min(rating || 0, maxStars));

    if (!rating) {
        return <div>No Rating</div>;
    }

    const sizeClasses = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-xl",
        xl: "text-2xl",
    };

    const starSize = sizeClasses[size] || sizeClasses.sm;

    return (
        <div className={`flex items-center gap-0.5 ${starSize}`}>
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;

                if (starValue <= clampedRating) {
                    // Full star
                    return <FaStar key={index} className="text-yellow-400" />;
                } else if (starValue - 0.5 <= clampedRating) {
                    // Half star
                    return (
                        <FaStarHalfAlt
                            key={index}
                            className="text-yellow-400"
                        />
                    );
                } else {
                    // Empty star
                    return <FaRegStar key={index} className="text-gray-300" />;
                }
            })}

            <span className="ml-2 text-sm text-gray-600 font-medium">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}
