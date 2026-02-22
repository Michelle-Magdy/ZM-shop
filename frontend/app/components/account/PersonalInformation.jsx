"use client";

import { memo, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/app/context/AuthenticationProvider";
import { updateMe } from "@/lib/api/user";
import toast from "react-hot-toast";
import { isDirty } from "zod/v3";

// 1. Schema outside component
const formSchema = z.object({
  name: z.string().trim().min(3, "name must be greater than 3 characters"),
  phone: z
    .string()
    .trim()
    .regex(/^01[0125]\d{8}$/, "Invalid phone number"),
  gender: z.enum(["male", "female"]),
});

// 2. Reusable field component
const Field = memo(({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-primary-text mb-2">
      {label}
    </label>
    <div className="relative">{children}</div>
    {error && (
      <p role="alert" className="font-bold text-error text-sm mt-1">
        {error.message}
      </p>
    )}
  </div>
));

Field.displayName = "Field";

export default function PersonalInformation() {
  const { user } = useAuth();

  // 3. Memoized default values
  const defaultValues = useMemo(
    () => ({
      name: user?.name || "",
      phone: user?.phone || "",
      gender: user?.gender || "male",
    }),
    [user?.name, user?.phone, user?.gender],
  );

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues,
  });

  // 4. Single reset effect
  useEffect(() => {
    if (user) reset(defaultValues);
  }, [user, reset, defaultValues]);

  const { mutate, isPending } = useMutation({
    mutationFn: updateMe,
    onSuccess: () => toast.success("Your info is updated successfully"),
    onError: () => toast.error("Cannot update your info"),
  });

  // 5. Phone input with native sanitization (no watch/useEffect)
  const phoneRegister = register("phone");
  console.log(phoneRegister);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-bold text-primary-text mb-6">
        Personal Information
      </h2>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        noValidate
        onSubmit={handleSubmit(mutate)}
      >
        <Field label="Name" error={errors.name}>
          <input
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 bg-background border rounded-lg text-primary-text focus:outline-none focus:border-primary ${
              errors.name ? "border-error" : "border-badge"
            }`}
          />
        </Field>

        <Field label="Email">
          <input
            type="email"
            value={user?.email || ""}
            readOnly
            className="w-full px-4 py-3 bg-badge/50 border border-transparent rounded-lg text-primary-text cursor-not-allowed"
          />
        </Field>

        <Field label="Phone number" error={errors.phone}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={11}
            {...phoneRegister}
            onInput={(e) => {
              // Sanitize without React re-renders
              e.target.value = e.target.value.replace(/\D/g, "");
              // Call RHF's onChange manually
              phoneRegister.onChange(e);
            }}
            className={`w-full px-4 py-3 bg-background border rounded-lg text-primary-text focus:outline-none focus:border-primary ${
              errors.phone ? "border-error" : "border-badge"
            }`}
          />
        </Field>

        <Field label="Gender" error={errors.gender}>
          <select
            {...register("gender")}
            className={`w-full px-4 py-3 bg-background border rounded-lg text-primary-text focus:outline-none focus:border-primary ${
              errors.gender ? "border-error" : "border-badge"
            }`}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isPending || !isDirty}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
