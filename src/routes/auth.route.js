import express from "express";
import * as authController from "../controllers/auth.controller.js";
import { adminMiddleware, authenticateToken, managerMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", authController.login);
router.post("/refresh-token", authController.getRefreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Protected routes
router.post("/change-password", authenticateToken, authController.changePassword);
router.get("/user/:id", authenticateToken, authController.getUserById);

// Manager routes
router.post("/register-user", authenticateToken, managerMiddleware, authController.registerUserByManager);

// Admin routes
router.post("/register-manager", authenticateToken, adminMiddleware, authController.registerManager);

export default router;
