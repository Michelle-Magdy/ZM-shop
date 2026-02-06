import { CiSearch } from "react-icons/ci";

export default function SearchBar() {
    return (
        <div className="flex items-stretch w-full bg-[#f6f6f6] rounded-full overflow-hidden md:h-12">
            <input
                type="text"
                placeholder="Search Product Here..."
                className="focus:outline-none flex-1 pl-4 py-2 bg-transparent self-center md:text-lg"
            />
            <div className="bg-black px-4 rounded-r-full cursor-pointer flex items-center justify-center">
                <CiSearch className="text-white md:text-2xl" />
            </div>
        </div>
    );
}
