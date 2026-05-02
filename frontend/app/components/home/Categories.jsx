"use client";
import CategoryListItem from "./CategoryListItem";
import { useCategories } from "@/app/context/CategoriesProvider";

export default function Categories({ handleClose }) {
  const categories = useCategories();
  const categoryList = categories?.data || [];

  return (
    <ul className="mt-4">
      {categoryList.map((category) => (
        <CategoryListItem
          key={category._id}
          depth={0}
          category={category}
          handleClose={handleClose}
        />
      ))}
    </ul>
  );
}
