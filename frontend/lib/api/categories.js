import { API_BASE_URL } from "../apiConfig";
import { apiClient } from "./axios";

export const getCategories = async () => {
  try {
    const res = await apiClient.get(`/category`);
    return res.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
