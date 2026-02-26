"use client";
import { useEffect, useState } from "react";
import style from "@/app/UI/Animation.module.css";
import { RxCross1 } from "react-icons/rx";
import Categories from "./home/Categories";
import ThemeSwitcher from "./ThemeSwitcher";
import Link from "next/link";
import { FaRegHeart } from "react-icons/fa";
import Wishlist from "./Wishlist";

export default function MenuBar({ open, onClose }) {
    const [closing, setClosing] = useState(false);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 300);
    };

    if (!open) return null;

    return (
        <>
            {/* Backdrop - fixed background */}
            <div
                className={`fixed inset-0 z-40 bg-black/40 ${
                    open && !closing ? "opacity-100" : "opacity-0"
                }`}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full md:h-dvh max-h-none w-75 z-50 bg-white dark:bg-card flex flex-col overflow-hidden ${
                    closing ? style.fadeRightLeft : style.fadeLeftRight
                }`}
            >
                <div className="flex items-center justify-between p-4 bg-primary text-white shrink-0">
                    <h2 className="text-2xl font-bold">Menu</h2>
                    <button onClick={handleClose}>
                        <RxCross1 size={25} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain">
                    <Categories handleClose={handleClose} />

                    <div className="md:hidden p-4 mt-5">
                        <ThemeSwitcher />
                    </div>

                    <div className="md:hidden pl-3 mt-2">
                        <Wishlist />
                    </div>
                </div>
            </div>
        </>
    );
}
