export const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:5000/api/v1/category", {
      next: { revalidate: 3600 },
    });
    const categories = await res.json();

    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};
