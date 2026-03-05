"use client";
import { useState } from "react";
import ReviewDialog from "./ReviewDialogue.jsx";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { FaExclamation } from "react-icons/fa6";
import toast from "react-hot-toast";

export default function AddReview() {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    const handleAddReview = () => {
        if (!isAuthenticated) {
            toast.error("Please login first to review.");
            return;
        }
        setIsOpen(true);
    };

    return (
        <>
            <div className="space-y-2">
                <button
                    onClick={handleAddReview}
                    className="w-full py-3 px-4 bg-(--color-primary) text-(--color-brand-light) rounded-xl font-semibold hover:bg-primary-hover active:scale-95 transition-all duration-200"
                >
                    Write a Review
                </button>
                <p className="text-sm text-gray-500 text-center flex items-center justify-center mt-1">
                    <FaExclamation />
                    Only verified purchasers can submit reviews
                </p>
            </div>
            <ReviewDialog
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
