import {
    fetchSanctionedRequests,
    updateSanctionedRequestAvailed,
} from "../services/open.service.js";
import {
    getSanctionedRequestsSchema,
    patchSanctionedRequestSchema,
} from "../validations/open.validation.js";
import { handleError, successResponse } from "../utils/response.js";

export const getSanctionedRequests = async (req, res) => {
    try {
        const { start_date, end_date } = getSanctionedRequestsSchema.parse(req.query);
        const sanctionedRequests = await fetchSanctionedRequests(start_date, end_date);
        return successResponse(
            res,
            200,
            "Sanctioned requests fetched successfully",
            sanctionedRequests,
        );
    } catch (error) {
        handleError(error, res);
    }
};

export const patchSanctionedRequest = async (req, res) => {
    try {
        // Get ID from query params
        const { id } = patchSanctionedRequestSchema.pick({ id: true }).parse(req.query);

        // Get other fields from body
        const {
            availed,
            availedTimeFrom,
            availedTimeTo,
            availedRemarks,
            grantedFromTime,
            grantedToTime,
        } = patchSanctionedRequestSchema.omit({ id: true }).parse(req.body);

        const updatedRequest = await updateSanctionedRequestAvailed(id, availed, {
            availedTimeFrom,
            availedTimeTo,
            availedRemarks,
            grantedFromTime,
            grantedToTime,
        });

        return successResponse(res, 200, "Sanctioned request updated successfully", updatedRequest);
    } catch (error) {
        handleError(error, res);
    }
};

// export const patchSanctionedRequest = async (req, res) => {
//     try {
//         const { id } = patchSanctionedRequestSchema.pick({ id: true }).parse(req.query);
//         const { availed } = patchSanctionedRequestSchema.pick({ availed: true }).parse(req.body);

//         const updatedRequest = await updateSanctionedRequestAvailed(id, availed);
//         return successResponse(res, 200, "Sanctioned request updated successfully", updatedRequest);
//     } catch (error) {
//         handleError(error, res);
//     }
// };
