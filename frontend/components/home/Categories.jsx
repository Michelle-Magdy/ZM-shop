import { getCategories } from "../../lib/api/categories";
import CategoryListItem from "./CategoryListItem";

export default async function Categories() {
  const categories = await getCategories();

  return (
    <ul className="mt-4">
      {categories.data.map((category) => (
        <CategoryListItem key={category._id} depth={0} category={category} />
      ))}
    </ul>
  );
}
