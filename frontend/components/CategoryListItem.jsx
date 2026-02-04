"use client";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import style from "./CategoryListItem.module.css";

export default function CategoryListItem({ depth, category }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <>
            <li
                style={{ marginLeft: 16 + depth * 20 }}
                className={`border-b border-gray-300 py-3 mr-4 flex justify-between items-center font-medium ${expanded ? 'text-cyan-900 font-semibold' : 'text-gray-700'} ${style.category}`}
            >
                <Link href={`/category/${category._id}`}>
                    {depth > 0 && (
                        <MdKeyboardArrowRight className="!inline mr-0.5" />
                    )}
                    {category.name}
                </Link>
                {category.subcategories.length > 0 && (
                    <button
                        className="p-1 !bg-gray-200 rounded-full"
                        onClick={() => setExpanded((prev) => !prev)}
                    >
                        {expanded ? (
                            <FaMinus className="text-[10px]" />
                        ) : (
                            <FaPlus className="text-[10px]" />
                        )}
                    </button>
                )}
            </li>
            {expanded && category.subcategories.length > 0 && (
                <ul className="mt-2 w-full">
                    {category.subcategories.map((subcat) => (
                        <CategoryListItem
                            key={subcat._id}
                            depth={depth + 1}
                            category={subcat}
                        />
                    ))}
                </ul>
            )}
        </>
    );
}
