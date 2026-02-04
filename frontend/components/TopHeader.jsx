import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { CiUser } from "react-icons/ci";

export default function TopHeader() {
    return (
        <div>
            <div className="flex justify-between items-center h-16 px-4 border-b border-gray-300 dark:border-gray-700">
                <ThemeSwitcher />
                <Link href="/login" className="flex items-center">
                    <CiUser className="mr-1" size={20} />
                    <span>My account</span>
                </Link>
            </div>
        </div>
    );
}
