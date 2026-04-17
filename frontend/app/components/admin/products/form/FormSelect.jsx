// src/components/admin/products/form/FormSelect.jsx
"use client";

import { AlertCircle, ChevronDown } from "lucide-react";

export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  placeholder = "Select...",
  disabled = false,
  hint,
  multiple = false,
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-(--color-primary-text)">
        {label}
        {required && <span className="text-(--color-error) ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          multiple={multiple}
          disabled={disabled}
          className={`w-full px-4 py-2.5 bg-(--color-card) border rounded-lg text-(--color-primary-text) focus:outline-none focus:border-(--color-primary) transition-colors appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
            error ? "border-(--color-error)" : "border-(--color-badge)/30"
          } ${multiple ? "min-h-[120px]" : ""}`}
        >
          {!multiple && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {!multiple && (
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--color-secondary-text) pointer-events-none"
            size={18}
          />
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
