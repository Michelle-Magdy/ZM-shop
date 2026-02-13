// components/LoadingSpinner.jsx
"use client";

import React from "react";

const sizeClasses = {
    sm: "w-5 h-5 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-3",
    xl: "w-16 h-16 border-4",
};

export default function LoadingSpinner({ size = "md", className = "", text }) {
    return (
        <div
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
        >
            <div
                className={`
          ${sizeClasses[size]}
          rounded-full
          animate-spin
        `}
                style={{
                    border: "2px solid var(--color-badge)",
                    borderTopColor: "var(--color-primary)",
                }}
            />
            {text && (
                <span
                    className="text-sm font-medium"
                    style={{ color: "var(--color-secondary-text)" }}
                >
                    {text}
                </span>
            )}
        </div>
    );
}
