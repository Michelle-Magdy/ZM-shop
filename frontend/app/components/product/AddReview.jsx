'use client'
import { useState } from "react";
import ReviewDialog from "./ReviewDialogue";
import { useAuth } from "@/app/context/AuthenticationProvider";
import toast from "react-hot-toast";

export default function AddReview({product}) {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuth();
    const handleAddReview = () => {
        if(!isAuthenticated){
            toast.error("Please login first to review.");
            return;
        }
        setIsOpen(true);
    }

    return (
        <>
            <button
                onClick={handleAddReview}
                className="w-full py-3 px-4 bg-(--color-primary) text-(--color-brand-light) rounded-xl font-semibold hover:bg-primary-hover active:scale-95 transition-all duration-200"
            >
                Write a Review
            </button>
            <ReviewDialog isOpen={isOpen} onClose={() => setIsOpen(false)} product={product}/>
        </>
    );
}
