export default function StarRating({ rating, maxStars = 5 }) {
    // Ensure rating is between 0 and maxStars
    const clampedRating = Math.max(0, Math.min(rating, maxStars));
    if(!rating)
        return <div>No Rating</div>
    return (
        <div className="flex items-center gap-1">
            {[...Array(maxStars)].map((_, index) => {
                const starValue = index + 1;
                const isFilled = starValue <= clampedRating;
                const isPartial = !isFilled && starValue - 0.5 <= clampedRating;

                return (
                    <div key={index} className="relative w-5 h-5">
                        {/* Background star (empty) */}
                        <svg
                            className="absolute inset-0 w-full h-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>

                        {/* Filled star overlay */}
                        <div
                            className="absolute inset-0 overflow-hidden"
                            style={{
                                width: isFilled
                                    ? "100%"
                                    : isPartial
                                      ? "50%"
                                      : "0%",
                            }}
                        >
                            <svg
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    </div>
                );
            })}

            {/* Optional: Show numeric rating */}
            <span className="ml-2 text-sm text-gray-600 font-medium">
                {rating.toFixed(1)}
            </span>
        </div>
    );
}
