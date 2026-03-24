// src/components/admin/DateRangePicker.tsx
"use client";

import { useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
} from "date-fns";

const PRESETS = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "This Month", type: "month" },
  { label: "This Year", type: "year" },
];

export function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handlePresetClick = (preset) => {
    const to = new Date();
    let from;

    if (preset.type === "month") {
      from = startOfMonth(to);
    } else if (preset.type === "year") {
      from = startOfYear(to);
    } else {
      from = subDays(to, preset.days);
    }

    onChange({
      from,
      to,
      label: preset.label,
    });
    setIsOpen(false);
  };

  const handleCustomDate = (field, dateStr) => {
    const date = new Date(dateStr);
    onChange({
      ...value,
      [field]: date,
      label: "Custom Range",
    });
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-(--color-card) border border-badge/50 rounded-lg text-(--color-primary-text) hover:border-(--color-primary)/50 transition-colors"
      >
        <CalendarIcon size={18} className="text-(--color-primary)" />
        <span className="text-sm font-medium">
          {value.label}: {format(value.from, "MMM d, yyyy")} -{" "}
          {format(value.to, "MMM d, yyyy")}
        </span>
        <ChevronDown size={16} className="text-secondary-text" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-(--color-card) rounded-xl shadow-xl border border-badge/30 z-50 animate-enter">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-(--color-primary-text) mb-3">
                Quick Select
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handlePresetClick(preset)}
                    className="px-3 py-2 text-sm rounded-lg bg-badge/20 text-secondary-text hover:bg-(--color-primary)/10 hover:text-(--color-primary) transition-colors text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="border-t border-badge/30 pt-4">
                <h4 className="text-sm font-semibold text-(--color-primary-text) mb-3">
                  Custom Range
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-secondary-text mb-1 block">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={format(value.from, "yyyy-MM-dd")}
                      onChange={(e) => handleCustomDate("from", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-badge/50 bg-(--color-background) text-(--color-primary-text) text-sm focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-secondary-text mb-1 block">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={format(value.to, "yyyy-MM-dd")}
                      onChange={(e) => handleCustomDate("to", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-badge/50 bg-(--color-background) text-(--color-primary-text) text-sm focus:outline-none focus:border-(--color-primary)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
