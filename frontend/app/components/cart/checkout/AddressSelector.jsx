"use client";

import Link from "next/link";
import { FaMapMarkerAlt, FaPlus, FaCheck } from "react-icons/fa";

export default function AddressSelector({
    addresses,
    selectedId,
    onSelect,
    isLoading,
}) {
    if (isLoading) {
        return (
            <div className="p-8 text-center text-secondary-text">
                Loading addresses...
            </div>
        );
    }

    if (!addresses?.length) {
        return (
            <div className="p-6 rounded-xl border-2 border-dashed border-badge text-center">
                <p className="text-secondary-text mb-4">No addresses found</p>
                <Link
                    href="/account/addresses"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-(--color-primary) text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                    <FaPlus className="w-4 h-4" />
                    Add Your First Address
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {addresses.map((address) => (
                <label
                    key={address._id}
                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedId === address._id
                            ? "border-(--color-primary) bg-(--color-primary)/5"
                            : "border-badge hover:border-(--color-primary)/50"
                    }`}
                >
                    <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedId === address._id}
                        onChange={(e) => onSelect(e.target.value)}
                        className="mt-1 w-4 h-4 accent-(--color-primary)"
                    />
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-(--color-primary-text)">
                                {address.label || "Address"}
                            </span>
                            {address.isDefault && (
                                <span className="px-2 py-0.5 text-xs rounded-full bg-(--color-primary) text-white">
                                    Default
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-secondary-text leading-relaxed">
                            {address.fullAddress ||
                                `${address.street}, ${address.city}`}
                        </p>
                    </div>
                    {selectedId === address._id && (
                        <FaCheck className="w-5 h-5 text-(--color-primary) dark:text-inherit absolute top-4 right-4" />
                    )}
                </label>
            ))}
        </div>
    );
}
