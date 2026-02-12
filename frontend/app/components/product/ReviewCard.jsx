import StarRating from "@/app/UI/StarRating";


export default function ReviewCard({ review }) {
    const { userId : user, rating, title, description, date, helpful } = review;
    
    // const handleToggleHelpful = () => {

    // }
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
                <button className="flex items-center gap-2 text-sm text-secondary-text hover:text-(--color-primary-text) transition-colors">
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                    </svg>
                    Helpful ({helpful})
                </button>
                <button className="text-sm text-secondary-text hover:text-(--color-primary-text) transition-colors">
                    Report
                </button>
            </div>
        </div>
    );
}
