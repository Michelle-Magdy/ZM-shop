import { API_BASE_URL } from "../apiConfig"

export const getCategories = async () => {
    try {
        const res = await fetch(`${API_BASE_URL}/category`, {
            // mode: 'no-cors'
        });
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        return res.json();

    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
}