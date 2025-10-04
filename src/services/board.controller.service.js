import prisma from "../prisma/index.js";

export const getSanctionedRequestsByTimeRange = async (hours) => {
    // Validate hours input
    if (![8, 16, 24].includes(hours)) {
        throw new Error("Invalid hours value. Must be 8, 16, or 24.");
    }

    // Get current time
    const now = new Date();

    // Calculate end date/time (X hours from now)
    const endDate = new Date(now);
    endDate.setHours(now.getHours() + hours);

    try {
        // Get today's date at the start of the day
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);

        // Get date for tomorrow and day after tomorrow at the start of the day
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

        const requests = await prisma.request.findMany({
            where: {
                isSanctioned: true,
                OR: [
                    // 1️⃣ Jobs scheduled for today that start in the future (within window)
                    {
                        date: today,
                        sanctionedTimeFrom: {
                            gte: now,
                            lt: endDate,
                        },
                    },
                    // 2️⃣ Jobs scheduled for tomorrow that start within our window
                    {
                        date: tomorrow,
                        sanctionedTimeFrom: {
                            lt: endDate, // Only if they start before our end window
                        },
                    },
                ],
            },
            select: {
                id: true,
                date: true,
                divisionId: true,
                corridorType: true,
                selectedDepartment: true,
                selectedSection: true,
                stationID: true,
                missionBlock: true,
                workType: true,
                activity: true,
                workLocationFrom: true,
                workLocationTo: true,
                sanctionedTimeFrom: true,
                sanctionedTimeTo: true,
                processedLineSections: true,
                requestremarks: true,
                sanctionedRemarks: true,
                overAllStatus: true,
                status: true,
                createdAt: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        department: true,
                        phone: true,
                    },
                },
            },
            orderBy: {
                sanctionedTimeFrom: "asc",
            },
        });

        return {
            total: requests.length,
            requests: requests,
        };
    } catch (error) {
        console.error("Error fetching sanctioned requests:", error);
        throw new Error("Failed to fetch sanctioned requests");
    }
};
