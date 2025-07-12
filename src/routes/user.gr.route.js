import { Router } from "express";
import { authenticateToken, DRMorHQMiddleware } from "../middlewares/auth.middleware.js";
import { generateReport } from "../controllers/user.gr.controller.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// HQ Report Generation route
router.get("/generate-report", DRMorHQMiddleware, generateReport);

export default router;
