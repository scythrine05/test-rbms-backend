import prisma from "../prisma/index.js";

export const createRequest = async (data, userId) => {

    return await prisma.request.create({
        data: {
            ...data,
            userId,
            status: "PENDING"
        }
    })
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
            //     manager: {
            //         select: {
            //             id: true,
            //             name: true,
            //             email: true,
            //             role: true
            //         }
            //     }
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
            // include: {
            // user: {
            //     select: {
            //         id: true,
            //         name: true,
            //         email: true,
            //         role: true
            //     }
            // },
            // manager: {
            //     select: {
            //         id: true,
            //         name: true,
            //         email: true,
            //         role: true
            //     }
            // }
            // },
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

export const getOtherRequests = async (selectedDepo, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: {
                managerAcceptance: true,
                sntDisconnectionRequired: true,
                selectedDepo: selectedDepo
            },
            // include: {
            //     user: {
            //         select: {
            //             id: true,
            //             name: true,
            //             email: true,
            //             role: true
            //         }
            //     },
            // },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.request.count({
            where: {
                managerAcceptance: true,
                sntDisconnectionRequired: true,
                selectedDepo: selectedDepo
            }
        })
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const updateOtherRequest = async (id, acceptance) => {
    console.log(acceptance ? "ACCEPTED" : "REJECTED")
    return await prisma.request.update({
        where: { id },
        data: {
            DisconnAcceptance: acceptance ? "ACCEPTED" : "REJECTED"
        }
    });
};

export const getManagerUsersRequests = async (managerId, role, page = 1, limit = 10) => {
    let finalManagerId = managerId;

    // If the user is an officer, get their manager's ID
    if (role === 'JUNIOR_OFFICER' || role === 'SENIOR_OFFICER') {
        const subManager = await prisma.user.findUnique({
            where: { id: managerId },
            select: { managerId: true }
        });

        if (!subManager || !subManager.managerId) {
            throw new Error("No manager assigned to this officer");
        }

        finalManagerId = subManager.managerId;
    } else if (role === 'ADMIN') {
        // For admin, get all managers under them
        const managers = await prisma.user.findMany({
            where: {
                adminId: managerId,
                role: 'BRANCH_OFFICER'
            },
            select: { id: true }
        });

        if (!managers || managers.length === 0) {
            throw new Error("No managers found under this admin");
        }

        // Get all users under these managers
        const users = await prisma.user.findMany({
            where: {
                managerId: {
                    in: managers.map(m => m.id)
                }
            },
            select: { id: true }
        });

        const userIds = users.map(user => user.id);

        const skip = (page - 1) * limit;
        const [requests, total] = await Promise.all([
            prisma.request.findMany({
                where: {
                    userId: { in: userIds }
                },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                            depot: true,
                            department: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit
            }),
            prisma.request.count({
                where: {
                    userId: { in: userIds }
                }
            })
        ]);

        return {
            requests,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        };
    }

    // For managers and officers, get users under their manager
    const users = await prisma.user.findMany({
        where: { managerId: finalManagerId },
        select: { id: true }
    });

    const userIds = users.map(user => user.id);

    const skip = (page - 1) * limit;
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: {
                userId: { in: userIds }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        depot: true,
                        department: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.request.count({
            where: {
                userId: { in: userIds }
            }
        })
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

export const acceptRequestByManager = async (requestId, managerId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId }
    });

    if (!request) {
        throw new Error("Request not found");
    }

    return await prisma.request.update({
        where: { id: requestId },
        data: {
            managerAcceptance: true,
            managerAcceptanceId: managerId
        }
    });
};
