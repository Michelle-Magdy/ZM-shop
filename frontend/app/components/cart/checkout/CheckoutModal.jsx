"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
    FaMapMarkerAlt,
    FaPlus,
    FaCreditCard,
    FaTimes,
    FaCheck,
    FaChevronRight,
    FaPhone,
} from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { getAddresses } from "../../../../lib/api/address.js";
import toast from "react-hot-toast";
import AddressSelector from "./AddressSelector";
import PaymentMethodSelector from "./PaymentMethodSelector";
import PhoneInput from "./PhoneInput";
import CheckoutSummary from "./CheckoutSummary.jsx";

export default function CheckoutModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    user,
}) {
    const { data: addresses, isLoading: addressesLoading } = useQuery({
        queryKey: ["addresses", user?.id],
        queryFn: getAddresses,
        enabled: !!user?.id,
    });

    const [paymentMethod, setPaymentMethod] = useState("online");
    const [selectedAddressId, setSelectedAddressId] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");

    // ✅ Auto-select default address when data loads
    useEffect(() => {
        if (addresses?.data?.length && !selectedAddressId) {
            const defaultAddress = addresses.data.find((a) => a.isDefault);
            const firstAddress = addresses.data[0];
            setSelectedAddressId(defaultAddress?._id || firstAddress._id);
        }
    }, [addresses?.data, selectedAddressId]);

    const selectedAddress = addresses?.data?.find(
        (a) => a._id === selectedAddressId,
    );

    const handleConfirm = () => {
        if (!selectedAddress) {
            toast.error("Please select an address");
            return;
        }

        const phoneRegex = /^01[0125]\d{8}$/;
        if (!phoneRegex.test(phoneNumber)) {
            toast.error("Invalid phone number");
            return;
        }

        onConfirm(paymentMethod, selectedAddress, phoneNumber);
    };

    if (!isOpen) return null;

    const isConfirmDisabled =
        isLoading ||
        !selectedAddress ||
        !phoneNumber.trim() ||
        addressesLoading;

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

                        <AddressSelector
                            addresses={addresses?.data}
                            selectedId={selectedAddressId}
                            onSelect={setSelectedAddressId}
                            isLoading={addressesLoading}
                        />

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

                    {/* Phone Number Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-(--color-primary-text) mb-4 flex items-center gap-2">
                            <FaPhone className="w-5 h-5 text-(--color-primary)" />
                            Contact Phone
                        </h3>
                        <PhoneInput
                            value={phoneNumber}
                            onChange={setPhoneNumber}
                        />
                        <p className="mt-2 text-sm text-secondary-text">
                            We'll use this number to contact you about your
                            delivery
                        </p>
                    </section>

                    {/* Payment Method Section */}
                    <section>
                        <h3 className="text-lg font-semibold text-(--color-primary-text) mb-4 flex items-center gap-2">
                            <FaCreditCard className="w-5 h-5 text-(--color-primary)" />
                            Payment Method
                        </h3>
                        <PaymentMethodSelector
                            value={paymentMethod}
                            onChange={setPaymentMethod}
                        />
                    </section>

                    {/* Order Summary */}
                    <CheckoutSummary
                        address={selectedAddress}
                        phone={phoneNumber}
                        paymentMethod={paymentMethod}
                    />
                </div>

                {/* Footer Actions */}
                <div className="bottom-0 p-6 border-t border-badge bg-(--color-card) space-y-3">
                    <button
                        onClick={handleConfirm}
                        disabled={isConfirmDisabled}
                        className="w-full py-4 px-6 rounded-xl bg-(--color-primary) text-white font-semibold 
                            hover:bg-primary-hover transition-all flex items-center justify-center gap-2
                            shadow-lg shadow-(--color-primary)/25
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-(--color-primary)
                            disabled:shadow-none disabled:transform-none"
                    >
                        {paymentMethod === "online" ? (
                            isLoading ? (
                                "Processing..."
                            ) : (
                                <>
                                    Proceed to Payment
                                    <FaChevronRight className="w-5 h-5" />
                                </>
                            )
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
