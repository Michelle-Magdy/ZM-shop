import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { CiShoppingCart } from "react-icons/ci";
import { LuUserRound } from "react-icons/lu";
import SearchBar from "./SearchBar";
import UserAccount from "./UserAccount";

export default function TopHeader() {
    return (
        <div>
            <div className="flex justify-between items-center h-25 px-3 md:px-5 bg-primary text-white">
                <Link href={"/"} className="logo">
                    <i>
                        <h1 className="text-4xl font-bold text-white dark:text-primary-text whitespace-nowrap mr-2">
                            ZM-Shop
                        </h1>
                    </i>
                </Link>

                <div className=" hidden md:block w-[70%] lg:w-[50%] text-black">
                    <SearchBar />
                </div>

                <div className="right flex items-center ml-2 text-white dark:text-primary-text">
                    <div className=" hidden md:block w-[70%]">
                        <ThemeSwitcher />
                    </div>
                    <UserAccount />
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
