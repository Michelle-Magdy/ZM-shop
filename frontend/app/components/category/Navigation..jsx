"use client";
import { useCategories } from "@/app/context/CategoriesProvider";
import Link from "next/link";
import { getCategoryTree } from "@/util/CategoryHelper";
import { useMemo } from "react";

export default function Navigation({ slug }) {
    const categories = useCategories();
    const res = useMemo(() => {
        return getCategoryTree(slug, categories.data, ["Home"]) ?? ["Home"];
    }, [slug, categories.data]);

    return (
        <div className="flex items-center gap-2 my-5 flex-wrap">
            {res.map((cat, i) => (
                <Link key={cat} href={i === 0 ? "/" : `/category/${cat}`}>
                    {cat}
                    {i !== res.length - 1 && " |"}
                </Link>
            ))}
        </div>
    );
}
