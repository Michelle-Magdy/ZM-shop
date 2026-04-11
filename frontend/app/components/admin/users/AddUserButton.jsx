"use client";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddUserModal from "./AddUserModal.jsx";
import { createPortal } from "react-dom";

export default function AddUserButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    });
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-(--color-primary) hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
            >
                <FaPlus className="w-4 h-4" />
                Add User
            </button>
            {isMounted &&
                createPortal(
                    <AddUserModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                    />,
                    document.getElementById("modal-root"),
                )}
        </>
    );
}
