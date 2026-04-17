// src/components/admin/products/form/FormInput.jsx
"use client";

import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  placeholder,
  min,
  max,
  step,
  disabled = false,
  hint,
  prefix,
  suffix,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-(--color-primary-text)">
        {label}
        {required && <span className="text-(--color-error) ml-1">*</span>}
      </label>

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--color-secondary-text)">
            {prefix}
          </span>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-(--color-card) border rounded-lg text-(--color-primary-text) placeholder:text-(--color-secondary-text) focus:outline-none focus:border-(--color-primary) transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-(--color-error)" : "border-(--color-badge)/30"
          } ${prefix ? "pl-10" : ""} ${suffix || type === "password" ? "pr-10" : ""}`}
        />

        {type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-secondary-text) hover:text-(--color-primary-text)"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {suffix && type !== "password" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-secondary-text)">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-sm text-(--color-error)">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {hint && !error && (
        <p className="text-xs text-(--color-secondary-text)">{hint}</p>
      )}
    </div>
  );
};
