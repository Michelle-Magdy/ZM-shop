"use client";
import { signup } from "@/lib/api/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../context/AuthenticationProvider";
import { useRouter } from "next/navigation";
import { FaGoogle, FaEyeSlash, FaEye } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";
const formSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
      })
      .min(1, "Email cannot be empty")
      .email("Please enter a valid email address (e.g., user@example.com)")
      .refine((email) => !email.includes(" "), {
        message: "Email cannot contain spaces",
      })
      .refine((email) => email === email.toLowerCase(), {
        message: "Email must be lowercase",
      })
      .refine(
        (email) => {
          const [localPart, domain] = email.split("@");
          return localPart && localPart.length <= 64;
        },
        {
          message: "Local part (before @) must not exceed 64 characters",
        },
      )
      .refine(
        (email) => {
          const domain = email.split("@")[1];
          return domain && domain.length <= 255;
        },
        {
          message: "Domain part (after @) must not exceed 255 characters",
        },
      )
      .refine(
        (email) => {
          const domain = email.split("@")[1];
          return domain && domain.includes(".");
        },
        {
          message: "Domain must contain a dot (.)",
        },
      )
      .transform((email) => email.toLowerCase().trim()),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters long")
      .max(128, "Password must not exceed 128 characters")
      .refine((pwd) => /[A-Z]/.test(pwd), {
        message: "Password must contain at least one uppercase letter (A-Z)",
      })
      .refine((pwd) => /[a-z]/.test(pwd), {
        message: "Password must contain at least one lowercase letter (a-z)",
      })
      .refine((pwd) => /[0-9]/.test(pwd), {
        message: "Password must contain at least one number (0-9)",
      })
      .refine((pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd), {
        message:
          "Password must contain at least one special character (!@#$%^&* etc.)",
      })
      .refine((pwd) => !/\s/.test(pwd), {
        message: "Password cannot contain spaces",
      })
      .refine((pwd) => !/(.)\1{2,}/.test(pwd), {
        message:
          "Password cannot contain repeated characters (e.g., 'aaa', '111')",
      }),

    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error will appear on confirmPassword field
  });

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
        message: e.response?.data?.message || "Failed Sign up",
      });
      toast.error(e.response?.data?.message || "Failed Sign up");
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
        <div className="mt-6 ">
          <button className="flex items-center justify-center px-4 py-2 border border-badge rounded-lg bg-background w-full text-primary-text hover:bg-badge/30 transition-colors cursor-pointer">
            <FaGoogle className="mr-2" />
            Google
          </button>
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
