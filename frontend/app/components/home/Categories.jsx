'use client';
import CategoryListItem from "./CategoryListItem";
import { useCategories } from "@/app/context/CategoriesProvider";

export default function Categories() {
    const categories = useCategories();

    return (
        <ul className="mt-4">
            {categories.data.map((category) => (
                <CategoryListItem
                    key={category._id}
                    depth={0}
                    category={category}
                />
            ))}
        </ul>
    );
}
