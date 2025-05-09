import express from "express";
import * as requestController from "../controllers/user.request.controller.js";
import { adminMiddleware, authenticateToken, managerMiddleware } from "../middlewares/auth.middleware.js";

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

// Get other requests
router.get("/other/:selectedDepo", authenticateToken, requestController.getOtherRequests);

// Update other request
router.put("/other/:id", authenticateToken, requestController.updateOtherRequest);

// Get all requests from manager's users
router.get("/manager/users-requests", authenticateToken, managerMiddleware, requestController.getManagerUsersRequests);

// Accept request by manager
router.put("/manager/accept/:id", authenticateToken, managerMiddleware, requestController.acceptRequestByManager);

router.put("/admin/accept/:id", authenticateToken, adminMiddleware, requestController.acceptRequestByAdmin);

router.get("/admin/approved", authenticateToken, adminMiddleware, requestController.getUsersByAdminId);

export default router;
