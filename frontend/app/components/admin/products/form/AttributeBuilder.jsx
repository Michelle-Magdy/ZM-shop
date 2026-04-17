// src/components/admin/products/form/AttributeBuilder.jsx
"use client";

import { useState } from "react";
import { Plus, X, GripVertical, Settings } from "lucide-react";
import { FormSelect } from "./FormSelect";
import { FormInput } from "./FormInput";
import { FormToggle } from "./FormToggle";

const ATTRIBUTE_TYPES = [
  { value: "string", label: "Text" },
  { value: "number", label: "Number" },
  { value: "boolean", label: "Yes/No" },
  { value: "select", label: "Dropdown" },
  { value: "color", label: "Color" },
  { value: "date", label: "Date" },
  { value: "range", label: "Range" },
];

export const AttributeBuilder = ({
  definitions,
  onDefinitionsChange,
  attributes,
  onAttributesChange,
  variantDimensions,
  onVariantDimensionsChange,
}) => {
  const [expandedDef, setExpandedDef] = useState(null);

  const addDefinition = () => {
    const newDef = {
      key: "",
      type: "string",
      options: [],
      unit: "",
      isFilterable: false,
      isvariantDimensions: false,
      isRequired: false,
      displayName: "",
    };
    onDefinitionsChange([...definitions, newDef]);
    setExpandedDef(definitions.length);
  };

  const updateDefinition = (index, updates) => {
    const newDefs = [...definitions];
    newDefs[index] = { ...newDefs[index], ...updates };
    onDefinitionsChange(newDefs);
  };

  const removeDefinition = (index) => {
    const removed = definitions[index];
    onDefinitionsChange(definitions.filter((_, i) => i !== index));

    // Remove from variant dimensions if present
    if (variantDimensions.includes(removed.key)) {
      onVariantDimensionsChange(
        variantDimensions.filter((k) => k !== removed.key),
      );
    }

    // Remove attribute value
    onAttributesChange(attributes.filter((a) => a.key !== removed.key));
  };

  const toggleVariantDimension = (key) => {
    if (variantDimensions.includes(key)) {
      onVariantDimensionsChange(variantDimensions.filter((k) => k !== key));
    } else {
      onVariantDimensionsChange([...variantDimensions, key]);
    }
  };

  const updateAttributeValue = (key, value, displayValue) => {
    const existing = attributes.find((a) => a.key === key);
    if (existing) {
      onAttributesChange(
        attributes.map((a) =>
          a.key === key ? { ...a, value, displayValue } : a,
        ),
      );
    } else {
      onAttributesChange([...attributes, { key, value, displayValue }]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-(--color-primary-text)">
          Product Attributes
        </label>
        <button
          type="button"
          onClick={addDefinition}
          className="flex items-center gap-1.5 text-sm text-(--color-primary) hover:text-(--color-primary-hover) font-medium"
        >
          <Plus size={16} />
          Add Attribute
        </button>
      </div>

      {/* Definitions List */}
      <div className="space-y-3">
        {definitions.map((def, index) => (
          <div
            key={index}
            className="bg-(--color-card) border border-(--color-badge)/30 rounded-xl overflow-hidden"
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 p-3 cursor-pointer hover:bg-(--color-badge)/10 transition-colors"
              onClick={() =>
                setExpandedDef(expandedDef === index ? null : index)
              }
            >
              <GripVertical
                size={18}
                className="text-(--color-secondary-text)"
              />

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-(--color-primary-text)">
                    {def.displayName || def.key || "New Attribute"}
                  </span>
                  {def.isvariantDimensions && (
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                      Variant
                    </span>
                  )}
                  {def.isFilterable && (
                    <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                      Filterable
                    </span>
                  )}
                </div>
                <p className="text-xs text-(--color-secondary-text)">
                  {def.type}{" "}
                  {def.options.length > 0 && `• ${def.options.length} options`}
                </p>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeDefinition(index);
                }}
                className="p-1.5 hover:bg-red-500/20 text-(--color-secondary-text) hover:text-(--color-error) rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Expanded Form */}
            {expandedDef === index && (
              <div className="px-4 pb-4 space-y-3 border-t border-(--color-badge)/20 pt-3">
                <div className="grid grid-cols-2 gap-3">
                  <FormInput
                    label="Attribute Key"
                    value={def.key}
                    onChange={(e) =>
                      updateDefinition(index, {
                        key: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                      })
                    }
                    placeholder="e.g., color, size"
                    hint="Unique identifier, no spaces"
                  />
                  <FormInput
                    label="Display Name"
                    value={def.displayName}
                    onChange={(e) =>
                      updateDefinition(index, { displayName: e.target.value })
                    }
                    placeholder="e.g., Color, Size"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <FormSelect
                    label="Type"
                    value={def.type}
                    onChange={(e) =>
                      updateDefinition(index, { type: e.target.value })
                    }
                    options={ATTRIBUTE_TYPES}
                  />
                  <FormInput
                    label="Unit (optional)"
                    value={def.unit}
                    onChange={(e) =>
                      updateDefinition(index, { unit: e.target.value })
                    }
                    placeholder="e.g., kg, cm, GB"
                  />
                </div>

                {/* Options for select/color types */}
                {(def.type === "select" || def.type === "color") && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-(--color-primary-text)">
                      Options
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {def.options.map((opt, optIndex) => (
                        <span
                          key={optIndex}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-(--color-badge)/30 rounded text-sm"
                        >
                          {def.type === "color" && (
                            <span
                              className="w-3 h-3 rounded-full border border-(--color-badge)"
                              style={{ backgroundColor: opt }}
                            />
                          )}
                          {opt}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = def.options.filter(
                                (_, i) => i !== optIndex,
                              );
                              updateDefinition(index, { options: newOptions });
                            }}
                            className="hover:text-(--color-error)"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        placeholder="Add option + Enter"
                        className="px-2 py-1 bg-(--color-card) border border-(--color-badge)/30 rounded text-sm w-32 focus:outline-none focus:border-(--color-primary)"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const value = e.target.value.trim();
                            if (value && !def.options.includes(value)) {
                              updateDefinition(index, {
                                options: [...def.options, value],
                              });
                              e.target.value = "";
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Flags */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <FormToggle
                    label="Used for Variants"
                    checked={def.isvariantDimensions}
                    onChange={() => {
                      updateDefinition(index, {
                        isvariantDimensions: !def.isvariantDimensions,
                      });
                      if (!def.isvariantDimensions) {
                        toggleVariantDimension(def.key);
                      } else {
                        onVariantDimensionsChange(
                          variantDimensions.filter((k) => k !== def.key),
                        );
                      }
                    }}
                    hint="This attribute creates product variants"
                  />
                  <FormToggle
                    label="Filterable"
                    checked={def.isFilterable}
                    onChange={() =>
                      updateDefinition(index, {
                        isFilterable: !def.isFilterable,
                      })
                    }
                    hint="Show in filter sidebar"
                  />
                  <FormToggle
                    label="Required"
                    checked={def.isRequired}
                    onChange={() =>
                      updateDefinition(index, { isRequired: !def.isRequired })
                    }
                  />
                </div>

                {/* Default Value Input */}
                <div className="pt-3 border-t border-(--color-badge)/20">
                  <label className="block text-sm font-medium text-(--color-primary-text) mb-2">
                    Default Value
                  </label>
                  {def.type === "select" || def.type === "color" ? (
                    <select
                      value={
                        attributes.find((a) => a.key === def.key)?.value || ""
                      }
                      onChange={(e) =>
                        updateAttributeValue(
                          def.key,
                          e.target.value,
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-sm"
                    >
                      <option value="">Select default...</option>
                      {def.options.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  ) : def.type === "boolean" ? (
                    <FormToggle
                      label="Enabled"
                      checked={
                        attributes.find((a) => a.key === def.key)?.value ||
                        false
                      }
                      onChange={(e) =>
                        updateAttributeValue(
                          def.key,
                          e.target.value,
                          e.target.value ? "Yes" : "No",
                        )
                      }
                    />
                  ) : (
                    <input
                      type={def.type === "number" ? "number" : "text"}
                      value={
                        attributes.find((a) => a.key === def.key)?.value || ""
                      }
                      onChange={(e) =>
                        updateAttributeValue(
                          def.key,
                          e.target.value,
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 bg-(--color-card) border border-(--color-badge)/30 rounded-lg text-sm"
                      placeholder="Default value..."
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {definitions.length === 0 && (
        <p className="text-sm text-(--color-secondary-text) text-center py-4">
          No attributes defined. Click "Add Attribute" to create product
          specifications.
        </p>
      )}
    </div>
  );
};
