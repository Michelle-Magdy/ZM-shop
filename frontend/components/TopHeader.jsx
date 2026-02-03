import Link from "next/link";
import ThemeSwitcher from "./ThemeSwitcher";
import { CiUser } from "react-icons/ci";

export default function TopHeader() {
    return (
        <div>
            <div className="flex justify-center items-center h-16 px-4">
                <Link href="/login" className="flex items-center">
                    <CiUser className="mr-5" />
                    <span>My account</span>
                </Link>
                <ThemeSwitcher />
            </div>
        </div>
    );
}
