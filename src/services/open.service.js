import prisma from "../prisma/index.js";

export const fetchSanctionedRequests = async (startDate, endDate) => {
    const where = {
        isSanctioned: true,
    };

    if (startDate) {
        where.sanctionedTimeFrom = { gte: new Date(startDate) };
    }
    if (endDate) {
        where.sanctionedTimeTo = Object.assign(where.sanctionedTimeTo || {}, {
            lte: new Date(endDate),
        });
    }

    
    return await prisma.request.findMany({
        where,
        select: {
            id: true,
            date: true,
            selectedDepartment: true,
            selectedSection: true,
            stationID: true,
            missionBlock: true,
            workType: true,
            activity: true,
            sanctionedTimeFrom: true,
            sanctionedTimeTo: true,
            availedResponse: true,
            status: true,
            userStatus: true,
            remarkByManager: true,
            userResponse: true,
            createdAt: true,
            workLocationFrom: true,
            workLocationTo: true,
            freshCautionRequired: true,
            freshCautionSpeed: true,
            freshCautionLocationFrom: true,
            freshCautionLocationTo: true,
            adjacentLinesAffected: true,
            sigDisconnection: true,
            elementarySection: true,
            elementarySectionTo: true,
            powerBlockRequired: true,
            userId: true,
            user: {
                select: {
                    name: true,
                    phone: true,
                },
            },
        },
        orderBy: {
            sanctionedTimeFrom: "asc",
        },
    });
};

export const updateSanctionedRequestAvailed = async (id, availed, additionalData) => {
    const existingRequest = await prisma.request.findUnique({
        where: { id },
        select: {
            isSanctioned: true,
        },
    });

    if (!existingRequest) {
        throw new Error("Request not found");
    }

    if (!existingRequest.isSanctioned) {
        throw new Error("Cannot update availedResponse for an unsanctioned request");
    }

    // Prepare update data
    const updateData = {
        availedResponse: String(availed),
    };

    // Handle availed=true case
    if (availed === true) {
        updateData.AvailedTimeFrom = additionalData.availedTimeFrom 
            ? new Date(additionalData.availedTimeFrom) 
            : null;
        updateData.AvailedTimeTo = additionalData.availedTimeTo 
            ? new Date(additionalData.availedTimeTo) 
            : null;
        updateData.availedRemarks = null; // Clear remarks if availed is true
    } 
    // Handle availed=false case
    else {
        updateData.availedRemarks = additionalData.availedRemarks || null;
        updateData.AvailedTimeFrom = null; // Clear times if availed is false
        updateData.AvailedTimeTo = null;
    }

    const updatedRequest = await prisma.request.update({
        where: { id },
        data: updateData,
        select: {
            id: true,
            availedResponse: true,
            AvailedTimeFrom: true,
            AvailedTimeTo: true,
            availedRemarks: true,
        },
    });

    return updatedRequest;
};

// export const updateSanctionedRequestAvailed = async (id, availedResponseValue) => {
//     const existingRequest = await prisma.request.findUnique({
//         where: { id },
//         select: {
//             isSanctioned: true,
//         },
//     });

//     if (!existingRequest) {
//         throw new Error("Request not found");
//     }

//     if (!existingRequest.isSanctioned) {
//         throw new Error("Cannot update availedResponse for an unsanctioned request");
//     }

//     const updatedRequest = await prisma.request.update({
//         where: { id },
//         data: {
//             availedResponse: String(availedResponseValue),
//         },
//         select: {
//             id: true,
//             availedResponse: true,
//             sanctionedTimeFrom: true,
//             sanctionedTimeTo: true,
//         },
//     });

//     return updatedRequest;
// };
