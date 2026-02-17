"use client";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { login } from "@/lib/api/auth";
import Link from "next/link";
import { useAuth } from "../context/AuthenticationProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";


const zodSchema = z.object({
    "email": z.email(),
    "password": z.string().min(8, "Password must at least be 8 characters"),
    "rememberMe": z.boolean().optional(),
    "general": z.string().optional()

});

export default function Login() {
    const { setError, formState: { errors }, register, handleSubmit } = useForm({
        resolver: zodResolver(zodSchema)
    });

    const { setUser, isAuthenticated } = useAuth();
    const router = useRouter();


    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationFn: login,
        onMutate: () => {
            if (isAuthenticated) {
                toast("User already logged in. If you want to change account please logout first.");
                return Promise.reject(new Error("Already authenticated"));
            }
        },
        onError: (e) => setError("general", { message: e.response?.data?.message }),
        onSuccess: (res) => {
            setUser(res.user);
            toast.success("Welcome back " + res.user.name);
            router.push('/');
        }
    });

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 my-5">
            <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-badge/30">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-text mb-2">
                        Welcome back
                    </h1>
                    <p className="text-secondary-text">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleSubmit(mutate)}>
                    {/* Email Field */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-primary-text"
                        >
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                            {...register("email")}
                        />
                        {errors.email && <p className="font-bold">{errors.email.message}</p>}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-primary-text"
                            >
                                Password
                            </label>
                            <a
                                href="#"
                                className="text-sm text-secondary-text hover:text-primary-hover transition-colors"
                            >
                                Forgot password?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 pr-10 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                                {...register("password")}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors cursor-pointer focus:outline-none"
                                tabIndex={-1}
                            >
                                {showPassword ? (
                                    <FaEye className="w-5 h-5" />
                                ) : (
                                    <FaEyeSlash className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {errors.password && <p className="font-bold">{errors.password.message}</p>}
                    </div>
                    {/* Remember Me */}
                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            className="h-4 w-4 rounded border-badge text-primary focus:ring-primary bg-background cursor-pointer"
                            {...register("rememberMe")}
                        />
                        <label
                            htmlFor="remember"
                            className="ml-2 block text-sm text-secondary-text cursor-pointer"
                        >
                            Remember me for 30 days
                        </label>
                    </div>

                    {errors.general && <p className="font-bold">{errors.general.message}</p>}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 px-4 rounded-lg bg-primary text-brand-light font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card transition-colors cursor-pointer"
                        disabled={isPending}
                    >
                        {isPending ? "Submitting..." : "Submit"}
                    </button>
                </form>

                {/* Divider */}
                <div className="mt-8 relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-badge"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-secondary-text">
                            Or continue with
                        </span>
                    </div>
                </div>

                {/* Social Login */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center px-4 py-2 border border-badge rounded-lg bg-background text-primary-text hover:bg-badge/30 transition-colors cursor-pointer">
                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Google
                    </button>
                    <button className="flex items-center justify-center px-4 py-2 border border-badge rounded-lg bg-background text-primary-text hover:bg-badge/30 transition-colors cursor-pointer">
                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        GitHub
                    </button>
                </div>

                {/* Footer */}
                <p className="mt-8 text-center text-sm text-secondary-text">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" className="font-medium text-primary hover:text-primary-hover transition-colors">
                        Create one now
                    </Link>
                </p>
            </div>
        </div>
    );
}