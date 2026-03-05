"use client";

import { FaCreditCard, FaMoneyBillWave, FaCheck } from "react-icons/fa";

const PAYMENT_METHODS = [
    {
        id: "online",
        label: "Online Payment",
        description: "Pay with Stripe",
        icon: FaCreditCard,
    },
    {
        id: "cash",
        label: "Cash on Delivery",
        description: "Pay when you receive",
        icon: FaMoneyBillWave,
    },
];

export default function PaymentMethodSelector({ value, onChange }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = value === method.id;

                return (
                    <label
                        key={method.id}
                        className={`relative flex flex-col items-center gap-3 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                            isSelected
                                ? "border-(--color-primary) bg-(--color-primary)/5 dark:bg-(--color-primary)"
                                : "border-badge hover:border-(--color-primary)/50"
                        }`}
                    >
                        <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={isSelected}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        <div
                            className={`p-3 rounded-full ${
                                isSelected
                                    ? "bg-(--color-primary) text-white"
                                    : "bg-badge"
                            }`}
                        >
                            <Icon className="w-6 h-6" />
                        </div>
                        <div className="text-center">
                            <span className="block font-semibold text-(--color-primary-text)">
                                {method.label}
                            </span>
                            <span className="text-xs text-secondary-text">
                                {method.description}
                            </span>
                        </div>
                        {isSelected && (
                            <FaCheck className="w-5 h-5 text-(--color-primary) dark:text-inherit absolute top-3 right-3" />
                        )}
                    </label>
                );
            })}
        </div>
    );
}
