// src/components/admin/products/form/SEOSection.jsx
"use client";

import { useEffect, useState } from "react";
import { FormInput } from "./FormInput";

export const SEOSection = ({ title, slug, onSlugChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  // Auto-generate slug from title
  useEffect(() => {
    if (!isEditing && title && !slug) {
      const generated = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 100);
      onSlugChange(generated);
    }
  }, [title, isEditing]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-(--color-primary-text)">
        SEO Settings
      </label>

      <div className="p-3 bg-(--color-badge)/10 rounded-lg">
        <p className="text-xs text-(--color-secondary-text)">
          Preview:{" "}
          <span className="text-(--color-primary)">
            /products/{slug || "your-product-slug"}
          </span>
        </p>
      </div>
    </div>
  );
};
