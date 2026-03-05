"use client";

import React from "react";

const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
    xl: "w-16 h-16 border-4",
};

export default function LoadingSpinner({
    size = "md",
    className = "",
    text,
    white = false,
}) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
        >
            <div
                className={`${sizeClasses[size]} rounded-full animate-spin 
                    ${
                        white
                            ? "border-white/20 border-t-white"
                            : "border-gray-300 border-t-primary dark:border-gray-600 dark:border-t-white"
                    }`}
            />
            {text && (
                <span
                    className={`text-sm font-medium ${
                        white
                            ? "text-white"
                            : "text-gray-600 dark:text-gray-300"
                    }`}
                >
                    {text}
                </span>
            )}
        </div>
    );
}
