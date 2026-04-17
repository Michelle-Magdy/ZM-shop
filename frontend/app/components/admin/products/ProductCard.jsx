// src/components/admin/products/ProductCard.jsx
"use client";

import Image from "next/image";
import {
  Star,
  Package,
  TrendingUp,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
} from "lucide-react";
import {
  formatPrice,
  calculateDiscount,
  getTotalStock,
  formatDate,
} from "../../../../util/productUtils";
import { StatusBadge } from "./StatusBadge";
import { StockIndicator } from "./StockIndicator";
import { IMAGES_BASE_URL } from "@/lib/apiConfig";

export const ProductCard = ({ product, onEdit, onDelete, onToggleFlag }) => {
  const totalStock = getTotalStock(product);
  const discount = calculateDiscount(product.price, product.olderPrice);
  const hasVariants = product.variants && product.variants.length > 0;

  return (
    <div className="bg-(--color-card) rounded-xl border border-(--color-badge)/30 overflow-hidden hover:border-(--color-primary)/50 transition-all duration-300 group">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-(--color-background)">
        <Image
          src={`${IMAGES_BASE_URL}/products/${product.coverImage}`}
          alt={product.title}
          fill
          unoptimized
          loading="eager"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{discount}
          </div>
        )}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="bg-(--color-primary) text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <Star size={12} fill="currentColor" />
              Featured
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1">
              <TrendingUp size={12} />
              Best Seller
            </span>
          )}
        </div>
        {product.status !== "active" && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <StatusBadge status={product.status} />
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-(--color-primary-text) line-clamp-2 flex-1">
            {product.title}
          </h3>
          <div className="relative group/menu">
            <button className="p-1.5 hover:bg-(--color-badge)/30 rounded-lg transition-colors">
              <MoreVertical
                size={16}
                className="text-(--color-secondary-text)"
              />
            </button>
            <div className="absolute right-0 top-full mt-1 w-40 bg-(--color-card) border border-(--color-badge)/30 rounded-lg shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 animate-enter">
              <button
                onClick={() =>
                  onToggleFlag(product._id, "isFeatured", !product.isFeatured)
                }
                className="w-full px-4 py-2 text-left text-sm hover:bg-(--color-badge)/20 text-(--color-primary-text) first:rounded-t-lg"
              >
                {product.isFeatured ? "Remove Featured" : "Mark Featured"}
              </button>
              <button
                onClick={() =>
                  onToggleFlag(
                    product._id,
                    "isBestSeller",
                    !product.isBestSeller,
                  )
                }
                className="w-full px-4 py-2 text-left text-sm hover:bg-(--color-badge)/20 text-(--color-primary-text)"
              >
                {product.isBestSeller
                  ? "Remove Best Seller"
                  : "Mark Best Seller"}
              </button>
              <div className="border-t border-(--color-badge)/30" />
              <button
                onClick={() => onEdit(product)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-(--color-badge)/20 text-(--color-primary-text)"
              >
                Edit Product
              </button>
              <button
                onClick={() => onDelete(product)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-500/20 text-red-400 last:rounded-b-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold text-(--color-primary-text)">
            {formatPrice(product.price)}
          </span>
          {product.olderPrice && (
            <span className="text-sm text-(--color-secondary-text) line-through">
              {formatPrice(product.olderPrice)}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-(--color-secondary-text)">
            <Package size={14} />
            <StockIndicator stock={totalStock} />
            {hasVariants && (
              <span className="text-(--color-primary)">
                ({product.variants.length} variants)
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-(--color-secondary-text)">
            <Eye size={14} />
            {product.viewCount.toLocaleString()} views
          </div>
          <div className="flex items-center gap-1.5 text-(--color-secondary-text)">
            <TrendingUp size={14} />
            {product.salesCount.toLocaleString()} sales
          </div>
          <div className="flex items-center gap-1.5 text-(--color-secondary-text)">
            <Star size={14} className="text-yellow-400" fill="currentColor" />
            {product.ratingStats.average} ({product.ratingStats.count})
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-(--color-badge)/30 flex items-center justify-between">
          <span className="text-xs text-(--color-secondary-text)">
            Updated {formatDate(product.updatedAt)}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="p-2 bg-(--color-primary)/10 hover:bg-(--color-primary)/20 text-(--color-primary) rounded-lg transition-colors"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
