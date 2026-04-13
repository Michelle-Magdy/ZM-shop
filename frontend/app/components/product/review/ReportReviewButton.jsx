import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { reportReview } from "../../../../lib/api/reviews.js";

const REPORT_REASONS = ["spam", "inappropriate", "fake", "other"];

export default function ReportReviewButton({ reviewId }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { mutateAsync, isPending } = useMutation({
        mutationFn: (reason) => reportReview(reviewId, reason),
    });

    const handleReport = async (reason) => {
        try {
            await mutateAsync(reason);
            setIsModalOpen(false);
            toast.success("Report sent to admin");
        } catch (error) {
            console.log(error);
            toast.error(
                error.message ||
                    "Failed to send report. Please try again.",
            );
        }
    };

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-secondary-text hover:text-(--color-primary-text) transition-colors"
            >
                Report
            </button>

            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-(--color-card) rounded-lg p-6 w-80 shadow-xl border border-badge"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold mb-4 text-(--color-primary-text)">
                            Report Review
                        </h3>
                        <div className="space-y-2">
                            {REPORT_REASONS.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => handleReport(reason)}
                                    disabled={isPending}
                                    className="w-full text-left px-4 py-3 rounded-md 
                                               bg-badge/30 hover:bg-(--color-primary) 
                                               text-(--color-primary-text) hover:text-button-label
                                               transition-all capitalize font-medium
                                               disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setIsModalOpen(false)}
                            disabled={isPending}
                            className="mt-4 w-full py-3 text-sm font-medium
                                       text-secondary-text hover:text-(--color-primary-text) 
                                       hover:bg-badge/30 rounded-md transition-all
                                       disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Sending report..." : "Cancel"}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
