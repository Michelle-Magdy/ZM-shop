// SearchPopover.jsx
"use client";

import { useRef, useEffect } from "react";
import Style from "@/app/UI/Animation.module.css";
import ProductSearchItem from "../components/home/ProductSearchItem";

export default function SearchPopover({
    isOpen,
    onClose,
    query,
    onSelect,
    results,
    isLoading,
    isError,
}) {
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className={`absolute top-full left-0 right-0 mt-2 z-50 ${Style.fadeTopDown}`}
        >
            <div className="bg-background border border-gray-200 dark:border-primary rounded-lg z-50 max-h-80 overflow-auto">
                {isLoading && (
                    <div className="px-4 py-3 text-gray-500">Loading...</div>
                )}

                {isError && (
                    <div className="px-4 py-3 text-red-500">
                        Error loading results
                    </div>
                )}

                {!isLoading && !isError && results?.data.length > 0
                    ? results.data.map((product, i) => (
                          <ProductSearchItem
                              product={product}
                              key={product._id}
                          />
                      ))
                    : !isLoading &&
                      !isError &&
                      query.length >= 3 && (
                          <div className="px-4 py-3 text-gray-500">
                              No products found
                          </div>
                      )}

                {query.length < 3 && (
                    <div className="px-4 py-3 text-gray-400">
                        Type at least 3 characters...
                    </div>
                )}

                {!isLoading && !isError && query.length >= 3 && (
                    <div className="px-4 py-2 text-center text-md text-black dark:text-primary-text border-t border-gray-100 dark:border-primary bg-gray-50 dark:bg-card">
                        The result search for &quot;{query}&quot;
                        <span className="text-xs ml-2 block md:inline">
                            ({results?.data?.length || 0} results have been
                            found.)
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
