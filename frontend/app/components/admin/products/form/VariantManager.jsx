// src/components/admin/products/form/VariantManager.jsx
"use client";

import { useState, useEffect } from "react";
import { Plus, X, Copy, AlertCircle } from "lucide-react";
import { FormInput } from "./FormInput";
import { FormToggle } from "./FormToggle";

export const VariantManager = ({
  variants,
  onVariantsChange,
  variantDimensions,
  attributeDefinitions,
  basePrice,
  baseStock,
  defaultVariant,
  onDefaultVariantChange,
}) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const isDefaultVariant = (variant) =>
    defaultVariant?.sku && defaultVariant.sku === variant.sku;

  // Force at least one variant if none exists
  useEffect(() => {
    if (variants.length === 0) {
      const newVariant = {
        sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
        attributeValues: {},
        price: basePrice || 0,
        stock: baseStock || 0,
        isActive: true,
      };
      onVariantsChange([newVariant]);
      onDefaultVariantChange?.(newVariant);
    }
  }, []);

  // Generate all possible variant combinations
  const generateVariants = () => {
    const dimensionAttrs = attributeDefinitions.filter((def) =>
      variantDimensions.includes(def.key),
    );

    if (dimensionAttrs.length === 0) return;

    // Get all combinations
    const getCombinations = (attrs, index = 0, current = {}) => {
      if (index === attrs.length) return [current];

      const attr = attrs[index];
      const combinations = [];

      for (const option of attr.options) {
        combinations.push(
          ...getCombinations(attrs, index + 1, {
            ...current,
            [attr.key]: option,
          }),
        );
      }

      return combinations;
    };

    const combinations = getCombinations(dimensionAttrs);

    // Create variants
    const newVariants = combinations.map((combo, index) => {
      const existing = variants.find((v) =>
        Object.entries(combo).every(([k, val]) => v.attributeValues[k] === val),
      );

      if (existing) return existing;

      // Generate SKU
      const skuParts = Object.values(combo).map((v) =>
        String(v).toUpperCase().substring(0, 3),
      );
      const sku = `VAR-${skuParts.join("-")}-${Date.now().toString(36).substr(-4)}`;

      return {
        sku,
        attributeValues: combo,
        price: basePrice || 0,
        stock: baseStock || 0,
        isActive: true,
      };
    });

    onVariantsChange(newVariants);
    // Set first generated variant as default if no default exists
    if (!defaultVariant && newVariants.length > 0) {
      onDefaultVariantChange?.(newVariants[0]);
    }
    setShowGenerator(false);
  };

  const addVariant = () => {
    const newVariant = {
      sku: `SKU-${Date.now().toString(36).toUpperCase()}`,
      attributeValues: {},
      price: basePrice || 0,
      stock: 0,
      isActive: true,
    };
    onVariantsChange([...variants, newVariant]);
    // Set as default if no default exists
    if (!defaultVariant) {
      onDefaultVariantChange?.(newVariant);
    }
  };

  const updateVariant = (index, updates) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], ...updates };
    onVariantsChange(newVariants);
  };

  const removeVariant = (index) => {
    const removed = variants[index];
    const nextVariants = variants.filter((_, i) => i !== index);

    // Prevent removing the last variant
    if (nextVariants.length === 0) {
      return;
    }

    onVariantsChange(nextVariants);

    if (defaultVariant?.sku === removed?.sku) {
      onDefaultVariantChange?.(nextVariants[0] || null);
    }
  };

  const duplicateVariant = (index) => {
    const variant = variants[index];
    const newVariant = {
      ...variant,
      sku: `${variant.sku}-COPY`,
    };
    onVariantsChange([...variants, newVariant]);
  };

  // Auto-generate when dimensions change
  useEffect(() => {
    if (variantDimensions.length > 0 && variants.length === 0) {
      setShowGenerator(true);
    }
  }, [variantDimensions]);

  // Get dimension attribute options for dropdown
  const getDimensionOptions = (dimKey) => {
    const attr = attributeDefinitions.find((def) => def.key === dimKey);
    return attr?.options || [];
  };

  if (variantDimensions.length === 0) {
    return (
      <div className="bg-(--color-badge)/10 rounded-xl p-6 text-center">
        <AlertCircle
          className="mx-auto mb-2 text-(--color-secondary-text)"
          size={32}
        />
        <p className="text-(--color-secondary-text)">
          Select "Used for Variants" on attributes to enable variant management
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-(--color-primary-text)">
            Product Variants
          </label>
          <p className="text-xs text-(--color-secondary-text)">
            {variants.length} variant{variants.length !== 1 ? "s" : ""}{" "}
            configured
          </p>
        </div>
        <div className="flex gap-2">
          {showGenerator ? (
            <button
              type="button"
              onClick={generateVariants}
              className="px-3 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-medium hover:bg-(--color-primary-hover) transition-colors"
            >
              Generate All Combinations
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowGenerator(true)}
              className="px-3 py-2 bg-(--color-card) border border-(--color-badge)/30 text-(--color-primary-text) rounded-lg text-sm hover:border-(--color-primary) transition-colors"
            >
              Auto-Generate
            </button>
          )}
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1.5 px-3 py-2 bg-(--color-primary) text-white rounded-lg text-sm font-medium hover:bg-(--color-primary-hover) transition-colors"
          >
            <Plus size={16} />
            Add Variant
          </button>
        </div>
      </div>

      {/* Variants Table */}
      <div className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-(--color-badge)/20">
              <tr>
                <th className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text)">
                  SKU
                </th>
                {variantDimensions.map((dim) => (
                  <th
                    key={dim}
                    className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text) uppercase"
                  >
                    {dim}
                  </th>
                ))}
                <th className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text)">
                  Price
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text)">
                  Stock
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text)">
                  Active
                </th>
                <th className="px-3 py-2 text-left text-xs font-medium text-(--color-secondary-text)">
                  Default
                </th>
                <th className="px-3 py-2 text-right text-xs font-medium text-(--color-secondary-text)">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--color-badge)/20">
              {variants.map((variant, index) => (
                <tr key={index} className="group">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, { sku: e.target.value })
                      }
                      className="w-full px-2 py-1 bg-(--color-background) border border-(--color-badge)/30 rounded text-sm focus:outline-none focus:border-(--color-primary)"
                    />
                  </td>
                  {variantDimensions.map((dim) => {
                    const options = getDimensionOptions(dim);
                    return (
                      <td key={dim} className="px-3 py-2">
                        {options.length > 0 ? (
                          <select
                            value={variant.attributeValues[dim] || ""}
                            onChange={(e) =>
                              updateVariant(index, {
                                attributeValues: {
                                  ...variant.attributeValues,
                                  [dim]: e.target.value,
                                },
                              })
                            }
                            className="w-full px-2 py-1 bg-(--color-background) border border-(--color-badge)/30 rounded text-sm focus:outline-none focus:border-(--color-primary)"
                          >
                            <option value="">— Select —</option>
                            {options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-sm text-(--color-secondary-text)">
                            {variant.attributeValues[dim] || "-"}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={
                        variant.price === 0
                          ? ""
                          : (variant.price / 100).toFixed(2)
                      }
                      onChange={(e) => {
                        const raw = e.target.value;
                        // Allow empty string and valid decimal input
                        if (raw === "" || /^\d*\.?\d{0,2}$/.test(raw)) {
                          const parsed =
                            raw === "" ? 0 : Math.round(parseFloat(raw) * 100);
                          updateVariant(index, { price: parsed });
                        }
                      }}
                      className="w-24 px-2 py-1 bg-(--color-background) border border-(--color-badge)/30 rounded text-sm focus:outline-none focus:border-(--color-primary)"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, {
                          stock: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-20 px-2 py-1 bg-(--color-background) border border-(--color-badge)/30 rounded text-sm focus:outline-none focus:border-(--color-primary)"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      checked={!!variant.isActive}
                      onChange={(e) =>
                        updateVariant(index, { isActive: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-(--color-badge) text-(--color-primary) focus:ring-(--color-primary)"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={!!isDefaultVariant(variant)}
                      onChange={() => onDefaultVariantChange?.(variant)}
                      className="w-4 h-4 text-(--color-primary) focus:ring-(--color-primary)"
                      title="Set as default variant"
                    />
                  </td>
                  <td className="px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => duplicateVariant(index)}
                        className="p-1.5 hover:bg-(--color-badge)/30 rounded-lg text-(--color-secondary-text)"
                        title="Duplicate"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-1.5 hover:bg-red-500/20 rounded-lg text-(--color-secondary-text) hover:text-(--color-error)"
                        title="Remove"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {variants.length === 0 && (
          <div className="p-8 text-center text-(--color-secondary-text)">
            No variants yet. Click "Auto-Generate" or "Add Variant" to create.
          </div>
        )}
      </div>
    </div>
  );
};
