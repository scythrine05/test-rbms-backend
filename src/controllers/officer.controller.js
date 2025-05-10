// src/controllers/officer.controller.js
import {
    getOfficersUnderBranch,
    getOfficersUnderAdmin,
    getOfficersUnderSenior,
    getUsersUnderJunior,
    createOfficer,
    updateOfficer,
    deleteOfficer,
    getAvailableBranchOfficers,
    getAvailableSeniorOfficers,
    getAvailableJuniorOfficers,
    getUsersUnderSeniorOfficer
} from "../services/officer.service.js";
import { handleError, successResponse } from "../utils/response.js";

// Get all officers under a branch officer
export const getBranchOfficers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const branchOfficerId = req.user.id;

        const result = await getOfficersUnderBranch(branchOfficerId, parseInt(page), parseInt(limit));
        return successResponse(res, 200, "Officers retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Get all officers under an admin
export const getAdminOfficers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const adminId = req.user.id;
        const result = await getOfficersUnderAdmin(adminId, parseInt(page), parseInt(limit));
        return successResponse(res, 200, "Officers retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Get all officers under a senior officer
export const getSeniorOfficers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const seniorOfficerId = req.user.id;
        const result = await getUsersUnderSeniorOfficer(seniorOfficerId, parseInt(page), parseInt(limit));
        return successResponse(res, 200, "Officers retrieved successfully", result.users);
    } catch (error) {
        handleError(error, res);
    }
};

// Get all users under a junior officer
export const getJuniorOfficers = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const juniorOfficerId = req.user.id;

        const result = await getUsersUnderJunior(juniorOfficerId, parseInt(page), parseInt(limit));
        return successResponse(res, 200, "Users retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Create a new officer
export const createNewOfficer = async (req, res) => {
    try {
        const { name, email, password, role, depot, department, phone, location, adminId, managerId, seniorOfficerId } = req.body;
        const creatorId = req.user.id;
        const creatorRole = req.user.role;

        const result = await createOfficer(
            { name, email, password, role, department, depot, phone, location, adminId, managerId },
            creatorId,
            creatorRole,
            seniorOfficerId
        );

        return successResponse(res, 201, "Officer created successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Update an officer
export const updateExistingOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        const updaterId = req.user.id;
        const updaterRole = req.user.role;
        const updateData = req.body;

        const result = await updateOfficer(id, updateData, updaterId, updaterRole);
        return successResponse(res, 200, "Officer updated successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Delete an officer
export const deleteExistingOfficer = async (req, res) => {
    try {
        const { id } = req.params;
        const deleterId = req.user.id;
        const deleterRole = req.user.role;

        const result = await deleteOfficer(id, deleterId, deleterRole);
        return successResponse(res, 200, "Officer deleted successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Get available branch officers for an admin
export const getAvailableBranchOfficersForAdmin = async (req, res) => {
    try {
        const adminId = req.user.id;

        const result = await getAvailableBranchOfficers(adminId);
        return successResponse(res, 200, "Branch officers retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Get available senior officers for a branch officer
export const getAvailableSeniors = async (req, res) => {
    try {
        const branchOfficerId = req.user.id;


        const result = await getAvailableSeniorOfficers(branchOfficerId);
        return successResponse(res, 200, "Senior officers retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// Get available junior officers for a senior officer
export const getAvailableJuniors = async (req, res) => {
    try {
        const seniorOfficerId = req.query.seniorOfficerId ? req.query.seniorOfficerId : req.user.id;
        const result = await getAvailableJuniorOfficers(seniorOfficerId);
        return successResponse(res, 200, "Junior officers retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};