import { z } from "zod";

// Common schemas
const passwordSchema = z
    .string()
    .min(8)

// Login schema
export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required")
});

// Register user schema (for managers)
export const registerUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    department: z.string().min(1, "Department is required"),
    phone: z.string().optional(),
    location: z.string().optional(),
    depot: z.string().optional(),
    role: z.string().default("USER"),
});

// Register manager schema (for admins)
export const registerManagerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    department: z.string().min(1, "Department is required"),
    phone: z.string().optional(),
    location: z.string().optional()
});

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format")
});

// Reset password schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: passwordSchema
});

export const refreshTokenSchema = z.object({
    refresh_token: z.string().min(1),
});
