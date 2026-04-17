// src/lib/utils/productUtils.js

// ============================================
// PRODUCT UTILITIES
// ============================================

/**
 * Format price from cents to currency string
 * @param {number} priceInCents - Price in cents
 * @returns {string} Formatted price
 */
export const formatPrice = (priceInCents) => {
  if (!priceInCents && priceInCents !== 0) return "-";
  return `$${(priceInCents / 100).toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} currentPrice - Current price in cents
 * @param {number} oldPrice - Old price in cents
 * @returns {string|null} Discount percentage or null
 */
export const calculateDiscount = (currentPrice, oldPrice) => {
  if (!oldPrice || oldPrice <= currentPrice) return null;
  const discount = ((oldPrice - currentPrice) / oldPrice) * 100;
  return `${Math.round(discount)}%`;
};

/**
 * Get total stock across all variants
 * @param {Object} product - Product object
 * @returns {number} Total stock
 */
export const getTotalStock = (product) => {
  if (!product.hasVariants && product.variants?.length === 0) {
    return product.stock || 0;
  }
  return product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0;
};

/**
 * Get status color class
 * @param {string} status - Product status
 * @returns {string} CSS class
 */
export const getStatusColor = (status) => {
  const colors = {
    active: "bg-green-500/20 text-green-400 border-green-500/30",
    draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    archived: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    discontinued: "bg-red-500/20 text-red-400 border-red-500/30",
  };
  return colors[status] || colors.draft;
};

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Generate SKU from product and attributes
 * @param {string} productCode - Product code prefix
 * @param {Object} attributes - Attribute values object
 * @returns {string} Generated SKU
 */
export const generateSKU = (productCode, attributes = {}) => {
  const attrString = Object.values(attributes)
    .map((v) => String(v).toUpperCase().substring(0, 3))
    .join("-");
  return attrString ? `${productCode}-${attrString}` : productCode;
};

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
