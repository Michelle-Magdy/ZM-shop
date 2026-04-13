import { useMutation, useQueryClient } from "@tanstack/react-query";
import { resolveReport } from "../../../../lib/api/reports.js";
import toast from "react-hot-toast";

export default function ReportActionButtons({ id }) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (action) => resolveReport(id, action),
        onSuccess: (data) => {
            toast.success(data.message || "Report resolved successfully");
            queryClient.invalidateQueries({ queryKey: ["report", id] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to resolve report");
        },
    });

    const handleAction = (action) => {
        mutation.mutate(action);
    };

    return (
        <div className="p-6 border-t border-badge flex justify-end gap-3">
            {/* Dismiss - removes report, no action on review/user */}
            <button
                onClick={() => handleAction("dismiss")}
                disabled={mutation.isPending}
                className="px-4 py-2 rounded-lg border border-badge text-secondary-text hover:bg-badge hover:text-primary-text transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {mutation.isPending && mutation.variables?.action === "dismiss"
                    ? "Processing..."
                    : "Dismiss Report"}
            </button>

            {/* Suspend User - bans the review author */}
            <button
                onClick={() => handleAction("suspend_user")}
                disabled={mutation.isPending}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {mutation.isPending &&
                mutation.variables?.action === "suspend_user"
                    ? "Processing..."
                    : "Suspend User"}
            </button>

            {/* Delete Review - removes the review content */}
            <button
                onClick={() => handleAction("delete_review")}
                disabled={mutation.isPending}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {mutation.isPending &&
                mutation.variables?.action === "delete_review"
                    ? "Processing..."
                    : "Delete Review"}
            </button>
        </div>
    );
}
