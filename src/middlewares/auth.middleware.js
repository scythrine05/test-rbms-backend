import jwt from "jsonwebtoken";
import prisma from "../prisma/index.js";

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid token"
        });
    }
};


export const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
            return res.status(403).json({
                status: false,
                message: "Access denied. Admin privileges required."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid token"
        });
    }
};


export const managerMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                status: false,
                message: "No token provided"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        });

        if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
            return res.status(403).json({
                status: false,
                message: "Access denied. Manager privileges required."
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: "Invalid token"
        });
    }
};
