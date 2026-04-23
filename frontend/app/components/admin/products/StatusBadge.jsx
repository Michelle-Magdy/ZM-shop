// src/components/admin/products/StatusBadge.jsx
"use client";

import { getStatusColor } from "../../../../lib/util/productUtils";

export const StatusBadge = ({ status }) => {
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
