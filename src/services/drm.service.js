// src/services/hq.service.js
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

// Generate HQ Report based on filters
export const generateDrmReport = async (
    startDate,
    endDate,
    majorSections,
    departments,
    blockTypes,
) => {
    // Build where clause based on filters
    const whereClause = {};

    // Add filters only if they exist
    const filters = [];

    // Add date filter if provided
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

    // Add mission block filter if provided (majorSections represents mission blocks)
    if (majorSections && majorSections.length > 0) {
        filters.push({
            selectedSection: {
                in: majorSections,
            },
        });
    }

    // Add department filter if provided
    if (departments && departments.length > 0) {
        // Map from query params to DB values: Engineering -> ENGG, ST -> S&T
        const mappedDepartments = departments.map((dept) => {
            if (dept === "Engineering") return "ENGG";
            if (dept === "ST") return "S&T";
            return dept; // Keep other values as is
        });

        filters.push({
            selectedDepartment: {
                in: mappedDepartments,
            },
        });
    }

    // Add blockType filter if provided
    if (blockTypes && blockTypes.length > 0) {
        // Map blockType values from query params to database values
        const mappedBlockTypes = blockTypes.map((blockType) => {
            // Apply specific mappings
            if (blockType === "Non-corridor") return "non-corridor";
            if (blockType === "Emergency") return "Urgent Block";
            if (blockType === "Corridor") return "corridor";
            return blockType; // Keep other values as is
        });

        filters.push({
            corridorType: {
                in: mappedBlockTypes,
            },
        });
    }

    // Combine all filters with AND
    whereClause.AND = filters;

    // Safely log the filter conditions without assuming specific index positions
    console.log("Applied HQ filters:", JSON.stringify(whereClause, null, 2));

    // Get detailed data for each request matching the criteria to calculate metrics
    const requestDetails = await prisma.request.findMany({
        where: whereClause,
        select: {
            id: true,
            missionBlock: true,
            selectedSection: true,
            selectedDepartment: true,
            corridorType: true,
            demandTimeFrom: true,
            demandTimeTo: true,
            status: true,
        },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const whereClauseNew = {
        date: {
            gte: today,
        },
        selectedSection: {
            in: majorSections,
        },
    };

    // Get additional details for reporting purposes - using the same filter as the main query
    const requestDetailsForReport = await prisma.request.findMany({
        where: whereClauseNew,
        orderBy: {
            date: "asc", // sorted by date, oldest first
        },
        select: {
            id: true,
            date: true,
            missionBlock: true, // Mission Block
            selectedDepartment: true,
            selectedSection: true,
            demandTimeFrom: true,
            demandTimeTo: true,
            corridorType: true, // Type
            status: true, // Status
        },
    });

    // Calculate duration for each request in hours
    // Include the fields: Date, MissionBlock, Duration, Type, Status
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

    // Calculate aggregate metrics for all requests without grouping
    // Calculate total demanded hours
    // let totalDemanded = 0;
    // requestDetails.forEach((req) => {
    //     let durationInHours =
    //         (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
    //     durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;
    //     totalDemanded += durationInHours;
    // });

    // // Create single metrics object with aggregated values
    // const aggregatedMetrics = {
    //     Department: majorSections.join(", "),
    //     TotalRequests: requestDetails.length,
    //     Demanded: parseFloat(totalDemanded.toFixed(2)),
    //     Approved: parseFloat((totalDemanded * 0.9).toFixed(2)), // placeholder: 90%
    //     Granted: parseFloat((totalDemanded * 0.8).toFixed(2)), // placeholder: 80%
    //     PercentGranted: 80, // placeholder
    //     Availed: parseFloat((totalDemanded * 0.7).toFixed(2)), // placeholder: 70%
    //     PercentAvailed: 70, // placeholder
    // };

    const sectionDurations = {}; // { majorSection: totalDuration }
    console.log(requestDetails.length);

    // Ensure all majorSections are represented, even if no data
    // Create a set of all expected major sections
    const allMajorSections = new Set(majorSections); // assuming majorSections is an array parameter

    requestDetails.forEach((req) => {
        const section = req.majorSection; // or req.majorsection depending on your data
        let durationInHours =
            (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
        durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;

        if (!sectionDurations[section]) {
            sectionDurations[section] = {
                totalDemanded: 0,
                totalRequests: 0,
            };
        }

        sectionDurations[section].totalDemanded += durationInHours;
        sectionDurations[section].totalRequests += 1;
    });
    console.log(requestDetails.length);

    // Create summary per majorSection and add a total summary
    const pastBlockSummary = [];
    // First, add entries for all expected major sections
    allMajorSections.forEach((section) => {
        // Count requests for this section
        const sectionRequests = requestDetails.filter((req) => req.selectedSection === section);
        const totalRequests = sectionRequests.length;

        // Calculate total demanded hours for this section
        let totalDemanded = 0;
        sectionRequests.forEach((req) => {
            let durationInHours =
                (new Date(req.demandTimeTo) - new Date(req.demandTimeFrom)) / (1000 * 60 * 60);
            durationInHours = durationInHours < 0 ? durationInHours + 24 : durationInHours;
            totalDemanded += durationInHours;
        });

        totalDemanded = parseFloat(totalDemanded.toFixed(2));
        const approved = parseFloat((totalDemanded * 0.9).toFixed(2)); // placeholder: 90%
        const granted = parseFloat((totalDemanded * 0.8).toFixed(2)); // placeholder: 80%
        const availed = parseFloat((totalDemanded * 0.7).toFixed(2)); // placeholder: 70%

        // Create summary object for this section
        pastBlockSummary.push({
            Department: section,
            TotalRequests: totalRequests,
            Demanded: totalDemanded,
            Approved: approved,
            Granted: granted,
            PercentGranted: totalDemanded > 0 ? 80 : 0, // placeholder
            Availed: availed,
            PercentAvailed: totalDemanded > 0 ? 70 : 0, // placeholder
        });
    });

    return {
        // Single aggregated metrics object with Department-wise data
        pastBlockSummary: pastBlockSummary,
        // Array with the detailed data, containing specific fields
        detailedData: detailedData,
    };
};
