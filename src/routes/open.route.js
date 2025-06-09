import express from "express";
import { apiKeyMiddleware } from "../middlewares/auth.middleware.js";
import { getSanctionedRequests, patchSanctionedRequest } from "../controllers/open.controller.js";

const router = express.Router();

router.use(apiKeyMiddleware);

router.get("/sanctioned", getSanctionedRequests);
router.patch("/sanctioned", patchSanctionedRequest);

export default router;
