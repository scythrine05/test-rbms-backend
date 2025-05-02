import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendPasswordResetEmail = async (email, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
        to: email,
        subject: "Password Reset Request",
        html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
            <p>This link will expire in 1 hour</p>
        `
    });
}; 