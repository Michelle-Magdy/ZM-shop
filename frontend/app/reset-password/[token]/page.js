"use client";
import { resetPassword } from "@/lib/api/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaLock, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const formSchema = z
  .object({
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
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const token = useParams().token;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState([false, false]);

  const validatePassword = (value) => {
    const result = formSchema.shape.password.safeParse(value);
    if (!result.success) {
      const errorArray = JSON.parse(result.error.message);
      const message = errorArray[0].message;
      return message;
    }
  };

  const validateConfirmPassword = (value, pwd) => {
    if (!value?.trim()) return "Please confirm your password";
    return value === pwd ? "" : "Passwords do not match";
  };

  const validateForm = () => {
    const result = formSchema.safeParse({ password, confirmPassword });
    if (result.success) return {};
    const errorArray = JSON.parse(result.error.message);
    console.log(errorArray);

    const formErrors = {};
    errorArray.forEach((err) => {
      const field = err.path[0];
      if (!formErrors[field]) formErrors[field] = err.message;
    });
    return formErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      await resetPassword(password, token);
      toast.success("Password reset successfully");
      setPassword("");
      setConfirmPassword("");
      router.push("/login");
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-badge/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Reset Password
          </h1>
          <p className="text-secondary-text text-sm">
            Enter your new password below
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-text"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword[0] ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) {
                    setErrors((prev) => ({
                      ...prev,
                      password: validatePassword(e.target.value),
                    }));
                  }
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    password: validatePassword(password),
                  }))
                }
                placeholder="Enter new password"
                required
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                className={`w-full px-4 py-3 pl-10 pr-4 rounded-lg bg-background border text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                  errors.password
                    ? "border-error focus:ring-error/30 focus:border-error"
                    : "border-badge"
                }`}
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-text w-5 h-5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((arr) => [!arr[0], arr[1]])}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors cursor-pointer focus:outline-none"
                tabIndex={-1}
              >
                {showPassword[0] ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="font-bold text-error text-sm"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-primary-text"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword[1] ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) {
                    setErrors((prev) => ({
                      ...prev,
                      confirmPassword: validateConfirmPassword(
                        e.target.value,
                        password,
                      ),
                    }));
                  }
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: validateConfirmPassword(
                      confirmPassword,
                      password,
                    ),
                  }))
                }
                placeholder="Confirm your password"
                required
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword ? "confirm-error" : undefined
                }
                className={`w-full px-4 py-3 pl-10 pr-4 rounded-lg bg-background border text-primary-text placeholder:text-secondary-text/50 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors ${
                  errors.confirmPassword
                    ? "border-error focus:ring-error/30 focus:border-error"
                    : "border-badge"
                }`}
              />
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-text w-5 h-5 pointer-events-none" />
              <button
                type="button"
                onClick={() => setShowPassword((arr) => [arr[0], !arr[1]])}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-text hover:text-primary-text transition-colors cursor-pointer focus:outline-none"
                tabIndex={-1}
              >
                {showPassword[1] ? (
                  <FaEye className="w-5 h-5" />
                ) : (
                  <FaEyeSlash className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p
                id="confirm-error"
                role="alert"
                className="font-bold text-error text-sm"
              >
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200
              ${
                isSubmitting
                  ? "bg-primary/70 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-hover active:scale-[0.98]"
              }
              text-brand-light focus:outline-none focus:ring-2 focus:ring-primary/50 
              focus:ring-offset-2 focus:ring-offset-card
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="bg-background -mx-8 -mb-8 mt-8 px-8 py-4 border-t border-badge/20 rounded-b-2xl">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-sm text-secondary-text hover:text-primary-text transition-colors group"
          >
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
