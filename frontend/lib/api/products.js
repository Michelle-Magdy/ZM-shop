import { cleanParams } from "@/lib/util/cleanParams";
import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

const isFormDataPayload = (payload) =>
  typeof FormData !== "undefined" && payload instanceof FormData;

const getRequestConfig = (payload) => {
  if (!isFormDataPayload(payload)) {
    return undefined;
  }

  return {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };
};

const appendQueryParam = (searchParams, key, value) => {
  if (value === undefined || value === null || value === "") {
    return;
  }

  if (typeof value === "number" && !Number.isFinite(value)) {
    return;
  }

  searchParams.set(key, String(value));
};

const buildCategorySearchParams = (queryParams = {}) => {
  const rawParams = cleanParams(queryParams);
  const searchParams = new URLSearchParams();

  appendQueryParam(searchParams, "sort", rawParams.sort || "title");
  appendQueryParam(searchParams, "status", rawParams.status || "active");

  // Allow both flattened API keys and UI shape (price: { min, max }).
  const minPrice =
    rawParams["defaultVariant.price[gte]"] ?? rawParams?.price?.min;
  const maxPrice =
    rawParams["defaultVariant.price[lte]"] ?? rawParams?.price?.max;
  appendQueryParam(searchParams, "defaultVariant.price[gte]", minPrice);
  appendQueryParam(searchParams, "defaultVariant.price[lte]", maxPrice);

  const appendListMap = (prefix, map) => {
    if (!map || typeof map !== "object") {
      return;
    }

    Object.entries(map).forEach(([name, values]) => {
      if (!Array.isArray(values) || values.length === 0) {
        return;
      }
      searchParams.set(`${prefix}[${name}]`, values.join(","));
    });
  };

  appendListMap("attributes", rawParams.attributes);
  appendListMap("variants", rawParams.variants);

  return searchParams;
};

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

const neededFields = ["defaultVariant", "ratingStats", "title", "coverImage", "slug", "isBestSeller", "isFeatured"]

export const getBestSellerProducts = async () => {
  try {
    const res = await apiClient.get(`/product/bestsellers?fields=${neededFields.join(",")}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getFeaturedProducts = async () => {
  try {
    const res = await apiClient.get(`/product/featured?fields=${neededFields.join(",")}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const getTopDiscountedProducts = async () => {
  try {
    const res = await apiClient.get(`/product/topDiscounts?fields=${neededFields.join(",")}`);
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const searchProducts = async (query, page = 1, limit = 20) => {
  const res = await apiClient.get(
    `product?search=${query}&fields=${neededFields.join(",")}&page=${page}&limit=${limit}`
  );
  return res.data;
};

export const getProductsByCategory = async (
  categorySlug,
  queryParams,
) => {
  try {
    const searchParams = buildCategorySearchParams(queryParams);
    searchParams.set("page", queryParams.page.toString());
    searchParams.set("limit", queryParams.limit.toString());
    searchParams.set("search", queryParams.search.toString());
    
    const searchString = searchParams.toString();
    const url = `${API_BASE_URL}/product/category/${categorySlug}?${searchString}`;

    if (typeof window === "undefined") {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok)
        throw new Error(`Failed to fetch category products (${res.status})`);
      return await res.json();
    }

    const res = await apiClient.get(
      `/product/category/${categorySlug}?${searchString}`,
    );
    return res.data;
  } catch (err) {
    console.error(err);
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
    const res = await apiClient.post(
      `/product`,
      product,
      getRequestConfig(product),
    );
    return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateProduct = async (productSlug, body) => {
  try {
    const res = await apiClient.patch(
      `/product/${productSlug}`,
      body,
      getRequestConfig(body),
    );
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
