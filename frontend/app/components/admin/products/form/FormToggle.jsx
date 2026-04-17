// src/components/admin/products/form/FormToggle.jsx
"use client";

export const FormToggle = ({
  label,
  name,
  checked,
  onChange,
  disabled = false,
  hint,
}) => {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange({ target: { name, value: !checked } })}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-2 focus:ring-offset-(--color-background) disabled:opacity-50 ${
          checked ? "bg-(--color-primary)" : "bg-(--color-badge)"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>

      <div className="flex-1">
        <label
          className="block text-sm font-medium text-(--color-primary-text) cursor-pointer"
          onClick={() => onChange({ target: { name, value: !checked } })}
        >
          {label}
        </label>
        {hint && (
          <p className="text-xs text-(--color-secondary-text) mt-0.5">{hint}</p>
        )}
      </div>
    </div>
  );
};
