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

export const getCategories = async () => {
  const res = await apiClient.get(`category`);
  return res.data;
};

export const getCategoryBySlug = async (slug) => {
  const res = await apiClient.get(`category/${slug}`);
  return res.data;
};

export const getFilters = async (id) => {
  const res = await apiClient.get(`category/${id.toString()}/filters`);
  return res.data;
};

export const deleteCategory = async (id) => {
  try {
    const res = await apiClient.delete(
      `${API_BASE_URL}/category/${id.toString()}`,
    );

    return res.data;
  } catch (error) {
    console.error("Error deleteing category:", error);
    throw error;
  }
};

export const updateCategory = async (id, category) => {
  try {
    const res = await apiClient.patch(
      `${API_BASE_URL}/category/${id.toString()}`,
      category,
      getRequestConfig(category),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const createCategory = async (category) => {
  try {
    const res = await apiClient.post(
      `${API_BASE_URL}/category`,
      category,
      getRequestConfig(category),
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    const res = await apiClient.get(`${API_BASE_URL}/category/stats`);
    return res.data.stats[0];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
