"use client";

import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "@/lib/api/reviews";
import ReviewCard from "./ReviewCard";
import LoadingSpinner from "@/app/UI/LoadingSpinner";
import { useAuth } from "../../../context/AuthenticationProvider.jsx";
import { useMemo, useState } from "react";
import useProduct from "./ProductContext.js";
import PaginationClient from "../../PaginationClient.jsx";

export default function ReviewsSection() {
    const product = useProduct();
    const [page, setPage] = useState(1);

    const { data: reviews, isLoading } = useQuery({
        queryKey: ["product-reviews", product._id, page],
        queryFn: () => getProductReviews(product._id, page),
    });
    const { isAuthenticated, user } = useAuth();

    const sortedReviews = useMemo(() => {
        if (!reviews?.data) return [];

        if (!isAuthenticated || !user?.id) {
            return [...reviews.data].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            );
        }

        return [...reviews.data].sort((a, b) => {
            const isUserA = a.userId._id.toString() === user.id.toString();
            const isUserB = b.userId._id.toString() === user.id.toString();

            if (isUserA === isUserB) {
                return new Date(b.createdAt) - new Date(a.createdAt);
            }

            return isUserA ? -1 : 1;
        });
    }, [reviews?.data, user?.id, isAuthenticated]);

    if (isLoading) {
        return (
            <div className="w-full lg:w-2/3 py-12 text-center text-secondary-text">
                <LoadingSpinner text={"Loading reviews..."} />
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

    console.log(sortedReviews);

    return (
        <div className="w-full lg:w-2/3">
            <div className="space-y-6">
                {sortedReviews.map((review) => (
                    <ReviewCard
                        key={review._id || review.id}
                        review={review}
                        isUserReview={
                            review.userId && 
                            review.userId?._id.toString() ===
                            user?.id?.toString()
                        }
                    />
                ))}

                <PaginationClient
                    currentPage={reviews?.currentPage}
                    totalPages={reviews?.totalPages}
                    onPageChange={(page) => setPage(page)}
                />
            </div>
        </div>
    );
}
