import { z } from "zod";

const passwordSchema = z.string().min(8);

export const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

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

export const registerManagerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: passwordSchema,
    department: z.string().min(1, "Department is required"),
    phone: z.string().optional(),
    location: z.string().optional(),
    depot: z.string().optional(),
    role: z.string().default("BRANCH_OFFICER"),
});

// Change password schema
export const changePasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
});

// Reset password schema
export const resetPasswordSchema = z.object({
    token: z.string().min(1, "Token is required"),
    newPassword: passwordSchema,
});

export const refreshTokenSchema = z.object({
    refresh_token: z.string().min(1),
});

// Phone Auth Validation

export const phoneLoginSchema = z.object({
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
});

export const verifyOtpSchema = z.object({
    otpId: z.string().uuid("Invalid OTP ID format"),
    otpCode: z.string().length(6, "OTP must be 6 digits"),
});

export const resendOtpSchema = z.object({
    otpId: z.string().uuid("Invalid OTP ID format"),
});
