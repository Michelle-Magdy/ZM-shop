// src/components/admin/products/StockIndicator.jsx
"use client";

export const StockIndicator = ({ stock, lowThreshold = 5 }) => {
  let colorClass = "text-green-400";
  let bgClass = "bg-green-500/20";

  if (stock === 0) {
    colorClass = "text-red-400";
    bgClass = "bg-red-500/20";
  } else if (stock <= lowThreshold) {
    colorClass = "text-yellow-400";
    bgClass = "bg-yellow-500/20";
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${bgClass}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${colorClass.replace("text-", "bg-")}`}
      />
      <span className={`text-xs font-medium ${colorClass}`}>
        {stock === 0
          ? "Out of Stock"
          : stock <= lowThreshold
            ? `${stock} Low`
            : stock}
      </span>
    </div>
  );
};
