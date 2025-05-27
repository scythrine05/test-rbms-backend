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
    depot: user.depot
});

// Login service
export const login = async (email, password) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("No user found");
    const isPasswordValid = await comparePassword(password, user.password);
    console.log(password, user.password);
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
    // Check if manager already has a JUNIOR_OFFICER or SENIOR_OFFICER
    const existingOfficer = await prisma.user.findFirst({
        where: {
            managerId,
            role: {
                in: ["JUNIOR_OFFICER", "SENIOR_OFFICER"]
            }
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });

    if (existingOfficer) {
        throw new Error(`You already have a ${existingOfficer.role} with email: ${existingOfficer.email}`);
    }


    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            managerId
        }
    });
    return formatUserData(user);
};

// Register manager by admin service
export const registerManager = async (data, adminId) => {
    const hashedPassword = await hashPassword(data.password);
    const user = await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            adminId: adminId
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

export const getUsersByManagerId = async (managerId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: { managerId },
            select: {
                id: true,
                name: true,
                email: true,
                depot: true,
                department: true,
                phone: true,
                role: true,
                location: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({ where: { managerId } })
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const getManagerByAdminId = async (adminId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: { adminId },
            select: {
                id: true,
                name: true,
                email: true,
                depot: true,
                department: true,
                phone: true,
                role: true,
                location: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({ where: { adminId } })
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const deleteUserById = async (id) => {
    const user = await prisma.user.findUnique({
        where: { id }
    });

    if (!user) {
        throw new Error("User not found");
    }

    return await prisma.user.delete({
        where: { id }
    });
};
