import * as requestService from "../services/user.request.service.js";
import * as requestValidation from "../validations/user.request.validation.js";
import { handleError, successResponse } from "../utils/response.js";

export const createRequest = async (req, res) => {
    try {
        const data = requestValidation.createRequestSchema.parse(req.body);
        const request = await requestService.createRequest(data, req.user.id);
        return successResponse(res, 201, "Request created successfully", request);
    } catch (error) {
        handleError(error, res);
    }
};

export const getRequest = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        const request = await requestService.getRequestById(id);
        return successResponse(res, 200, "Request retrieved successfully", request);
    } catch (error) {
        handleError(error, res);
    }
};

export const updateRequest = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        console.log(id, req.body);
        const data = requestValidation.updateRequestSchema.parse(req.body);

        const request = await requestService.updateRequest(id, data);
        return successResponse(res, 200, "Request updated successfully", request);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        await requestService.deleteRequest(id);
        return successResponse(res, 200, "Request deleted successfully");
    } catch (error) {
        handleError(error, res);
    }
};

export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        const { status, ManagerResponse } = requestValidation.requestStatusSchema.parse(req.body);
        const request = await requestService.updateRequestStatus(id, status, req.user.id, ManagerResponse);
        return successResponse(res, 200, "Request status updated successfully", request);
    } catch (error) {
        handleError(error, res);
    }
};

export const getUserRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await requestService.getUserRequests(req.user.id, page, limit);
        return successResponse(res, 200, "User requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const getManagerRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await requestService.getManagerRequests(req.user.id, page, limit);
        return successResponse(res, 200, "Manager requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};
