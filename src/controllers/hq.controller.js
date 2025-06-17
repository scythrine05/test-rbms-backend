// src/controllers/hq.controller.js
import { generateHqReport } from "../services/hq.service.js";
import { handleError, successResponse } from "../utils/response.js";

// Generate HQ Report
export const generateReport = async (req, res) => {
    try {
        const { startDate, endDate, majorSections, department, blockType } = req.query;
        console.log(startDate, endDate, majorSections, department, blockType);
        // Parse query parameters
        const majorSectionsFilter = majorSections ? majorSections.split(",") : [];
        const departmentFilter = department ? department.split(",") : [];
        const blockTypeFilter = blockType ? blockType.split(",") : [];

        // Get the report data from the service
        const result = await generateHqReport(
            startDate,
            endDate,
            majorSectionsFilter,
            departmentFilter,
            blockTypeFilter,
        );

        return successResponse(res, 200, "Report generated successfully", result);
    } catch (error) {
        handleError(error, res);
    }
};
