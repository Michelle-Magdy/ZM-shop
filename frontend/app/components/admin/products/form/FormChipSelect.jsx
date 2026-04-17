// src/components/admin/products/form/FormChipSelect.jsx
"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";

export const FormChipSelect = ({
  label,
  options,
  selected,
  onChange,
  multiple = true,
  placeholder = "Add...",
  creatable = false,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = (value) => {
    if (!value) return;
    if (multiple) {
      if (!selected.includes(value)) {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
    setInputValue("");
  };

  const handleRemove = (value) => {
    onChange(selected.filter((v) => v !== value));
  };

  const availableOptions = options.filter(
    (opt) => !selected.includes(opt.value),
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-(--color-primary-text)">
        {label}
      </label>

      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2">
        {selected.map((value) => {
          const option = options.find((o) => o.value === value);
          return (
            <span
              key={value}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-(--color-primary)/10 text-(--color-primary) rounded-full text-sm"
            >
              {option?.label || value}
              <button
                type="button"
                onClick={() => handleRemove(value)}
                className="hover:text-(--color-error) transition-colors"
              >
                <X size={14} />
              </button>
            </span>
          );
        })}
      </div>

      {/* Add New */}
      <div className="flex gap-2">
        <select
          value=""
          onChange={(e) => handleAdd(e.target.value)}
          className="flex-1 px-3 py-2 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-sm text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
        >
          <option value="">{placeholder}</option>
          {availableOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {creatable && (
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Custom..."
              className="w-32 px-3 py-2 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-sm text-(--color-primary-text) focus:outline-none focus:border-(--color-primary)"
              onKeyPress={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAdd(inputValue))
              }
            />
            <button
              type="button"
              onClick={() => handleAdd(inputValue)}
              disabled={!inputValue}
              className="px-3 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary-hover) disabled:opacity-50 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
