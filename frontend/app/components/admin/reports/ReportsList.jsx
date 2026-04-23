// ReportsList.jsx
import { useQuery } from "@tanstack/react-query";
import ReportsFilter from "./ReportsFilter.jsx";
import { useState } from "react";
import { getReports } from "../../../../lib/api/reports.js";
import { formatTimeAgo } from "../../../../lib/util/formatDate.js";
import { AlertCircle, Loader2, FileX } from "lucide-react";
import LoadingSpinner from "../../LoadingSpinner.jsx";

function getStatusColor(status) {
  switch (status) {
    case "unread":
      return "bg-brand-dark";
    case "viewed":
      return "bg-secondary-text";
    case "resolved":
      return "bg-green-500";
    default:
      return "bg-secondary-text";
  }
}

export default function ReportsList({ selectedReportId, onChange }) {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("unread");
  const { data, isPending, error } = useQuery({
    queryKey: ["reports", page, status],
    queryFn: () => getReports(page, status),
  });

  // Loading State
  if (isPending) {
    return (
      <div className="w-[45%] bg-card rounded-xl border border-badge flex flex-col overflow-hidden">
        <ReportsFilter status={status} onStatusChange={setStatus} />
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <LoadingSpinner />
          <p className="text-secondary-text">Loading reports...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="w-[45%] bg-card rounded-xl border border-badge flex flex-col overflow-hidden">
        <ReportsFilter status={status} onStatusChange={setStatus} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-primary-text mb-2">
            Failed to load reports
          </h3>
          <p className="text-secondary-text text-sm mb-4 max-w-xs">
            {error.message || "Something went wrong while fetching reports."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!data?.reports?.documents?.length) {
    return (
      <div className="w-[45%] bg-card rounded-xl border border-badge flex flex-col overflow-hidden">
        <ReportsFilter status={status} onStatusChange={setStatus} />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-badge/30 rounded-full flex items-center justify-center mb-4">
            <FileX className="w-8 h-8 text-secondary-text" />
          </div>
          <h3 className="text-lg font-semibold text-primary-text mb-2">
            No reports found
          </h3>
          <p className="text-secondary-text text-sm">
            There are no {status !== "all" ? status : ""} reports at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[45%] bg-card rounded-xl border border-badge flex flex-col overflow-hidden">
      {/* Tabs */}
      <ReportsFilter status={status} onStatusChange={setStatus} />

      {/* Report List */}
      <div className="flex-1 overflow-y-auto">
        {data?.reports.documents.map((report) => (
          <div
            key={report._id}
            onClick={() => onChange(report._id)}
            className={`p-4 border-b border-badge cursor-pointer transition-all duration-200 group ${
              selectedReportId === report._id
                ? "bg-primary/5 border-l-4 border-l-primary"
                : "hover:bg-badge/30 border-l-4 border-l-transparent"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-2 h-2 rounded-full mt-2 shrink-0 ${getStatusColor(
                  report.status,
                )}`}
              />
              <div className="flex-1 min-w-0">
                {/* Show product title as main heading */}
                <h3
                  className={`font-semibold text-primary-text mb-1 truncate ${
                    report.status === "unread" ? "font-bold" : ""
                  }`}
                >
                  {report.productTitle}
                </h3>

                {/* Show reason as subtitle */}
                <p className="text-sm text-secondary-text mb-1">
                  Reason: <span className="capitalize">{report.reason}</span>
                </p>

                {/* Show review info */}
                <p className="text-sm text-secondary-text line-clamp-2 mb-2">
                  Review: "{report.reviewTitle}" by {report.reviewAuthorName}
                </p>

                <span className="text-xs text-secondary-text">
                  {formatTimeAgo(report.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-badge flex items-center justify-between">
        <span className="text-sm text-secondary-text">
          {(data.reports.currentPage - 1) * data.reports.limit + 1}–
          {Math.min(
            data.reports.currentPage * data.reports.limit,
            data.reports.totalCount,
          )}{" "}
          of {data.reports.totalCount}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={data.reports.currentPage === 1}
            className="p-2 rounded-lg border border-badge disabled:opacity-40 disabled:cursor-not-allowed hover:bg-badge transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              setPage((p) => Math.min(data.reports.totalPages, p + 1))
            }
            disabled={data.reports.currentPage === data.reports.totalPages}
            className="p-2 rounded-lg border border-badge disabled:opacity-40 disabled:cursor-not-allowed hover:bg-badge transition-colors"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
