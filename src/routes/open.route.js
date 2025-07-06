import express from "express";
import { apiKeyMiddleware } from "../middlewares/auth.middleware.js";
import {
    getSanctionedRequests,
    patchSanctionedRequest,
    patchTrainArrival,
} from "../controllers/open.controller.js";

const router = express.Router();

router.use(apiKeyMiddleware);

router.get("/sanctioned", getSanctionedRequests);
router.patch("/sanctioned", patchSanctionedRequest);
router.patch("/train-arrival", patchTrainArrival);

export default router;
