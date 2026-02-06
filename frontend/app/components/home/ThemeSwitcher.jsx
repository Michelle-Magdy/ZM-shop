/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useTheme } from "next-themes";
import { FaMoon, FaSun } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false);
    const { setTheme, resolvedTheme } = useTheme();

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <Image
                src="data:image/svg+xml;base64,PHN2ZyBzdHJva2U9IiNGRkZGRkYiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iMCIgdmlld0JveD0iMCAwIDI0IDI0IiBoZWlnaHQ9IjIwMHB4IiB3aWR0aD0iMjAwcHgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiB4PSIyIiB5PSIyIiBmaWxsPSJub25lIiBzdHJva2Utd2lkdGg9IjIiIHJ4PSIyIj48L3JlY3Q+PC9zdmc+Cg=="
                width={36}
                height={36}
                sizes="36x36"
                alt="Loading Light/Dark Toggle"
                priority={false}
                title="Loading Light/Dark Toggle"
            />
        );

    if (resolvedTheme === "dark")
        return (
            <button
                onClick={() => setTheme("light")}
                className="flex items-center gap-2 text-text-secondary"
            >
                <FaSun className="cursor-pointer md:mr-3" size={25} />
                <span className="md:hidden text-sm">Light Mode</span>
            </button>
        );

    if (resolvedTheme === "light")
        return (
            <button
                onClick={() => setTheme("dark")}
                className="flex items-center gap-2 text-gray-700 md:text-inherit"
            >
                <FaMoon className="cursor-pointer md:mr-3" size={25}/>
                <span className="md:hidden text-sm">Dark Mode</span>
            </button>
        );
}
