// app/providers/CategoriesWrapper.jsx
import CategoriesProvider from "../context/CategoriesProvider";
import { getCategories } from "@/lib/api/categories";

export default async function CategoriesWrapper({ children }) {
  let categories = [];

  try {
    categories = await getCategories();
  } catch (error) {
    console.error("Failed to fetch categories during build:", error);
    // Return empty array as fallback to prevent build failure
    categories = [];
  }

  return (
    <CategoriesProvider categories={categories}>{children}</CategoriesProvider>
  );
}
