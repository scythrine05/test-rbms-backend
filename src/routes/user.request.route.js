import express from "express";
import * as requestController from "../controllers/user.request.controller.js";
import { adminMiddleware, authenticateToken, managerMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.post("/", authenticateToken, requestController.createRequest);
router.get("/user", authenticateToken, requestController.getUserRequests);
router.get("/user-data", authenticateToken, requestController.getUserRequestsData);

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

router.get("/admin/users-requests", authenticateToken, adminMiddleware, requestController.getAdminUsersRequests);

router.put("/manager/accept/:id", authenticateToken, managerMiddleware, requestController.acceptRequestByManager);

router.put("/admin/accept/:id", authenticateToken, adminMiddleware, requestController.acceptRequestByAdmin);
router.put(
  '/admin/approve-all-pending',
  authenticateToken,
  adminMiddleware,
  requestController.approveAllPendingRequests
);

router.post(
  "/admin/save-optimized-requests",
  authenticateToken,
  adminMiddleware,
  requestController.saveOptimizedRequests
);
router.put(
  "/admin/save-optimized-requests-status",
  authenticateToken,
  adminMiddleware,
  requestController.saveOptimizedRequestsStatus
);

router.get("/admin/approved", authenticateToken, adminMiddleware, requestController.getUsersByAdminId);
router.get("/admin/optimized",authenticateToken,adminMiddleware,requestController.getOptimizeData)

export default router;
