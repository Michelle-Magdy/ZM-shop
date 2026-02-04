import { CiSearch } from "react-icons/ci";

export default function SearchBar(){
    return(
        <div className="p-2 rounded-full w-full focus:outline-none bg-white flex items-center justify-between">
            <input type="text" placeholder="Search Product Here..." className="focus:outline-none w-full"/> 
            <CiSearch className="inline-block ml-2 cursor-pointer" size={25} />
        </div>
    )
}