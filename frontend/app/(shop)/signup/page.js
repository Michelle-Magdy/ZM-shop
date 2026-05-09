"use client";
import { signup } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../context/AuthenticationProvider";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
import { baseUserSchema as formSchema } from "../../../lib/validation/user.js";
import GoogleLoginButton from "@/app/components/auth/GoogleLoginButton";


export default function SignUp() {
  const {
    setError,
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({ resolver: zodResolver(formSchema) });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      toast("you already logged in");
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const { mutate, isError, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: (res) => {
      router.push("/verify-email");
    },
    onError: (e) => {
      console.log(e);
      setError("general", {
        message: e.message || "Failed Sign up",
      });
      toast.error(e.message || "Failed Sign up");
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 my-7">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-badge/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Create Account
          </h1>
          <p className="text-secondary-text">Sign up to create new account</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit(mutate)}>
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-primary-text"
            >
              Name
            </label>
            <input
              id="name"
              placeholder="John Doe"
              className="w-full px-4 py-3 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
              {...register("name")}
            />
            {errors.name && (
              <p className="font-bold text-error">{errors.name.message}</p>
            )}
          </div>
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

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-primary-text"
              >
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-10 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                {...register("confirmPassword")}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors cursor-pointer focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="font-bold text-error">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* {errors.general && (
            <p className="font-bold">{errors.general.message}</p>
          )} */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-primary text-brand-light font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card transition-colors cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Verify Email..." : "Verify Email"}
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
        <div className="mt-6 mx-auto w-fit">
          <GoogleLoginButton/>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-secondary-text">
          I have an account{" "}
          <Link
            href="/login"
            className="font-medium text-primary-text hover:text-shadow-primary-hover transition-colors"
          >
            Login now
          </Link>
        </p>
      </div>
    </div>
  );
}
