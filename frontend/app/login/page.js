"use client";

import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { login } from "@/lib/api/auth";
import Link from "next/link";
import { useAuth } from "../context/AuthenticationProvider";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";

const zodSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must at least be 8 characters"),
  rememberMe: z.boolean().optional(),
  general: z.string().optional(),
});

export default function Login() {
  const {
    setError,
    formState: { errors, isSubmitting },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(zodSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, setUser } = useAuth();
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      toast.success("you already logged in");
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onMutate: () => {
      if (isAuthenticated) {
        toast.error(
          "User already logged in. If you want to change account please logout first.",
        );
        return Promise.reject(new Error("Already authenticated"));
      }
    },
    onError: (e) => setError("general", { message: e.response?.data?.message }),
    onSuccess: (res) => {
      setUser(res.user);
      toast.success("Welcome back " + res.user.name);
      router.push("/");
    },
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
              //   type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              {...register("email")}
            />
            {errors.email && (
              <p className="font-bold text-error">{errors.email.message}</p>
            )}
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
              <Link
                href="/forgot-password"
                className="text-sm text-secondary-text hover:text-primary-hover transition-colors"
              >
                Forgot password?
              </Link>
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
            {errors.password && (
              <p className="font-bold text-error">{errors.password.message}</p>
            )}
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

          {errors.general && (
            <p className="font-bold">{errors.general.message}</p>
          )}
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
        <div className="mt-6 ">
          <button className="flex items-center justify-center px-4 py-2 border border-badge rounded-lg bg-background w-full text-primary-text hover:bg-badge/30 transition-colors cursor-pointer">
            <FaGoogle className="mr-2" />
            Google
          </button>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-secondary-text">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary-text hover:text-shadow-primary-hover transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>
    </div>
  );
}
