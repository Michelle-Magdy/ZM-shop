"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";
import { adminCreateUserSchema } from "../../../../lib/validation/user.js";
import { addUser } from "../../../../lib/api/user.js";

export default function AddUserModal({ isOpen, onClose }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(adminCreateUserSchema),
    });

    const { mutate, isPending } = useMutation({
        mutationFn: addUser,
        onSuccess: () => {
            toast.success("User created successfully");
            queryClient.invalidateQueries({ queryKey: ["users"] });
            reset();
            onClose();
        },
        onError: (e) => {
            toast.error(e.response?.data?.message || "Failed to create user");
        },
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-badge/30 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-badge/30">
                    <h2 className="text-xl font-bold text-primary-text">
                        Add New User
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-secondary-text hover:text-primary-text transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(mutate)} className="p-6 space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-text">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            placeholder="John Doe"
                            className="w-full px-4 py-2 rounded-lg bg-background border border-badge text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {errors.name && (
                            <p className="text-sm text-error">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-text">
                            Email address
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-2 rounded-lg bg-background border border-badge text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        {errors.email && (
                            <p className="text-sm text-error">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Role Selection - Admin Only */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-text">
                            Role
                        </label>
                        <select
                            {...register("role")}
                            className="w-full px-4 py-2 rounded-lg bg-background border border-badge text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                            <option value="">Select role...</option>
                            <option value="customer">Customer</option>
                            <option value="vendor">Vendor</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && (
                            <p className="text-sm text-error">
                                {errors.role.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-text">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password")}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-background border border-badge text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text"
                            >
                                {showPassword ? <FaEye /> : <FaEyeSlash />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-sm text-error">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-primary-text">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("confirmPassword")}
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 pr-10 rounded-lg bg-background border border-badge text-primary-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text"
                            >
                                {showConfirmPassword ? (
                                    <FaEye />
                                ) : (
                                    <FaEyeSlash />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-sm text-error">
                                {errors.confirmPassword.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-badge text-primary-text hover:bg-badge/30 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {isPending ? "Creating..." : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
