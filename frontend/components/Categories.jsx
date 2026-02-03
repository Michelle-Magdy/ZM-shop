import Link from "next/link";
import { getCategories } from "../lib/api/categories";

export default async function Categories() {
    const categories = await getCategories();

    console.log(
        "Rendering Categories on:",
        typeof window === "undefined" ? "SERVER" : "CLIENT",
    );
    return (
        <div className="categories">
            <h3>Categories</h3>
            <ul>
                {categories.data.map((category) => (
                    <li key={category._id}>
                        <Link href={`/category/${category._id}`}>
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
