// SearchBar.jsx
"use client";

import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { searchProducts } from "@/lib/api/products";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchPopover from "@/app/UI/SearchPopover";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef(null);
    const router = useRouter();

    const { data, isLoading, isError } = useQuery({
        queryKey: ["searchProducts", query],
        queryFn: () => searchProducts(query),
        enabled: query.length >= 3,
    });

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        if (e.target.value === "") setIsOpen(false);
        else setIsOpen(true);
    };

    return (
        <div className="relative w-full">
            <div className="flex items-stretch w-full h-10 md:h-12 bg-[#f6f6f6] md:bg-white/10 md:backdrop-blur-sm rounded-full border border-white/20">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    placeholder="Search Product Here..."
                    className="flex-1 pl-5 md:pl-6 pr-4 py-2 bg-transparent rounded-l-full focus:outline-none text-gray-700 md:text-white placeholder:text-gray-400 md:placeholder:text-white/60"
                    onFocus={() => {
                        if(!isOpen)
                            setIsOpen(true);
                    }}
                />
                <button
                    className="bg-primary text-white px-5 md:px-6 rounded-r-full -ml-3 cursor-pointer flex items-center justify-center hover:bg-[#1a5d6e] md:hover:bg-white/30 transition-colors"
                    onClick={() => {
                        if(query !== "")
                            router.push(`/search?search=${query}`)
                    }}
                >
                    <CiSearch className="text-white md:text-2xl" />
                </button>
            </div>

            <SearchPopover
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                query={query}
                results={data}
                isLoading={isLoading}
                isError={isError}
            />
        </div>
    );
}
