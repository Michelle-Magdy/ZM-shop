import { useQuery } from "@tanstack/react-query";
import {
  Star,
  User,
  Clock,
  FileText,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  Ban,
  Trash2,
  XCircle,
} from "lucide-react";
import { getReportDetails } from "../../../../lib/api/reports.js";
import { formatDate, formatTimeAgo } from "../../../../lib/util/formatDate.js";
import LoadingSpinner from "../../LoadingSpinner.jsx";
import ReportActionButtons from "./ReportActionButtons.jsx";

// Helper to get action icon and label
const getActionInfo = (action) => {
  switch (action) {
    case "dismiss":
      return {
        icon: XCircle,
        label: "Dismissed",
        color: "text-gray-600 bg-gray-100",
      };
    case "suspend_user":
      return {
        icon: Ban,
        label: "User Suspended",
        color: "text-orange-600 bg-orange-100",
      };
    case "delete_review":
      return {
        icon: Trash2,
        label: "Review Deleted",
        color: "text-red-600 bg-red-100",
      };
    default:
      return {
        icon: CheckCircle2,
        label: "Resolved",
        color: "text-green-600 bg-green-100",
      };
  }
};

export default function ReportDetails({ selectedReportId }) {
  const {
    data: response,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ["report", selectedReportId],
    queryFn: () => getReportDetails(selectedReportId),
    enabled: !!selectedReportId,
    staleTime: Infinity,
  });

  const selectedReport = response?.report;
  const isResolved = selectedReport?.status === "resolved";
  const actionInfo = isResolved ? getActionInfo(selectedReport.action) : null;

  // Empty State
  if (!selectedReportId) {
    return (
      <div className="flex-1 bg-card rounded-xl border border-badge overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-badge/30 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-secondary-text" />
          </div>
          <h3 className="text-xl font-semibold text-primary-text mb-2">
            No report selected
          </h3>
          <p className="text-secondary-text max-w-sm">
            Select a report from the list to view details and take action.
          </p>
        </div>
      </div>
    );
  }

  // Loading State
  if (isFetching) {
    return (
      <div className="flex-1 bg-card rounded-xl border border-badge overflow-hidden flex flex-col items-center justify-center p-8">
        <LoadingSpinner />
        <p className="text-secondary-text">Loading report details...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex-1 bg-card rounded-xl border border-badge overflow-hidden flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <ShieldAlert className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-primary-text mb-2">
          Failed to load report
        </h3>
        <p className="text-secondary-text mb-4 max-w-sm">
          {error.message ||
            "Something went wrong while fetching the report details."}
        </p>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-card rounded-xl border border-badge overflow-hidden">
      {selectedReport ? (
        <div className="h-full flex flex-col">
          {/* Report Header */}
          <div className="p-6 border-b border-badge flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-primary-text capitalize">
                  {selectedReport.reason}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedReport.status === "unread"
                      ? "bg-blue-100 text-blue-700"
                      : selectedReport.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {selectedReport.status}
                </span>
              </div>
              <p className="text-secondary-text text-sm">
                Reported on {formatDate(selectedReport.createdAt)} • Product:{" "}
                {selectedReport.productTitle}
              </p>
            </div>
          </div>

          {/* Report Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Resolved Banner - Only show if resolved */}
            {isResolved && actionInfo && (
              <div
                className={`p-4 rounded-xl border ${actionInfo.color.replace("bg-", "border-")} ${actionInfo.color.replace("text-", "bg-").replace("100", "50")}`}
              >
                <div className="flex items-center gap-3">
                  <actionInfo.icon
                    className={`w-5 h-5 ${actionInfo.color.split(" ")[0]}`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-semibold ${actionInfo.color.split(" ")[0]}`}
                    >
                      {actionInfo.label}
                    </p>
                    <p className="text-sm text-secondary-text">
                      Resolved {formatTimeAgo(selectedReport.resolvedAt)} • by
                      Admin
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Reporter Section */}
            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Reporter
              </h3>
              <div className="flex items-center gap-4 p-4 bg-badge/20 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                  {selectedReport.reporterName?.charAt(0) || "R"}
                </div>
                <div>
                  <p className="font-semibold text-primary-text">
                    {selectedReport.reporterName || "Unknown Reporter"}
                  </p>
                  <p className="text-xs text-secondary-text mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Reported {formatTimeAgo(selectedReport.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {/* Reported Review Section */}
            <div>
              <h3 className="text-lg font-semibold text-primary-text mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Reported Review
              </h3>
              <div className="bg-badge/10 rounded-xl p-5 border border-badge">
                {/* Review Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (selectedReport.reviewId?.rating || 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-gray-200 text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-primary-text">
                      {selectedReport.reviewId?.userId?.name ||
                        selectedReport.reviewAuthorName}
                    </span>
                  </div>
                  <span className="text-sm text-secondary-text">
                    {formatDate(selectedReport.reviewId?.date)}
                  </span>
                </div>

                {/* Review Title */}
                {selectedReport.reviewTitle && (
                  <h4 className="font-medium text-primary-text mb-2">
                    "{selectedReport.reviewTitle}"
                  </h4>
                )}

                {/* Review Content */}
                <div className="bg-card rounded-lg p-4 border border-badge">
                  <p className="text-primary-text leading-relaxed">
                    {selectedReport.reviewId?.description ||
                      "No review content available"}
                  </p>
                </div>

                {/* Product Info */}
                <div className="mt-3 flex items-center gap-2 text-sm text-secondary-text">
                  <AlertCircle className="w-4 h-4" />
                  <span>Product: {selectedReport.productTitle}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Only show if NOT resolved */}
          {!isResolved && <ReportActionButtons id={selectedReport._id} />}
        </div>
      ) : (
        /* Fallback if data is null */
        <div className="h-full flex flex-col items-center justify-center text-center p-8">
          <div className="w-24 h-24 bg-badge/30 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-12 h-12 text-secondary-text" />
          </div>
          <h3 className="text-xl font-semibold text-primary-text mb-2">
            Report not found
          </h3>
          <p className="text-secondary-text max-w-sm">
            The selected report could not be loaded.
          </p>
        </div>
      )}
    </div>
  );
}
