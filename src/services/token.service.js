import prisma from "../prisma/index.js";
import { generateToken, verifyToken } from "../utils/jwt.utils.js";


export const generateAccessToken = (userId) => {
    return generateToken({ id: userId });
};

export const generateRefreshToken = async (userId) => {
    const token = generateToken({ id: userId });
    await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
    });
    return token;
};

export const verifyRefreshToken = async (token) => {
    const decoded = verifyToken(token);
    const refreshToken = await prisma.refreshToken.findFirst({
        where: {
            token,
            userId: decoded.id,
            expiresAt: { gt: new Date() }
        }
    });
    if (!refreshToken) throw new Error("Invalid or expired refresh token");
    return decoded.id;
};

export const revokeRefreshToken = async (token) => {
    await prisma.refreshToken.deleteMany({
        where: { token }
    });
};
