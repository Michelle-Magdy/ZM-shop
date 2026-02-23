import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import SearchBar from "./SearchBar";
import UserAccount from "./UserAccount";
import ShoppingCart from "./ShoppingCart";

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

                <div className="right flex items-center ml-2 text-white dark:text-primary-text *:hover:text-secondary-text *:dark:hover:text-primary-hover *:cursor-pointer">
                    <div className=" hidden md:block w-[70%]">
                        <ThemeSwitcher />
                    </div>
                    <UserAccount />
                    <ShoppingCart />
                </div>
            </div>
        </div>
    );
}
