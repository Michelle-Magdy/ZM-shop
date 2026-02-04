"use client";
import { useEffect, useRef, useState } from "react";
import style from "./MenuBar.module.css";
import { RxCross1 } from "react-icons/rx";
import Categories from "./Categories";

export default function MenuBar({ open, onClose, children }) {
    const dialogRef = useRef(null);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (open && dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }

        if (!open && dialogRef.current?.open) {
            dialogRef.current.close();
        }
    }, [open]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            onClose();
            setClosing(false);
        }, 300);
    };

    return (
        <dialog
            ref={dialogRef}
            onClick={(e) => {
                // click outside
                if (e.target === dialogRef.current) handleClose();
            }}
            className={`${closing ? style.dialogueRightLeft : style.dialogueLeftRight} backdrop:bg-black/40 h-dvh max-h-none w-75`}
        >
            <div className="flex items-center justify-between p-4 bg-cyan-900 text-white">
                <h2 className="text-2xl font-bold">Menu</h2>
                <button onClick={handleClose}>
                    <RxCross1 size={25} />
                </button>
            </div>
            
            {children}
        </dialog>
    );
};
