"use client";

import { verifyEmail } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthenticationProvider";

export default function VerifyEmail() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  useEffect(() => {
    if (authLoading) return;
    if (isAuthenticated) {
      toast("you already logged in");
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    // handle paseted content
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        if (Number.isFinite(Number(pastedCode[i]))) newCode[i] = pastedCode[i];
        else return;
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      if (Number.isFinite(Number(value))) newCode[index] = value;
      else return;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0)
      inputRefs.current[index - 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log(verificationCode);
    try {
      await verifyEmail(verificationCode);
      toast.success("Email Verified Sucessfully, Login now!");
      router.push("/login");
    } catch (err) {
      toast.error("Wrong Verification Code");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 my-7">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8 border border-badge/30">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-text mb-2">
            Verify Your Email
          </h1>
          <p className="text-secondary-text">
            Enter the 6 digit code sent to your email address
          </p>
        </div>
        {/* Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center items-center gap-2">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-background text-primary-text border-2 border-gray-400 rounded-lg focus:border-cyan-500 focus:outline-0"
              />
            ))}
          </div>
          <button
            disabled={isLoading || code.some((digit) => !digit)}
            type="submit"
            className="w-full py-3 px-4 rounded-lg bg-primary text-brand-light font-semibold hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-card transition-colors cursor-pointer disabled:text-gray-500 disabled:hover:bg-primary"
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
}
