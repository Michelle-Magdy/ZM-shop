// src/components/admin/products/DeleteModal.jsx
"use client";

import { AlertTriangle, X } from "lucide-react";

export const DeleteModal = ({ product, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-enter">
      <div className="bg-(--color-card) rounded-2xl border border-(--color-badge)/30 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-(--color-primary-text)">
            Delete Product
          </h3>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-(--color-badge)/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-(--color-secondary-text)" />
          </button>
        </div>

        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-500/20 rounded-full flex-shrink-0">
            <AlertTriangle className="text-red-400" size={24} />
          </div>
          <div>
            <p className="text-(--color-primary-text) mb-2">
              Are you sure you want to delete <strong>{product?.title}</strong>?
            </p>
            <p className="text-sm text-(--color-secondary-text)">
              This action will archive the product. It will no longer be visible
              to customers but can be restored later.
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-(--color-badge)/30 text-(--color-primary-text) hover:bg-(--color-badge)/20 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(product.slug)}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete Product
          </button>
        </div>
      </div>
    </div>
  );
};
