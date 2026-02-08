"use client";
import { FaBars } from "react-icons/fa";
import SearchBar from "./SearchBar";
import MenuBar from "./MenuBar";
import { useState } from "react";
import { useCategories } from "@/app/context/CategoriesProvider";
import Link from "next/link";

export default function Menu() {
    const [open, setOpen] = useState(false);
    const categories = useCategories();

    return (
        <header className="p-3 flex sticky top-0 z-30 bg-white items-center gap-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]  dark:bg-card dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)] dark:text-secondary-text">
            <MenuBar open={open} onClose={() => setOpen(false)}></MenuBar>
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <FaBars
                    size={20}
                    className="cursor-pointer text-gray-700 dark:text-secondary-text dark:hover:text-primary-text"
                    alt="Menu"
                />
                <span className="hidden md:block whitespace-nowrap dark:hover:text-primary-text">
                    Browse Categories
                </span>
            </div>
            <div className="hidden md:flex gap-10 ml-auto mr-auto">
                {categories.data.map(
                    (cat, i) =>
                        i < 5 && (
                            <Link
                                key={cat._id}
                                href={`/category/${cat.slug}`}
                                className="text-md  hover:text-cyan-700 dark:hover:text-primary-text "
                            >
                                {cat.name}
                            </Link>
                        ),
                )}
            </div>
            <div className="md:hidden w-full">
                <SearchBar />
            </div>
        </header>
    );
}
