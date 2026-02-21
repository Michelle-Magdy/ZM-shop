"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";
import { RxCross1 } from "react-icons/rx";
import { FaCheck, FaStar } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { addReview } from "@/lib/api/reviews";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function ReviewDialog({ product, isOpen, onClose }) {
    const queryClient = useQueryClient();
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (data) => addReview(product._id, data),
    });

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");

    const ratingLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (rating === 0) {
            toast.error("Please leave a rating");
            return;
        }

        const data = {
            rating,
            title,
            description: review,
        };

        await toast
            .promise(mutateAsync(data), {
                loading: "Adding review...",
                success: "Review added!",
                error: (err) => err.response?.data?.message || "Failed to add review",
            })
            .then(() => {
                setRating(0);
                setHoverRating(0);
                setTitle("");
                setReview("");
                queryClient.invalidateQueries({
                    queryKey: ["product-reviews", product._id]
                })
                onClose();
            });
    };
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#121212]/60 backdrop-blur-sm md:scale-110"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-105 max-h-[85vh] bg-(--color-card) rounded-xl shadow-2xl overflow-hidden flex flex-col">
                <form onSubmit={handleSubmit}>
                    {/* Compact Header */}
                    <div className="relative bg-(--color-primary) p-4 text-(--color-brand-light) shrink-0">
                        <button
                            onClick={onClose}
                            className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <RxCross1 />
                        </button>

                        <div className="flex items-center gap-3 pr-6">
                            <div className="relative shrink-0">
                                <div className="w-14 h-14 rounded-lg overflow-hidden ring-2 ring-white/20">
                                    <Image
                                        src={`${PRODUCT_IMAGE_URL}/products/${product.coverImage}`}
                                        alt={product.title}
                                        fill
                                        className="w-full h-full object-cover"
                                        unoptimized
                                        sizes="56px"
                                    />
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-brand-dark text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                                    <FaCheck />
                                </div>
                            </div>
                            <div className="min-w-0">
                                <h2 className="text-base font-bold leading-tight mt-0.5 text-white truncate">
                                    {product.title}
                                </h2>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Form Content */}
                    <div className="p-5 space-y-5 overflow-y-auto">
                        {/* Rating Section */}
                        <div className="space-y-2">
                            <label className="block text-xs font-semibold uppercase tracking-wide text-secondary-text">
                                Rate this product
                            </label>
                            <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() =>
                                            setHoverRating(star)
                                        }
                                        onMouseLeave={() => setHoverRating(0)}
                                        aria-label={`Rate ${star} stars`}
                                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                                    >
                                        <FaStar
                                            className={`transition-colors duration-150 ${
                                                star <= (hoverRating || rating)
                                                    ? "text-amber-400"
                                                    : "text-badge"
                                            }`}
                                        />
                                    </button>
                                ))}
                                <span className="ml-2 text-xs font-medium text-secondary-text">
                                    {rating > 0 && ratingLabels[rating - 1]}
                                </span>
                            </div>
                        </div>

                        {/* Title Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wide text-secondary-text">
                                Headline
                            </label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What's most important to know?"
                                className="w-full px-3 py-2.5 rounded-lg border border-badge bg-transparent text-sm text-(--color-primary-text) placeholder:text-secondary-text/60 transition-all duration-200 focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary)"
                                required={true}
                            />
                        </div>

                        {/* Review Text Area */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold uppercase tracking-wide text-secondary-text">
                                Review
                            </label>
                            <div className="relative">
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    placeholder="What did you like or dislike? How was the quality?"
                                    rows={3}
                                    className="w-full px-3 py-2.5 pr-10 rounded-lg border border-badge bg-transparent text-sm text-(--color-primary-text) placeholder:text-secondary-text/60 transition-all duration-200 focus:outline-none focus:border-(--color-primary) focus:ring-1 focus:ring-(--color-primary) resize-none"
                                />
                            </div>
                            <div className="flex justify-end">
                                <span className="text-[10px] text-secondary-text">
                                    {review.length} chars
                                </span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2.5 pt-1">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-badge text-sm font-medium text-(--color-primary-text) bg-badge/50 transition-colors hover:bg-badge"
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 rounded-lg bg-(--color-primary) text-sm font-medium text-(--color-brand-light) hover:bg-primary-hover transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isPending}
                            >
                                <IoIosSend className="text-lg" />
                                {isPending ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>

                    {/* Subtle Footer */}
                    <div className="px-5 py-3 bg-badge/20 border-t border-badge/50 shrink-0">
                        <p className="text-[10px] text-center text-secondary-text leading-relaxed">
                            Reviews are public and help others make informed
                            decisions
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
