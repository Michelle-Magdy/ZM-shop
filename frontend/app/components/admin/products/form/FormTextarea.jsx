// src/components/admin/products/form/FormTextarea.jsx
"use client";

import { AlertCircle } from "lucide-react";

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  placeholder,
  rows = 4,
  maxLength,
  disabled = false,
  hint,
}) => {
  const charCount = value?.length || 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-(--color-primary-text)">
          {label}
          {required && <span className="text-(--color-error) ml-1">*</span>}
        </label>
        {maxLength && (
          <span
            className={`text-xs ${charCount > maxLength ? "text-(--color-error)" : "text-(--color-secondary-text)"}`}
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        maxLength={maxLength}
        disabled={disabled}
        className={`w-full px-4 py-2.5 bg-(--color-card) border rounded-lg text-(--color-primary-text) placeholder:text-(--color-secondary-text) focus:outline-none focus:border-(--color-primary) transition-colors resize-none disabled:opacity-50 ${
          error ? "border-(--color-error)" : "border-(--color-badge)/30"
        }`}
      />

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
