import prisma from "../prisma/index.js";

export const createRequest = async (data, userId) => {
    return await prisma.request.create({
        data: {
            ...data,
            userId,
            status: "PENDING"
        }
    });
};

export const getRequestById = async (id) => {
    const request = await prisma.request.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            },
            manager: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true
                }
            }
        }
    });
    if (!request) throw new Error("Request not found");
    return request;
};

export const updateRequest = async (id, data) => {
    return await prisma.request.update({
        where: { id },
        data
    });
};

export const deleteRequest = async (id) => {
    return await prisma.request.delete({
        where: { id }
    });
};

export const updateRequestStatus = async (id, status, managerId, ManagerResponse) => {
    return await prisma.request.update({
        where: { id },
        data: {
            status,
            managerId,
            ManagerResponse
        }
    });
};

export const getUserRequests = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.request.count({ where: { userId } })
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const getManagerRequests = async (managerId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: { managerId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                },
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.request.count({ where: { managerId } })
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};
