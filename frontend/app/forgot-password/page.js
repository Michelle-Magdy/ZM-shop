"use client";
import { forgetPassword } from "@/lib/api/auth";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { FaArrowLeft, FaEnvelope } from "react-icons/fa";
import Link from "next/link";

const emailSchema = z.email("Please enter a valid email address");
export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const validate = (value) => {
    const result = emailSchema.safeParse(value);
    if (!result.success) {
      const errorArray = JSON.parse(result.error.message);
      const message = errorArray[0].message;

      setError(message);
      return false;
    }
    setError("");
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate(email)) return;
    setIsSubmitting(true);
    try {
      await forgetPassword(email);
      toast.success("Email Sent Successfully, Go check your Inbox");
    } catch (err) {
      console.log(err);

      toast.error("fail to send reset password email");
      setError("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 my-5">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-badge/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Forgot Password
          </h1>
          <p className="text-secondary-text">
            Enter your Email address and we will send you a link to reset your
            password
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-text"
            >
              Email address
            </label>
            <div className="w-full px-4 py-3 rounded-lg bg-background border border-badge text-primary-text placeholder:text-secondary-text/50 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-colors flex items-center gap-2">
              <FaEnvelope className="shrink-0 text-primary-text" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) validate(e.target.value);
                }}
                onBlur={() => validate(email)}
                placeholder="example@gmail.com"
                required
                aria-invalid={!!error}
                aria-describedby={error ? "email-error" : undefined}
                className="w-full bg-transparent outline-none placeholder:text-secondary-text/50"
              />
            </div>
            {error && (
              <span id="email-error" role="alert" className="text-error">
                {error}
              </span>
            )}
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-primary text-brand-light font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card transition-colors cursor-pointer"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        <div className="bg-background rounded-b-2xl -mx-8 -mb-8 mt-8 px-8 py-4 border-t border-badge/20">
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
