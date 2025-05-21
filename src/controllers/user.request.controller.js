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
export const updatedSatus=async(req,res)=>{
    try{
        const{requestId,status,reason}=req.body;
        const request=await requestService.updatedSatus(requestId,status,reason)
        return successResponse(res,201,"Request updated successfully",request)
    }catch(error){
        handleError(error,res)
    }
}


export const userResponse=async(req,res)=>{
    try{
        const{requestId,userResponse,reason}=req.body;
        const request=await requestService.userResponse(requestId,userResponse,reason)
        return successResponse(res,201,"Request updated successfully",request)
    }catch(error){
        handleError(error,res)
    }
}

export const updateOptimizeTimes=async(req,res)=>{
    try{
        const{requestId,optimizeTimeFrom,optimizeTimeTo}=req.body;
        const request=await requestService.updateOptimizeTimes(requestId,optimizeTimeFrom,optimizeTimeTo)
        return successResponse(res,201,"Request updated successfully",request)
    }catch(error){
        handleError(error,res)
    }
}

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

// export const getUserRequestsData = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 30;
//         const result = await requestService.getUserRequestsData(req.user.id, page, limit);
//         return successResponse(res, 200, "User requests retrieved successfully", result);
//     } catch (error) {
//         handleError(error, res);
//     }
// };

export const getUserRequestsData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 30;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate ;

        const result = await requestService.getUserRequestsData(
            req.user.id,
            page,
            limit,
            startDate,
            endDate
        );

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

// export const getManagerUsersRequests = async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const result = await requestService.getManagerUsersRequests(
//             req.user.id,
//             req.user.role,
//             page,
//             limit,
//         );
//         return successResponse(res, 200, "Manager's users requests retrieved successfully", result);
//     } catch (error) {
//         handleError(error, res);
//     }
// };
export const getManagerUsersRequests = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const status = req.query.status;

        const result = await requestService.getManagerUsersRequests(
            req.user.id,
            req.user.role,
            page,
            limit,
            startDate,
            endDate,
            status
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

// export const acceptRequestByManager = async (req, res) => {
//     try {
//         const { id } = requestValidation.requestIdSchema.parse(req.params);

//         const { isAccept } = req.body;

//         const request = await requestService.acceptRequestByManager(id, req.user.id, isAccept);

//         return successResponse(
//             res,
//             200,
//             `Request ${isAccept ? "accepted" : "rejected"} successfully`,
//             request,
//         );
//     } catch (error) {
//         handleError(error, res);
//     }
// };
export const acceptRequestByManager = async (req, res) => {
    try {
        const { id } = requestValidation.requestIdSchema.parse(req.params);
        const { isAccept, remark } = req.body;

        const request = await requestService.acceptRequestByManager(id, req.user.id, isAccept, remark);

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
export const approveAllPendingRequests = async (req, res) => {
  try {
    const adminId = req.user.id; // Assuming user ID is available from auth middleware
    const result = await requestService.approveAllPendingRequests(adminId);
    return successResponse(res, 200, 'All pending requests approved successfully', result);
  } catch (error) {
    handleError(error, res);
  }
};




export const saveOptimizedRequests = async (req, res, next) => {
  try {
    // Validate input
    if (!req.body?.optimizedData) {
      return res.status(400).json({ 
        success: false, 
        message: "optimizedData is required in request body" 
      });
    }

    const { optimizedData } = req.body;

    if (!Array.isArray(optimizedData)) {
      return res.status(400).json({ 
        success: false, 
        message: "optimizedData must be an array" 
      });
    }

    // Validate each item has required fields with proper formats
    const validationErrors = [];
    optimizedData.forEach((item, index) => {
      if (!item.date || !item.demandTimeFrom || !item.demandTimeTo) {
        validationErrors.push(`Item ${index} is missing required time fields`);
      }
      
      // Validate time format (HH:MM)
      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (item.demandTimeFrom && !timeRegex.test(item.demandTimeFrom)) {
        validationErrors.push(`Item ${index} has invalid demandTimeFrom format (HH:MM required)`);
      }
      if (item.demandTimeTo && !timeRegex.test(item.demandTimeTo)) {
        validationErrors.push(`Item ${index} has invalid demandTimeTo format (HH:MM required)`);
      }
      
      // Validate date format (YYYY-MM-DD)
      if (item.date && !/^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
        validationErrors.push(`Item ${index} has invalid date format (YYYY-MM-DD required)`);
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors
      });
    }

    const result = await requestService.saveOptimizedData(optimizedData);
    res.status(200).json(result);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to save optimized requests'
    });
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
export const getOptimizeData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const result = await requestService.getOptimizeData(
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

export const saveOptimizedRequestsStatus = async (req, res) => {
  try {
    const { requestIds } = req.body;

    if (!Array.isArray(requestIds)) {
      return res.status(400).json({
        success: false,
        message: "'requestIds' array is missing or invalid",
      });
    }

    if (requestIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid request IDs provided",
      });
    }

    // Call the service function to update the status
    const result = await requestService.saveOptimizedRequestsStatus(requestIds);
    res.status(200).json({
      success: true,
      message: "Optimized status updated successfully",
      result,
    });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update optimized status",
    });
  }
};


