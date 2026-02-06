// app/providers/CategoriesWrapper.jsx
import CategoriesProvider from "../context/CategoriesProvider";
import { getCategories } from "@/lib/api/categories";

export default async function CategoriesWrapper({ children }) {
    const categories = await getCategories();
    return (
        <CategoriesProvider categories={categories}>
            {children}
        </CategoriesProvider>
    );
}
