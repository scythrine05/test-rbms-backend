import { Router } from "express";
import { generateReport } from "../controllers/hq.controller.js";
import { authenticateToken, DRMorHQMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// HQ Report Generation route
router.get("/generate-report", DRMorHQMiddleware, generateReport);

export default router;
