
import { hashPassword, comparePassword } from "../utils/password.utils.js";
import { generateResetToken, getTokenExpiry } from "../utils/token.utils.js";
import { sendPasswordResetEmail } from "../utils/email.utils.js";
import * as tokenService from "./token.service.js";
import prisma from "../prisma/index.js";
const formatUserData = (user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    phone: user.phone,
    location: user.location,
});

// Login service
export const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid credentials");
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) throw new Error("Invalid credentials");
    const access_token = await tokenService.generateAccessToken(user.id);
    const refresh_token = await tokenService.generateRefreshToken(user.id);
    return { access_token, refresh_token, user: formatUserData(user) };
};

// Get user by ID service
export const getUserById = async (userId) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            phone: true,
            location: true,
        }
    });
    if (!user) throw new Error("User not found");
    return user;
};

// Register user by manager service
export const registerUserByManager = async (data, managerId) => {
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            role: "USER",
            managerId
        }
    });
    return formatUserData(user);
};

// Register manager by admin service
export const registerManager = async (data) => {
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            role: "MANAGER"
        }
    });
    return formatUserData(user);
};

// Change password service
export const changePassword = async (userId, currentPassword, newPassword) => {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");
    const isPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isPasswordValid) throw new Error("Current password is incorrect");
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword }
    });
};

// Forgot password service
export const forgotPassword = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");
    const resetToken = generateResetToken();
    const resetTokenExpiry = getTokenExpiry();
    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry }
    });
    await sendPasswordResetEmail(email, resetToken);
};

// Reset password service
export const resetPassword = async (token, newPassword) => {
    const user = await prisma.user.findFirst({
        where: {
            resetToken: token,
            resetTokenExpiry: { gt: new Date() }
        }
    });
    if (!user) throw new Error("Invalid or expired token");
    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiry: null
        }
    });
};
