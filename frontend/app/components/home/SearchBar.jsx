import { CiSearch } from "react-icons/ci";

export default function SearchBar() {
    return (
        <div className="flex items-stretch w-full h-10 md:h-12 bg-[#f6f6f6] md:bg-white/10 md:backdrop-blur-sm rounded-full md:border md:border-white/20">
            <input
                type="text"
                placeholder="Search Product Here..."
                className="flex-1 pl-5 md:pl-6 pr-4 py-2 bg-transparent rounded-l-full focus:outline-none text-gray-700 md:text-white placeholder:text-gray-400 md:placeholder:text-white/60"
            />
            <div className="bg-primary text-white px-5 md:px-6 rounded-r-full cursor-pointer flex items-center justify-center hover:bg-[#1a5d6e] md:hover:bg-white/30 dark:hover:bg-gray transition-colors">
                <CiSearch className="text-white md:text-2xl" />
            </div>
        </div>
    );
}
