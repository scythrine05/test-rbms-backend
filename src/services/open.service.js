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
        },
        orderBy: {
            sanctionedTimeFrom: "asc",
        },
    });
};

export const updateSanctionedRequestAvailed = async (id, availedResponseValue) => {
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

    const updatedRequest = await prisma.request.update({
        where: { id },
        data: {
            availedResponse: availedResponseValue,
        },
        select: {
            id: true,
            availedResponse: true,
            sanctionedTimeFrom: true,
            sanctionedTimeTo: true,
        },
    });

    return updatedRequest;
};
