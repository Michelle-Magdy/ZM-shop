"use client";

import { FaPhone } from "react-icons/fa";

export default function PhoneInput({ value, onChange, error }) {
    return (
        <div className="relative">
            <input
                type="tel"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Enter your phone number"
                className={`w-full p-4 pl-12 rounded-xl border-2 bg-(--color-card)
                    focus:border-(--color-primary) focus:outline-none transition-colors
                    text-(--color-primary-text) placeholder:text-secondary-text
                    ${error ? "border-red-500" : "border-badge"}`}
            />
            <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-text" />
        </div>
    );
}
