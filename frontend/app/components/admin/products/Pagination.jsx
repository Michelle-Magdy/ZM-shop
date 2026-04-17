// src/components/admin/products/Pagination.jsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, total } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-4 border-t border-(--color-badge)/30">
      <span className="text-sm text-(--color-secondary-text)">
        Showing {(page - 1) * 10 + 1} - {Math.min(page * 10, total)} of {total}{" "}
        products
      </span>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="p-2 rounded-lg border border-(--color-badge)/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-(--color-primary) transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-10 h-10 rounded-lg font-medium transition-colors ${page === num ? "bg-(--color-primary) text-white" : "border border-(--color-badge)/30 hover:border-(--color-primary) text-(--color-primary-text)"}`}
          >
            {num}
          </button>
        ))}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="p-2 rounded-lg border border-(--color-badge)/30 disabled:opacity-50 disabled:cursor-not-allowed hover:border-(--color-primary) transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
