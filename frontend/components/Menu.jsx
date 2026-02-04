'use client'
import { FaBars } from "react-icons/fa"
import SearchBar from "./SearchBar"
import MenuBar from "./MenuBar"
import { useState } from "react";

export default function Menu({children}) {
    const [open, setOpen] = useState(false);
    return (
        <div className="bg-cyan-900 p-3 flex items-center gap-4">
            <MenuBar open={open} onClose={() => setOpen(false)}>
                {children}
            </MenuBar>
            <FaBars size={20} color="white" cursor="pointer" onClick={() => setOpen(true)}/>    
            <SearchBar />
        </div>
    )
}