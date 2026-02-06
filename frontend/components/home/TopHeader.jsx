import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { CiUser } from "react-icons/ci";
import { CiShoppingCart } from "react-icons/ci";
import { FiUser } from "react-icons/fi";
import { FaRegUserCircle } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";
import { LuUserRound } from "react-icons/lu";
import SearchBar from "./SearchBar";

export default function TopHeader() {
    return (
        <div>
            <div className="flex justify-between items-center h-25 px-3 md:px-5 border-b bg-primary text-white">
                <div className="logo">
                    <i>
                        <h1 className="text-4xl font-bold text-gray-100 whitespace-nowrap mr-2">
                            ZM-Shop
                        </h1>
                    </i>
                </div>

                <div className=" hidden md:block w-[70%] text-black">
                    <SearchBar />
                </div>

                <div className="right flex items-center ml-2">
                    <div className=" hidden md:block w-[70%]">
                        <ThemeSwitcher />
                    </div>
                    <Link href="/login">
                        <LuUserRound
                            className="mr-1 w-7 h-7 md:w-9 md:h-9"
                            alt="User Account"
                        />
                    </Link>
                    <div className="flex items-center">
                        <CiShoppingCart className="w-9 h-9 md:w-11 md:h-11" />
                        <span className="-ml-2 -mt-7.5 md:-ml-2.5 md:-mt-9 text-sm md:text-base">
                            0
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}

/*
                <ThemeSwitcher />
                <Link href="/login" className="flex items-center">
                    <CiUser className="mr-1" size={20} />
                    <span>My account</span>
                </Link>
*/
