import { cleanParams } from "@/util/cleanParams";
import { apiClient } from "./axios";
export const getAllProducts = async (query = "") => {
  try {
    const cleanQuery = cleanParams(query);
    const queryParams = new URLSearchParams(cleanQuery).toString() || "";
    console.log(queryParams);

    const res = await apiClient.get(`/product?${queryParams}`);

    return res.data;
  } catch (error) {
    console.log(error);
  }
};
export const getBestSellerProducts = async () => {
  try {
    const res = await apiClient.get("/product/bestsellers");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await apiClient.get("/product/featured");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopDiscountedProducts = async () => {
  try {
    const res = await apiClient.get("/product/topDiscounts");
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const searchProducts = async (query) => {
  try {
    const res = await apiClient.get(`/product?search=${query}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getProductsByCategory = async (categorySlug, queryParams) => {
  try {
    const cleanQuery = cleanParams(queryParams);
    const searchString = new URLSearchParams(cleanQuery).toString() || "";
    console.log(searchString);

    const res = await apiClient.get(
      `/product/category/${categorySlug}?${searchString}`,
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProduct = async (productSlug) => {
  try {
    const res = await apiClient.get(`/product/${productSlug}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProductReviews = async (productId) => {
  try {
    const res = await apiClient.get(`/reviews/${productId}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const createProduct = async (product) => {
  try {
    const res = await apiClient.post(`/product`, product);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateProduct = async (productSlug, body) => {
  try {
    const res = await apiClient.patch(`/product/${productSlug}`, body);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteProduct = async (productSlug) => {
  try {
    const res = await apiClient.delete(`/product/${productSlug}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const bulkUpdateProducts = async (slugs, updates) => {
  try {
    const res = await apiClient.post(`/product/bulk-update`, {
      slugs,
      updates,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const bulkDeleteProducts = async (slugs) => {
  try {
    const res = await apiClient.delete(`/product/bulk-delete`, { slugs });
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getProductStats = async () => {
  try {
    const res = await apiClient.get(`/product/stats`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
//=======================================
// src/lib/api/products.js

/**
 * Fetch vendors for dropdown
 * TODO: Replace with actual fetch call
 * Endpoint: GET /api/vendors
 */
export const fetchVendors = async () => {
  await delay(200);
  return { vendors: mockVendors };
};

// Add these to src/lib/api/products.js

/**
 * Upload product images
 * TODO: Replace with actual API call
 * Endpoint: POST /api/upload
 */
export const uploadImages = async (files) => {
  await delay(1000);
  // Return mock URLs - replace with actual upload
  return files.map((file) => URL.createObjectURL(file));
};

/**
 * Generate slug from title
 * TODO: Replace with actual API call or use client-side
 * Endpoint: GET /api/products/slug?title=
 */
export const generateSlug = async (title) => {
  await delay(200);
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 100);
};
