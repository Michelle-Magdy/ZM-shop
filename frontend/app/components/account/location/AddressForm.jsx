import { useState, useEffect } from "react";

export default function AddressForm({
  label,
  isDefault,
  setSelectedLocation,
  onConfirm,
  hideSubmitButton = false,
  errors = {},
  setErrors,
}) {
  // Local state for immediate validation feedback
  const [localErrors, setLocalErrors] = useState({});

  // Sync with parent errors
  useEffect(() => {
    setLocalErrors(errors);
  }, [errors]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setSelectedLocation((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (name === "label" && value.trim()) {
      setLocalErrors((prev) => ({ ...prev, label: undefined }));
      setErrors?.((prev) => ({ ...prev, label: undefined }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "label" && !value.trim()) {
      const error = { label: "Label is required" };
      setLocalErrors((prev) => ({ ...prev, ...error }));
      setErrors?.((prev) => ({ ...prev, ...error }));
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!label?.trim()) {
      const error = { label: "Label is required" };
      setLocalErrors((prev) => ({ ...prev, ...error }));
      setErrors?.((prev) => ({ ...prev, ...error }));
      return;
    }

    setLocalErrors({});
    setErrors?.({});
    onConfirm?.(label, isDefault);
  };

  const displayErrors = { ...localErrors, ...errors };

  return (
    <div className="pt-4 p-6 sm:p-6 px-4 sm:px-6">
      <form
        className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 sm:gap-6"
        noValidate
        onSubmit={submitHandler}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end flex-1 w-full">
          {/* Label Input */}
          <div className="space-y-2 flex-1 w-full sm:max-w-xs">
            <label
              htmlFor="label"
              className="block text-sm font-medium text-primary-text"
            >
              Label
            </label>
            <input
              id="label"
              name="label"
              type="text"
              value={label || ""}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Home, Work, etc."
              className={`w-full px-4 py-3 rounded-lg bg-background border text-primary-text placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
                displayErrors.label
                  ? "border-red-500 focus:ring-0 focus:border-red-500"
                  : "border-border"
              }`}
            />
            {displayErrors.label && (
              <p className="text-red-500 text-sm mt-1">{displayErrors.label}</p>
            )}
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-3 py-3">
            <input
              id="isDefault"
              name="isDefault"
              type="checkbox"
              checked={isDefault || false}
              onChange={handleChange}
              className="h-5 w-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-primary-text cursor-pointer select-none"
            >
              Set as default address
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="shrink-0 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-auto hidden sm:block"
        >
          Confirm Location
        </button>
      </form>

      {displayErrors.lat && (
        <p className="text-red-500 text-sm mt-3">{displayErrors.lat}</p>
      )}
      {displayErrors.lng && (
        <p className="text-red-500 text-sm mt-1">{displayErrors.lng}</p>
      )}
    </div>
  );
}
