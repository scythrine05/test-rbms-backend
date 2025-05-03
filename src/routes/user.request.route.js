import express from "express";
import * as requestController from "../controllers/user.request.controller.js";
import { authenticateToken, managerMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", authenticateToken, requestController.createRequest);
router.get("/user", authenticateToken, requestController.getUserRequests);
router.get("/:id", authenticateToken, requestController.getRequest);
router.put("/:id", authenticateToken, requestController.updateRequest);
router.delete("/:id", authenticateToken, requestController.deleteRequest);

// Manager routes
router.get("/manager/requests", authenticateToken, managerMiddleware, requestController.getManagerRequests);
router.put("/:id/status", authenticateToken, managerMiddleware, requestController.updateRequestStatus);

export default router;
