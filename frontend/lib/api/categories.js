import { apiClient } from "./axios";
import { API_BASE_URL } from "../apiConfig";
export const getCategories = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/category`, {
      next: { revalidate: 3600 },
    });
    const categories = await res.json();

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const getCategoryBySlug = async (slug) => {
  try {
    const res = await fetch(`${API_BASE_URL}/category/${slug}`);
    const category = await res.json();
    return category;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getFilters = async (id) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/category/${id.toString()}/filters`,
      {
        next: { revalidate: 3600 },
      },
    );
    return await res.json();
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
