import * as authValidation from "../validations/auth.validation.js";
import * as authService from "../services/auth.service.js";
import * as tokenService from "../services/token.service.js";
import { handleError, successResponse } from "../utils/response.js";

export const login = async (req, res) => {
    try {
        const { email, password } = authValidation.loginSchema.parse(req.body);
        const result = await authService.login(email, password);
        return successResponse(res, 200, "Login successful", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const getRefreshToken = async (req, res) => {
    try {
        const { refresh_token } = authValidation.refreshTokenSchema.parse(req.body);
        const userId = await tokenService.verifyRefreshToken(refresh_token);
        await tokenService.revokeRefreshToken(refresh_token);
        const access_token = await tokenService.generateAccessToken(userId);
        const new_refresh_token = await tokenService.generateRefreshToken(userId);
        return successResponse(res, 200, "Token refreshed successfully", {
            access_token,
            refresh_token: new_refresh_token,
        });
    } catch (error) {
        handleError(error, res);
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await authService.getUserById(id);
        return successResponse(res, 200, "User retrieved successfully", user);
    } catch (error) {
        handleError(error, res);
    }
};

// Register user by manager controller
export const registerUserByManager = async (req, res) => {
    try {
        const data = authValidation.registerUserSchema.parse(req.body);
        const result = await authService.registerUserByManager(data, req.user.id);
        return successResponse(res, 201, "User registered successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Register manager by admin controller
export const registerManager = async (req, res) => {
    try {
        const data = authValidation.registerManagerSchema.parse(req.body);
        const result = await authService.registerManager(data, req.user.id);
        return successResponse(res, 201, "Manager registered successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Change password controller
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = authValidation.changePasswordSchema.parse(
            req.body,
        );
        await authService.changePassword(req.user.id, currentPassword, newPassword);
        return successResponse(res, 200, "Password changed successfully");
    } catch (error) {
        handleError(error, res);
    }
};

// Forgot password controller
export const forgotPassword = async (req, res) => {
    try {
        const { email } = authValidation.forgotPasswordSchema.parse(req.body);
        await authService.forgotPassword(email);
        return successResponse(res, 200, "Password reset email sent");
    } catch (error) {
        handleError(error, res);
    }
};

// Reset password controller
export const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = authValidation.resetPasswordSchema.parse(req.body);
        await authService.resetPassword(token, newPassword);
        return successResponse(res, 200, "Password reset successful");
    } catch (error) {
        handleError(error, res);
    }
};

export const getUsersByManagerId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await authService.getUsersByManagerId(req.user.id, page, limit);
        return successResponse(res, 200, "Users retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const getManagerByAdminId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await authService.getManagerByAdminId(req.user.id, page, limit);
        return successResponse(res, 200, "Manager retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        await authService.deleteUserById(id);
        return successResponse(res, 200, "User deleted successfully");
    } catch (error) {
        handleError(error, res);
    }
};

//Phone auth controller

export const phoneLogin = async (req, res) => {
    try {
        const { phone } = authValidation.phoneLoginSchema.parse(req.body);
        const result = await authService.phoneLogin(phone);
        return successResponse(res, 200, "OTP sent successfully", {
            phone_number: phone,
            otpId: result.otpId,
        });
    } catch (error) {
        handleError(error, res);
    }
};

export const verifyPhoneOtp = async (req, res) => {
    try {
        const { otpId, otpCode } = authValidation.verifyOtpSchema.parse(req.body);
        const result = await authService.verifyPhoneOtp(otpId, otpCode);
        return successResponse(res, 200, "OTP verified successfully", {
            data: {
                access_token: result.access_token,
                refresh_token: result.refresh_token,
            },
            user: result.user,
        });
    } catch (error) {
        handleError(error, res);
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { otpId } = authValidation.resendOtpSchema.parse(req.body);
        const result = await authService.resendOtp(otpId);
        return successResponse(res, 200, "OTP resent successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};
