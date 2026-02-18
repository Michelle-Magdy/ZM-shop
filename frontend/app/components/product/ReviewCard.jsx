import { useAuth } from "@/app/context/AuthenticationProvider";
import StarRating from "@/app/UI/StarRating";
import { handleHelpfulReview } from "@/lib/api/reviews";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { getDisplayedHelpfulCount } from "@/util/ReviewHelper";
import toast from "react-hot-toast";

export default function ReviewCard({ review }) {
    const { userId: user, rating, title, description, date, helpful } = review;
    const { user: currentUser, isAuthenticated } = useAuth();

    const [isHelpful, setIsHelpful] = useState(false);

    const { mutate } = useMutation({
        mutationFn: () => handleHelpfulReview(review._id),
        onError: () => {
            setIsHelpful((prev) => !prev);
            toast.error("Failed to update. Try again.");
        },
    });

    const handleToggleHelpful = () => {
        if (!isAuthenticated) {
            toast.error("Please login first before giving any feedback.");
            return;
        }
        setIsHelpful((prev) => !prev);
        mutate();
    };

    useEffect(() => {
        if (currentUser) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsHelpful(helpful.includes(currentUser.id));
        }
    }, [currentUser, helpful]);

    const helpfulLength = getDisplayedHelpfulCount(
        helpful,
        currentUser,
        isHelpful,
    );

    return (
        <div className="border-b border-badge last:border-0 pb-6 last:pb-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-brand-light) font-bold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div>
                        <p className="font-semibold text-(--color-primary-text)">
                            {user?.name || "Anonymous"}
                        </p>
                        <p className="text-xs text-secondary-text">
                            {new Date(date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>
                <StarRating rating={rating} size="sm" />
            </div>

            {/* Review Content */}
            <div className="space-y-2">
                {title && (
                    <h4 className="font-bold text-(--color-primary-text)">
                        {title}
                    </h4>
                )}
                <p className="text-secondary-text leading-relaxed">
                    {description}
                </p>
            </div>

            {/* Helpful & Actions */}
            <div className="flex items-center gap-4 mt-4">
                <button
                    onClick={handleToggleHelpful}
                    className={`flex items-center gap-2 text-sm transition-colors
    ${
        isHelpful
            ? "text-(--color-primary-text)"
            : "text-secondary-text hover:text-(--color-primary-text)"
    }
  `}
                >
                    {isHelpful ? (
                        <FaThumbsUp className="w-4 h-4" />
                    ) : (
                        <FaRegThumbsUp className="w-4 h-4" />
                    )}
                    Helpful ({helpfulLength})
                </button>
                <button className="text-sm text-secondary-text hover:text-(--color-primary-text) transition-colors">
                    Report
                </button>
            </div>
        </div>
    );
}
