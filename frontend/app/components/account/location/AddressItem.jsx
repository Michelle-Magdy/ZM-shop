"use client";
import { useState } from "react";
import { deleteAddress } from "@/lib/api/address";
import { FaTrash, FaSpinner } from "react-icons/fa";

export default function AddressItem({ add, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteAddress(add._id);
      onDelete(); // Notify parent to remove from list
    } catch (error) {
      alert("Failed to delete address. Please try again.");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl bg-card p-4 sm:p-6 shadow-md flex flex-col sm:flex-row justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap  justify-between">
          <div className="flex justify-between items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-primary-text text-base sm:text-lg">
              {add.label || "Unnamed Address"}
            </h3>
            {add.isDefault && (
              <span className="bg-primary/10 text-primary dark:bg-badge dark:text-white text-xs font-medium py-1 px-2.5 rounded-full">
                Default
              </span>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-start sm:items-center gap-2 shrink-0">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2.5 rounded-lg text-secondary-text hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Delete address"
            >
              {isDeleting ? (
                <FaSpinner className="w-4 h-4 animate-spin" />
              ) : (
                <FaTrash className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <p className="mt-2 text-secondary-text text-sm sm:text-base line-clamp-2">
          {add.displayName || add.fullAddress || "No address provided"}
        </p>
      </div>
    </div>
  );
}
