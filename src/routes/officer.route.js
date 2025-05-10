import { Router } from "express";
import {
    getBranchOfficers,
    getSeniorOfficers,
    getJuniorOfficers,
    createNewOfficer,
    updateExistingOfficer,
    deleteExistingOfficer,
    getAvailableSeniors,
    getAvailableJuniors
} from "../controllers/officer.controller.js";
import { authenticateToken, managerMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validateRequest.js";
import { officerValidation } from "../validations/officer.validation.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Branch Officer Routes (MANAGER role)
router.get("/branch", managerMiddleware, getBranchOfficers);
router.get("/branch/available-seniors", managerMiddleware, getAvailableSeniors);

// Senior Officer Routes
router.get("/senior", managerMiddleware, getSeniorOfficers);
router.get("/senior/available-juniors", managerMiddleware, getAvailableJuniors);

// Junior Officer Routes
router.get("/junior", managerMiddleware, getJuniorOfficers);

// Common CRUD Routes (with role-based access control)
router.post(
    "/",
    managerMiddleware,
    createNewOfficer
);

router.patch(
    "/:id",
    managerMiddleware,
    validateRequest(officerValidation.updateOfficer),
    updateExistingOfficer
);

router.delete(
    "/:id",
    managerMiddleware,
    deleteExistingOfficer
);

export default router;
