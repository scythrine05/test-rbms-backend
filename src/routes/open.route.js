import express from "express";
import {
    platterLabsApiKeyMiddleware,
    etsrApiKeyMiddleware,
} from "../middlewares/auth.middleware.js";
import {
    getSanctionedRequests,
    patchSanctionedRequest,
    patchTrainArrival,
} from "../controllers/open.controller.js";

const router = express.Router();

router.get("/sanctioned", platterLabsApiKeyMiddleware, getSanctionedRequests);
router.patch("/sanctioned", platterLabsApiKeyMiddleware, patchSanctionedRequest);
router.patch("/train-arrival", etsrApiKeyMiddleware, patchTrainArrival);

export default router;
