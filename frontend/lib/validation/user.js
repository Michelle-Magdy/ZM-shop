import { z } from 'zod'

/* Signup page usage */
export const baseUserSchema = z
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

{/* Admin usage */}
export const adminCreateUserSchema = baseUserSchema
    .extend({
        role: z.enum(["admin", "customer", "vendor"], {
            required_error: "Role is required",
        }),
    });