//This is a Barrel File that exports all the routes in the routes folder

import express from "express";
import authRoute from "./auth.route.js";
import userRequestRoute from "./user.request.route.js";
import officerRoute from "./officer.route.js";
const router = express.Router();

router.use("/auth", authRoute);
router.use("/user-request", userRequestRoute);
router.use("/officer", officerRoute);
// ghh

export default router;
