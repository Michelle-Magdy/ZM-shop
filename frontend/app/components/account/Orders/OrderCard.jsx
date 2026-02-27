import { useState } from "react";
import {
  Package,
  ChevronRight,
  MapPin,
  CreditCard,
  Calendar,
} from "lucide-react";

import OrderStatusTimeline from "@/app/components/account/Orders/OrderStatusTimeline";
import { formatPrice } from "@/util/formatPrice";
import { formatDate } from "@/util/formatDate";
import { PRODUCT_IMAGE_URL } from "@/lib/apiConfig";
import Image from "next/image";

export default function OrderCard({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mainItem = order.items[0];
  const itemCount = order.items.length;
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`
        group relative bg-(--color-card) rounded-2xl border border-badge/50 
        overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-(--color-primary)/5 
        hover:border-(--color-primary)/30
        ${isExpanded ? "shadow-xl shadow-(--color-primary)/10" : ""}
      `}
    >
      {/* Header Section */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-badge/30 flex items-center justify-center dark:shadow dark:shadow-white">
              <Package className="w-6 h-6 text-(--color-primary) dark:text-white " />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-(--color-primary-text)">
                {order.orderNumber || "ORD-blabla"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-secondary-text">
                <Calendar size={14} />
                <span>{formatDate(order.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-(--color-primary-text)">
                {formatPrice(order.totalPrice)}
              </p>
              <p className="text-xs text-secondary-text">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-(--color-background)/50 rounded-xl px-4 mb-4 border border-badge/30">
          <OrderStatusTimeline currentStatus={order.orderStatus} />
        </div>

        {/* Quick Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-text mb-4">
          <div className="flex items-center gap-1.5">
            <CreditCard size={16} className="text-(--color-primary-text)" />
            <span className="capitalize">
              {order.paymentMethod.toLowerCase()}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-(--color-primary-text)" />
            <span className="truncate max-w-50">
              {order.address.fullAddress}
            </span>
          </div>
        </div>

        {/* Product Preview */}
        <div className="flex items-center gap-4 p-4 bg-background/50 rounded-xl border border-badge/30">
          <div className="relative w-16 h-16 rounded-lg bg-badge/20 flex items-center justify-center shrink-0 overflow-hidden">
            <Image
              src={
                mainItem?.coverImage
                  ? `${PRODUCT_IMAGE_URL}/products/${mainItem.coverImage}`
                  : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg"
              }
              fill
              sizes="64px"
              alt={mainItem.title || "Product"}
              className="object-contain p-1 transition-transform duration-200 ease-in-out group-hover:scale-110"
              unoptimized
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-primary-text truncate">
              {mainItem.title}
            </h4>
            <p className="text-sm text-secondary-text">
              {Object.values(mainItem.variant.attributeValues).map(
                (val, index, arr) => (
                  <span key={index}>
                    {val}
                    {index < arr.length - 1 && (
                      <span className="mx-1 text-gray-400">•</span>
                    )}
                  </span>
                ),
              )}
            </p>
            <p className="text-sm font-medium text-primary-text mt-1">
              Qty: {mainItem.quantity} × {formatPrice(mainItem.variant.price)}
            </p>
          </div>
          {itemCount > 1 && (
            <div className="px-3 py-1 bg-badge rounded-full text-xs font-medium text-secondary-text">
              +{itemCount - 1} more
            </div>
          )}
        </div>

        {/* Expand/Collapse */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-4 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary-text hover:text-primary-text/70 transition-colors"
        >
          <span>{isExpanded ? "Show less" : "View details"}</span>
          <ChevronRight
            size={16}
            className={`transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`}
          />
        </button>
      </div>

      {/* Expanded Details */}
      <div
        className={`
          border-t border-badge/50 bg-background/30
          transition-all duration-300 overflow-hidden
          ${isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="p-5 sm:p-6 space-y-4">
          <h4 className="font-semibold text-primary-text">Order Items</h4>
          {order.items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-3 border-b border-badge/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-lg bg-badge/20 flex items-center justify-center shrink-0 overflow-hidden">
                  <Image
                    src={
                      mainItem?.coverImage
                        ? `${PRODUCT_IMAGE_URL}/products/${mainItem.coverImage}`
                        : "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg"
                    }
                    fill
                    sizes="40px"
                    alt={mainItem.title || "Product"}
                    className="object-contain p-1 transition-transform duration-200 ease-in-out group-hover:scale-110"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="font-medium text-(--color-primary-text) text-sm">
                    {item.title}
                  </p>
                  <p className="text-sm text-secondary-text">
                    {Object.values(mainItem.variant.attributeValues).map(
                      (val, index, arr) => (
                        <span key={index}>
                          {val}
                          {index < arr.length - 1 && (
                            <span className="mx-1 text-gray-400">•</span>
                          )}
                        </span>
                      ),
                    )}
                  </p>
                  <p className="text-xs text-secondary-text">
                    {item.variant.sku}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-primary-text">
                  {formatPrice(item.variant.price * item.quantity)}
                </p>
                <p className="text-xs text-secondary-text">
                  Qty: {item.quantity}
                </p>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-badge/50">
            <div className="flex justify-between items-center">
              <span className="text-secondary-text">Payment Method</span>
              <span className="font-medium text-primary-text capitalize">
                {order.paymentMethod.toLowerCase()}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-secondary-text">Order Status</span>
              <span
                className={`
                px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                ${order.orderStatus === "DELIVERED" ? "bg-green-500/10 text-green-600" : ""}
                ${order.orderStatus === "SHIPPED" ? "bg-blue-500/10 text-blue-600" : ""}
                ${order.orderStatus === "PENDING" ? "bg-amber-500/10 text-amber-600" : ""}
                ${order.orderStatus === "CANCELLED" ? "bg-red-500/10 text-red-600" : ""}
              `}
              >
                {order.orderStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
