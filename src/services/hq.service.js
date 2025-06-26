// src/services/drm.service.js
import prisma from "../prisma/index.js";

// Parse date from DD/MM/YY format and convert to ISO format with correct timezone
function formatDateForQuery(dateStr) {
    if (!dateStr) return null;

    const [day, month, year] = dateStr.split("/");
    // Convert YY to YYYY
    const fullYear = `20${year}`;

    // Format as YYYY-MM-DDT18:30:00.000Z
    return `${fullYear}-${month}-${day}T18:30:00.000Z`;
}

// Generate DRM Report based on filters
// export const generateHqReport = async (startDate, endDate, location, departments, blockTypes) => {
//     // Build where clause based on filters
//     const whereClause = {};

//     // Add filters only if they exist
//     const filters = [];

//     // Always filter for sanctioned and manager-accepted requests
//     // filters.push({ isSanctioned: true });
//     // filters.push({ managerAcceptance: true });

//     // Add date filter if provided
//     if (startDate && endDate) {
//         const formattedStartDate = formatDateForQuery(startDate);
//         const formattedEndDate = formatDateForQuery(endDate);

//         if (formattedStartDate && formattedEndDate) {
//             filters.push({
//                 date: {
//                     gte: formattedStartDate,
//                     lte: formattedEndDate,
//                 },
//             });
//         }
//     }

//     // majorSection filter
//     // if (majorSection && majorSection.length > 0) {
//     //     filters.push({
//     //         selectedSection: {
//     //             in: majorSection,
//     //         },
//     //     });
//     // }

//     // Add department filter if provided
//     // Map department values from query params to database values
//     if (departments && departments.length > 0) {
//         // Map from query params to DB values: Engineering -> ENGG, ST -> S&T
//         const mappedDepartments = departments.map((dept) => {
//             if (dept === "Engineering") return "ENGG";
//             if (dept === "ST") return "S&T";
//             if (dept === "TRD") return "TRD";
//             return dept; // Keep other values as is
//         });

//         // Corridor Outside Corridor Urgent Block
//         // "TRD" | "S&T" | "ENGG"
//         filters.push({
//             selectedDepartment: {
//                 in: mappedDepartments,
//             },
//         });
//     }

//     // Add blockType filter if provided
//     if (blockTypes && blockTypes.length > 0) {
//         // Map blockType values from query params to database values
//         // Urgent Block , Corridor , non-corridor
//         const mappedBlockTypes = blockTypes.map((blockType) => {
//             // Apply specific mappings
//             if (blockType === "Non-corridor") return "non-corridor";
//             if (blockType === "Emergency") return "Urgent Block";
//             if (blockType === "Corridor") return "Corridor";
//             if (blockType === "Mega") return "Mega";
//             return blockType;
//         });

//         filters.push({
//             corridorType: {
//                 in: mappedBlockTypes,
//             },
//         });
//     }

//     // Combine all filters with AND
//     whereClause.AND = filters;

//     console.log("Applied filters:", JSON.stringify(whereClause, null, 2));

//     const requestDetails = await prisma.request.findMany({
//         where: whereClause,
//         select: {
//             id: true,
//             selectedDepartment: true,
//             corridorType: true,
//             demandTimeFrom: true,
//             demandTimeTo: true,
//             status: true,
//         },
//     });

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const whereClauseNew = {
//         date: {
//             gte: today,
//         },
//     };

//     const requestDetailsForReport = await prisma.request.findMany({
//         where: whereClauseNew,
//         orderBy: {
//             date: "asc",
//         },
//         select: {
//             id: true,
//             date: true,
//             selectedSection: true, // Section
//             selectedDepartment: true,
//             demandTimeFrom: true,
//             demandTimeTo: true,
//             corridorType: true, // Type
//             status: true, // Status
//         },
//     });

//     // Calculate duration for each request in hours
//     // Only include the specified fields: Date, Section, Duration, Type, Status
//     const detailedData = requestDetailsForReport.map((req) => {
//         let durationInHours =
//             (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
//         durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;
//         return {
//             id: req.id,
//             Date: new Date(req.date).toLocaleDateString(),
//             Section: req.selectedSection,
//             Duration: durationInHours.toFixed(2),
//             Type: req.corridorType,
//             Status: req.status,
//         };
//     });

//     // Calculate aggregate metrics for all requests without grouping
//     // Calculate total demanded hours
//     let totalDemanded = 0;
//     requestDetails.forEach((req) => {
//         let durationInHours =
//             (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
//         durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;
//         totalDemanded += durationInHours;
//     });

//     // Create single metrics object with aggregated values
//     const aggregatedMetrics = {
//         Department: location,
//         TotalRequests: requestDetails.length,
//         Demanded: parseFloat(totalDemanded.toFixed(2)),
//         Approved: parseFloat((totalDemanded * 0.9).toFixed(2)), // placeholder: 90%
//         Granted: parseFloat((totalDemanded * 0.8).toFixed(2)), // placeholder: 80%
//         PercentGranted: 80, // placeholder
//         Availed: parseFloat((totalDemanded * 0.7).toFixed(2)), // placeholder: 70%
//         PercentAvailed: 70, // placeholder
//     };

//     return {
//         // Single aggregated metrics object in an array
//         pastBlockSummary: [aggregatedMetrics],
//         // Array with the detailed data, containing only specified fields
//         detailedData: detailedData,
//     };
// };

export const generateHqReport = async (
    startDate,
    endDate,
    location,
    departments,
    blockTypes,
    majorSections,
) => {
    const whereClause = {};
    const filters = [];

    // 📅 Date filter
    if (startDate && endDate) {
        const formattedStartDate = formatDateForQuery(startDate);
        const formattedEndDate = formatDateForQuery(endDate);
        if (formattedStartDate && formattedEndDate) {
            filters.push({
                date: {
                    gte: formattedStartDate,
                    lte: formattedEndDate,
                },
            });
        }
    }

    // 🏢 Department filter
    if (departments && departments.length > 0) {
        const mappedDepartments = departments.map((dept) => {
            if (dept === "Engineering") return "ENGG";
            if (dept === "ST") return "S&T";
            if (dept === "TRD") return "TRD";
            return dept;
        });

        filters.push({
            selectedDepartment: {
                in: mappedDepartments,
            },
        });
    }

    // 🚧 Block type filter
    if (
        blockTypes &&
        blockTypes.length > 0 &&
        !(blockTypes.length === 1 && blockTypes[0] === "All")
    ) {
        const mappedBlockTypes = blockTypes.map((blockType) => {
            if (blockType === "Non-corridor") return "Outside Corridor";
            if (blockType === "Emergency") return "Urgent Block";
            if (blockType === "Corridor") return "Corridor";
            if (blockType === "Mega") return "Mega";
            return blockType;
        });

        filters.push({
            corridorType: {
                in: mappedBlockTypes,
            },
        });
    }

    // 🧭 Major section filter
    if (
        majorSections &&
        majorSections.length > 0 &&
        !(majorSections.length === 1 && majorSections[0] === "All")
    ) {
        filters.push({
            selectedSection: {
                in: majorSections,
            },
        });
    }

    // Combine all filters
    whereClause.AND = filters;

    console.log("Applied filters:", JSON.stringify(whereClause, null, 2));

    // 📊 Summary data - update the query to include required fields
    const requestDetails = await prisma.request.findMany({
        where: whereClause,
        select: {
            id: true,
            selectedDepartment: true,
            corridorType: true,
            demandTimeFrom: true,
            demandTimeTo: true,
            status: true,
            sanctionedTimeFrom: true,
            sanctionedTimeTo: true,
            AvailedTimeFrom: true,
            AvailedTimeTo: true,
            isSanctioned: true,
            grantedFromTime: true,
            grantedToTime: true,
        },
    });

    // 📅 Today's date for upcoming blocks
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const whereClauseNew = {
        AND: [...filters],
    };

    // 📋 Detailed report - update the query to include required fields
    const requestDetailsForReport = await prisma.request.findMany({
        where: whereClauseNew,
        orderBy: {
            date: "asc",
        },
        select: {
            id: true,
            date: true,
            selectedSection: true,
            selectedDepartment: true,
            demandTimeFrom: true,
            demandTimeTo: true,
            corridorType: true,
            status: true,
            sanctionedTimeFrom: true,
            sanctionedTimeTo: true,
            AvailedTimeFrom: true,
            AvailedTimeTo: true,
            isSanctioned: true,
            grantedFromTime: true,
            grantedToTime: true,
        },
    });

    const detailedData = requestDetailsForReport.map((req) => {
        let durationInHours =
            (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
        durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;
        return {
            id: req.id,
            Date: new Date(req.date).toLocaleDateString(),
            Section: req.selectedSection,
            Duration: durationInHours.toFixed(2),
            Type: req.corridorType,
            Status: req.status,
        };
    });

    // 🧮 Calculate actual metrics
    let totalDemanded = 0;
    let totalSanctioned = 0;
    let totalGranted = 0;
    let totalAvailed = 0;

    requestDetails.forEach((req) => {
        // Calculate demanded hours
        let demandDurationInHours =
            (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
        demandDurationInHours =
            demandDurationInHours < 0 ? demandDurationInHours + 24 : demandDurationInHours;
        totalDemanded += demandDurationInHours;

        // Calculate sanctioned hours (if sanctioned)
        if (req.isSanctioned && req.sanctionedTimeFrom && req.sanctionedTimeTo) {
            let sanctionedDurationInHours =
                (new Date(req.sanctionedTimeTo) - new Date(req.sanctionedTimeFrom)) /
                (1000 * 60 * 60);
            sanctionedDurationInHours =
                sanctionedDurationInHours < 0
                    ? sanctionedDurationInHours + 24
                    : sanctionedDurationInHours;
            totalSanctioned += sanctionedDurationInHours;
        }
        // Calculate granted hours (if available)
        if (req.grantedFromTime && req.grantedToTime) {
            let grantedDurationInHours =
                (new Date(req.grantedToTime) - new Date(req.grantedFromTime)) / (1000 * 60 * 60);
            grantedDurationInHours =
                grantedDurationInHours < 0 ? grantedDurationInHours + 24 : grantedDurationInHours;
            totalGranted += grantedDurationInHours;
        }

        // Calculate availed hours (if available)
        if (req.AvailedTimeFrom && req.AvailedTimeTo) {
            let availedDurationInHours =
                (new Date(req.AvailedTimeTo) - new Date(req.AvailedTimeFrom)) / (1000 * 60 * 60);
            availedDurationInHours =
                availedDurationInHours < 0 ? availedDurationInHours + 24 : availedDurationInHours;
            totalAvailed += availedDurationInHours;
        }
    });

    totalDemanded = parseFloat(totalDemanded.toFixed(2));
    totalSanctioned = parseFloat(totalSanctioned.toFixed(2));
    totalGranted = parseFloat(totalGranted.toFixed(2));
    totalAvailed = parseFloat(totalAvailed.toFixed(2));

    // Calculate percentages
    const percentSanctioned =
        totalDemanded > 0 ? parseFloat(((totalSanctioned / totalDemanded) * 100).toFixed(2)) : 0;

    const percentGranted =
        totalDemanded > 0 ? parseFloat(((totalGranted / totalDemanded) * 100).toFixed(2)) : 0;

    const percentAvailed =
        totalSanctioned > 0 ? parseFloat(((totalAvailed / totalSanctioned) * 100).toFixed(2)) : 0;

    const aggregatedMetrics = {
        Department: location || "All Locations",
        TotalRequests: requestDetails.length,
        Demanded: totalDemanded,
        Approved: totalSanctioned,
        Granted: totalGranted || totalSanctioned,
        PercentGranted: percentGranted || percentSanctioned,
        PercentAvailed: percentAvailed,
    };

    return {
        pastBlockSummary: [aggregatedMetrics],
        detailedData,
    };
};
