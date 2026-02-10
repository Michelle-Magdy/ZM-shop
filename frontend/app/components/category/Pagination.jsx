"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages, baseUrl }) {
  const searchParams = useSearchParams();

  const createPageUrl = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...", totalPages);
      }
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2 mt-8">
      {/* Previous */}
      {currentPage > 1 && (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 border border-primary rounded hover:bg-gray-100 dark:hover:bg-badge "
        >
          ← Prev
        </Link>
      )}

      {/* Page Numbers */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <span key={idx} className="px-2">
            ...
          </span>
        ) : (
          <Link
            key={idx}
            href={createPageUrl(page)}
            className={`px-4 py-2 border border-primary rounded dark:hover:bg-badge ${
              currentPage === page
                ? "bg-primary text-white"
                : "hover:bg-gray-100"
            }`}
          >
            {page}
          </Link>
        ),
      )}

      {/* Next */}
      {currentPage < totalPages && (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 border border-primary dark:hover:bg-badge  rounded hover:bg-gray-100"
        >
          Next →
        </Link>
      )}
    </nav>
  );
}
