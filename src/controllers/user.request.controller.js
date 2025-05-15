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
        const request = await requestService.updateRequestStatus(
            id,
            status,
            req.user.id,
            ManagerResponse,
        );
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

export const getOtherRequests = async (req, res) => {
    try {
        const { selectedDepo } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!req.user || !req.user.email) {
            return res.status(400).json({
                status: false,
                message: "User email unavailable",
            });
        }
        const result = await requestService.getOtherRequests(
            selectedDepo,
            page,
            limit,
            req.user.email,
        );
        return successResponse(res, 200, "Other requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const getTrdRequests = async (req, res) => {
    try {
        const { selectedDepo } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (!req.user || !req.user.email) {
            return res.status(400).json({
                status: false,
                message: "User email unavailable",
            });
        }
        const result = await requestService.getTrdRequests(
            selectedDepo,
            page,
            limit,
            req.user.email,
        );
        return successResponse(res, 200, "TRD requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const updateOtherRequest = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        const { disconnectionRequestRejectRemarks } =
            requestValidation.updateOtherRequestSchema.parse(req.body);
        const acceptance = req.query.accept === "true";

        // For rejection, remarks are required
        if (!acceptance && !disconnectionRequestRejectRemarks) {
            return res.status(400).json({
                status: false,
                message: "Rejection remarks are required",
            });
        }

        const request = await requestService.updateOtherRequest(
            id,
            acceptance,
            disconnectionRequestRejectRemarks,
        );
        return successResponse(res, 200, "Request updated successfully", request);
    } catch (error) {
        handleError(error, res);
    }
};

export const getAdminUsersRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await requestService.getAdminPendingRequests(
            req.user.id,
            req.user.role,
            page,
            limit,
        );
        return successResponse(res, 200, "Manager's users requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

export const getManagerUsersRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await requestService.getManagerUsersRequests(
            req.user.id,
            req.user.role,
            page,
            limit,
        );
        return successResponse(res, 200, "Manager's users requests retrieved successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};

// export const acceptRequestByManager = async (req, res) => {
//     try {
//         const { id } = requestValidation.requestIdSchema.parse(req.params);
//         const request = await requestService.acceptRequestByManager(id, req.user.id);
//         return successResponse(res, 200, "Request accepted successfully", request);
//     } catch (error) {
//         handleError(error, res);
//     }
// };

export const acceptRequestByManager = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);

        const { isAccept } = req.body;

        const request = await requestService.acceptRequestByManager(id, req.user.id, isAccept);

        return successResponse(
            res,
            200,
            `Request ${isAccept ? "accepted" : "rejected"} successfully`,
            request,
        );
    } catch (error) {
        handleError(error, res);
    }
};

export const acceptRequestByAdmin = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        const acceptance = req.query.accept === "true";
        const request = await requestService.acceptRequestByAdmin(id, acceptance, req.user.id);
        return successResponse(res, 200, "Request accepted successfully", request);
    } catch (error) {
        handleError(error, res);
    }
};

export const getUsersByAdminId = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const result = await requestService.getUsersByAdminId(
            req.user.id,
            page,
            limit,
            startDate,
            endDate,
        );
        return successResponse(res, 200, "Users retrieved successfully", result);
    } catch (error) {
        console.log(error);
        handleError(error, res);
    }
};
