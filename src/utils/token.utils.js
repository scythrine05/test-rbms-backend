import crypto from "crypto";

export const generateResetToken = () => {
    return crypto.randomBytes(32).toString("hex");
};

export const getTokenExpiry = () => {
    return new Date(Date.now() + 3600000); // 1 hour
};

export const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
