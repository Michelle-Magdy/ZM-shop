"use client";
import { FaBars } from "react-icons/fa";
import SearchBar from "./SearchBar";
import MenuBar from "./MenuBar";
import { useState } from "react";

export default function Menu({ children }) {
    const [open, setOpen] = useState(false);
    return (      
        <div className=" p-3 flex items-center gap-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
            <MenuBar open={open} onClose={() => setOpen(false)}>
                {children}
            </MenuBar>
            <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <FaBars
                    size={20}
                    className="cursor-pointer text-gray-700"
                    alt="Menu"
                />
                <span className="hidden md:block whitespace-nowrap">
                    Browse Categories
                </span>
            </div>
            <div className="md:hidden w-full">
                <SearchBar />
            </div>
        </div>
    );
}
