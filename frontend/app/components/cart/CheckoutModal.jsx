// components/CheckoutModal.jsx
"use client";

import Link from "next/link.js";
import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaCreditCard,
    FaMoneyBillWave,
    FaTimes,
    FaCheck,
    FaChevronRight,
} from "react-icons/fa";

// Mock data matching your schema
const mockAddresses = [
    {
        _id: "69a06fe07555a00699cc4376",
        userId: "699c9ebb6e05470a368ed18b",
        label: "Home",
        fullAddress: "2, شارع ترعه الشرقاويه, ميت نما, القليوبية, 13629, مصر",
        isDefault: true,
        location: {
            type: "Point",
            coordinates: [31.238588833178138, 30.147219155788196],
        },
    },
    {
        _id: "69a06fe07555a00699cc4377",
        userId: "699c9ebb6e05470a368ed18b",
        label: "Work",
        fullAddress: "15, شارع التحرير, القاهرة, 11511, مصر",
        isDefault: false,
        location: {
            type: "Point",
            coordinates: [31.2357, 30.0444],
        },
    },
];

export default function CheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
}) {
    const [selectedAddressId, setSelectedAddressId] = useState(
        mockAddresses.find((a) => a.isDefault)?._id || mockAddresses[0]?._id,
    );
    const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' or 'cash'

    if (!isOpen) return null;

    const selectedAddress = mockAddresses.find(
        (a) => a._id === selectedAddressId,
    );

    const handleConfirm = () => {
        onConfirm(paymentMethod, address);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-(--color-card) shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-badge bg-(--color-card)">
                    <h2 className="text-2xl font-bold text-(--color-primary-text)">
                        Complete Your Order
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-badge transition-colors"
                    >
                        <FaTimes className="w-5 h-5 text-secondary-text" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Addresses Section */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-(--color-primary-text) flex items-center gap-2">
                                <FaMapMarkerAlt className="w-5 h-5 text-(--color-primary)" />
                                Delivery Address
                            </h3>
                            <Link
                                href="/account/addresses"
                                className="text-sm text-(--color-primary) hover:text-primary-hover flex items-center gap-1 transition-colors dark:text-secondary-text"
                            >
                                <FaPlus className="w-4 h-4" />
                                Add New Address
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {mockAddresses.map((address) => (
                                <label
                                    key={address._id}
                                    className={`relative flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                        selectedAddressId === address._id
                                            ? "border-(--color-primary) bg-(--color-primary)/5"
                                            : "border-badge hover:border-(--color-primary)/50"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name="address"
                                        value={address._id}
                                        checked={
                                            selectedAddressId === address._id
                                        }
                                        onChange={(e) =>
                                            setSelectedAddressId(e.target.value)
                                        }
                                        className="mt-1 w-4 h-4 accent-(--color-primary)"
                                    />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-semibold text-(--color-primary-text)">
                                                {address.label}
                                            </span>
                                            {address.isDefault && (
                                                <span className="px-2 py-0.5 text-xs rounded-full bg-(--color-primary) text-white">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-secondary-text leading-relaxed">
                                            {address.fullAddress}
                                        </p>
                                    </div>
                                    {selectedAddressId === address._id && (
                                        <FaCheck className="w-5 h-5 text-(--color-primary) absolute top-4 right-4" />
                                    )}
                                </label>
                            ))}
                        </div>

                        <p className="mt-3 text-sm text-secondary-text dark:text-primary-text font-bold">
                            Need more addresses?{" "}
                            <Link
                                href="/account/addresses"
                                className="text-(--color-primary) hover:underline font-medium dark:text-secondary-text"
                            >
                                Manage addresses in your account
                            </Link>
                        </p>
                    </section>

                    {/* Payment Method Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-(--color-primary-text) mb-4 flex items-center gap-2">
                            <FaCreditCard className="w-5 h-5 text-(--color-primary)" />
                            Payment Method
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Online Payment */}
                            <label
                                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === "online"
                                        ? "border-(--color-primary) bg-(--color-primary)/5"
                                        : "border-badge hover:border-(--color-primary)/50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-3 rounded-full ${
                                        paymentMethod === "online"
                                            ? "bg-(--color-primary) text-white"
                                            : "bg-badge"
                                    }`}
                                >
                                    <FaCreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <span className="block font-semibold text-(--color-primary-text)">
                                        Online Payment
                                    </span>
                                    <span className="text-xs text-secondary-text">
                                        Pay with Stripe
                                    </span>
                                </div>
                                {paymentMethod === "online" && (
                                    <FaCheck className="w-5 h-5 text-(--color-primary) absolute top-3 right-3" />
                                )}
                            </label>

                            {/* Cash on Delivery */}
                            <label
                                className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                                    paymentMethod === "cash"
                                        ? "border-(--color-primary) bg-(--color-primary)/5"
                                        : "border-badge hover:border-(--color-primary)/50"
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="payment"
                                    value="cash"
                                    checked={paymentMethod === "cash"}
                                    onChange={(e) =>
                                        setPaymentMethod(e.target.value)
                                    }
                                    className="sr-only"
                                />
                                <div
                                    className={`p-3 rounded-full ${
                                        paymentMethod === "cash"
                                            ? "bg-(--color-primary) text-white"
                                            : "bg-badge"
                                    }`}
                                >
                                    <FaMoneyBillWave className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <span className="block font-semibold text-(--color-primary-text)">
                                        Cash on Delivery
                                    </span>
                                    <span className="text-xs text-secondary-text">
                                        Pay when you receive
                                    </span>
                                </div>
                                {paymentMethod === "cash" && (
                                    <FaCheck className="w-5 h-5 text-(--color-primary) absolute top-3 right-3" />
                                )}
                            </label>
                        </div>
                    </section>

                    {/* Order Summary Preview */}
                    <div className="p-4 rounded-xl bg-badge/30">
                        <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-secondary-text">
                                Selected Address:
                            </span>
                            <span className="font-medium text-(--color-primary-text)">
                                {selectedAddress?.label}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-secondary-text">
                                Payment Method:
                            </span>
                            <span className="font-medium text-(--color-primary-text)">
                                {paymentMethod === "online"
                                    ? "Online (Stripe)"
                                    : "Cash on Delivery"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="bottom-0 p-6 border-t border-badge bg-(--color-card) space-y-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="w-full py-4 px-6 rounded-xl bg-(--color-primary) text-white font-semibold 
         hover:bg-primary-hover transition-all flex items-center justify-center gap-2
         shadow-lg shadow-(--color-primary)/25
         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-(--color-primary)
         disabled:shadow-none disabled:transform-none"
                    >
                        {paymentMethod === "online" ? (
                            <>
                                {isLoading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        Proceed to Payment
                                        <FaChevronRight className="w-5 h-5" />
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                Confirm Cash Order
                                <FaCheck className="w-5 h-5" />
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="w-full py-3 px-6 rounded-xl border-2 border-badge 
         text-secondary-text font-medium
         hover:border-(--color-primary) hover:text-(--color-primary-text) transition-all
         disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-badge
         disabled:hover:text-secondary-text"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
