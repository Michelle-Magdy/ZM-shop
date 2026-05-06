"use client";

export default function PaginationClient({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

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
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1, "...");
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push("...", totalPages);
            }
        }

        return pages;
    };

    return (
        <nav className="flex items-center justify-center gap-2 mt-8">
            {/* Previous */}
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="px-4 py-2 border border-primary rounded disabled:opacity-50"
            >
                ← Prev
            </button>

            {/* Pages */}
            {getPageNumbers().map((page, idx) =>
                page === "..." ? (
                    <span key={idx} className="px-2">
                        ...
                    </span>
                ) : (
                    <button
                        key={idx}
                        onClick={() => onPageChange(page)}
                        className={`px-4 py-2 border border-primary rounded ${
                            currentPage === page
                                ? "bg-primary text-white"
                                : "hover:bg-gray-100"
                        }`}
                    >
                        {page}
                    </button>
                ),
            )}

            {/* Next */}
            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="px-4 py-2 border border-primary rounded disabled:opacity-50"
            >
                Next →
            </button>
        </nav>
    );
}
