// src/components/admin/products/ProductTableRow.jsx
"use client";

import Image from "next/image";
import { Star, Edit2, Trash2, MoreHorizontal, Check } from "lucide-react";
import {
  formatPrice,
  calculateDiscount,
  getTotalStock,
  formatDate,
} from "../../../../util/productUtils";
import { StatusBadge } from "./StatusBadge";
import { StockIndicator } from "./StockIndicator";

export const ProductTableRow = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleFlag,
}) => {
  const totalStock = getTotalStock(product);
  const discount = calculateDiscount(product.price, product.olderPrice);

  return (
    <tr className="border-b border-(--color-badge)/20 hover:bg-(--color-badge)/10 transition-colors">
      <td className="px-4 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(product._id)}
          className="w-4 h-4 rounded border-(--color-badge) text-(--color-primary) focus:ring-(--color-primary)"
        />
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-(--color-background) flex-shrink-0">
            <Image
              src={product.coverImage}
              alt={product.title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-(--color-primary-text) truncate max-w-[200px]">
              {product.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-(--color-secondary-text)">
              <span>SKU: {product.variants?.[0]?.sku || "N/A"}</span>
              {discount && <span className="text-red-400">-{discount}</span>}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <div className="font-medium text-(--color-primary-text)">
            {formatPrice(product.price)}
          </div>
          {product.olderPrice && (
            <div className="text-xs text-(--color-secondary-text) line-through">
              {formatPrice(product.olderPrice)}
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <StockIndicator stock={totalStock} />
        {product.variants?.length > 0 && (
          <div className="text-xs text-(--color-secondary-text) mt-1">
            {product.variants.length} variants
          </div>
        )}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1 text-(--color-secondary-text)">
          <Star size={14} className="text-yellow-400" fill="currentColor" />
          <span className="font-medium text-(--color-primary-text)">
            {product.ratingStats.average}
          </span>
          <span className="text-xs">({product.ratingStats.count})</span>
        </div>
      </td>
      <td className="px-4 py-4 text-(--color-secondary-text) text-sm">
        {product.salesCount.toLocaleString()}
      </td>
      <td className="px-4 py-4 text-(--color-secondary-text) text-sm">
        {formatDate(product.updatedAt)}
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onToggleFlag(product._id, "isFeatured", !product.isFeatured)
            }
            className={`p-2 rounded-lg transition-colors ${product.isFeatured ? "bg-yellow-500/20 text-yellow-400" : "hover:bg-(--color-badge)/20 text-(--color-secondary-text)"}`}
            title={
              product.isFeatured ? "Remove from featured" : "Add to featured"
            }
          >
            <Star
              size={16}
              fill={product.isFeatured ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={() =>
              onToggleFlag(product._id, "isBestSeller", !product.isBestSeller)
            }
            className={`p-2 rounded-lg transition-colors ${product.isBestSeller ? "bg-orange-500/20 text-orange-400" : "hover:bg-(--color-badge)/20 text-(--color-secondary-text)"}`}
            title={
              product.isBestSeller ? "Remove bestseller" : "Mark as bestseller"
            }
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onEdit(product)}
            className="p-2 hover:bg-(--color-primary)/10 text-(--color-primary) rounded-lg transition-colors"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};
