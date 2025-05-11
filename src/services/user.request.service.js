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

export const getManagerUsersRequests = async (
    managerId,
    role,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    // helper to fetch direct reports of a given role
    const fetchIds = async (ids, targetRole, field = "managerId") => {

        if (ids.length === 0) return [];
        const records = await prisma.user.findMany({
            where: { [field]: { in: ids }, role: targetRole },
            select: { id: true },
        });
        return records.map((r) => r.id);
    };

    // 1⃣ Build the list of USER-IDs under this manager, by role:
    let userIds = [];

    if (role === "BRANCH_OFFICER") {
        const seniorIds = await prisma.user.findMany({
            where: { managerId, role: "SENIOR_OFFICER" },
            select: { id: true },
        }).then((recs) => recs.map((r) => r.id));
        console.log(seniorIds);
        const juniorIds = await fetchIds(seniorIds, "JUNIOR_OFFICER");
        console.log(juniorIds);
        userIds = await fetchIds(juniorIds, "USER");
    } else if (role === "SENIOR_OFFICER") {
        // Senior → Juniors → Users
        const juniorIds = await prisma.user.findMany({
            where: { managerId, role: "JUNIOR_OFFICER" },
            select: { id: true },
        }).then((recs) => recs.map((r) => r.id));

        userIds = await fetchIds(juniorIds, "USER");

    } else if (role === "JUNIOR_OFFICER") {
        // Junior → Users
        userIds = await prisma.user.findMany({
            where: { managerId, role: "USER" },
            select: { id: true },
        }).then((recs) => recs.map((r) => r.id));

    } else {
        throw new Error(`Role ${role} is not supported for this endpoint.`);
    }

    // 2⃣ Query & paginate Requests for those USER-IDs
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: { userId: { in: userIds } },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                        depot: true,
                        department: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({
            where: { userId: { in: userIds } },
        }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

// export const getManagerUsersRequests = async (managerId, role, page = 1, limit = 10) => {
//     let finalManagerId = managerId;

//     // If the user is an officer, get their manager's ID
//     if (role === 'JUNIOR_OFFICER' || role === 'SENIOR_OFFICER') {
//         const subManager = await prisma.user.findUnique({
//             where: { id: managerId },
//             select: { managerId: true }
//         });

//         if (!subManager || !subManager.managerId) {
//             throw new Error("No manager assigned to this officer");
//         }

//         finalManagerId = subManager.managerId;
//     } else if (role === 'ADMIN') {
//         // For admin, get all managers under them
//         const managers = await prisma.user.findMany({
//             where: {
//                 adminId: managerId,
//                 role: 'BRANCH_OFFICER'
//             },
//             select: { id: true }
//         });

//         if (!managers || managers.length === 0) {
//             throw new Error("No managers found under this admin");
//         }

//         // Get all users under these managers
//         const users = await prisma.user.findMany({
//             where: {
//                 managerId: {
//                     in: managers.map(m => m.id)
//                 }
//             },
//             select: { id: true }
//         });

//         const userIds = users.map(user => user.id);

//         // put the where condition here
//         const whereCondition = {
//             userId: { in: userIds }
//         }

//         if (role === 'ADMIN') {
//             whereCondition.adminAcceptance = 'PENDING'
//             whereCondition.managerAcceptance = true
//         }
//         const skip = (page - 1) * limit;
//         const [requests, total] = await Promise.all([
//             prisma.request.findMany({
//                 where: whereCondition,
//                 include: {
//                     user: {
//                         select: {
//                             id: true,
//                             name: true,
//                             email: true,
//                             role: true,
//                             depot: true,
//                             department: true
//                         }
//                     }
//                 },
//                 orderBy: { createdAt: 'desc' },
//                 skip,
//                 take: limit
//             }),
//             prisma.request.count({
//                 where: {
//                     userId: { in: userIds }
//                 }
//             })
//         ]);

//         return {
//             requests,
//             total,
//             page,
//             totalPages: Math.ceil(total / limit)
//         };
//     }

//     // For managers and officers, get users under their manager
//     const users = await prisma.user.findMany({
//         where: { managerId: finalManagerId },
//         select: { id: true }
//     });

//     const userIds = users.map(user => user.id);

//     const skip = (page - 1) * limit;
//     const [requests, total] = await Promise.all([
//         prisma.request.findMany({
//             where: {
//                 userId: { in: userIds }
//             },
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         name: true,
//                         email: true,
//                         role: true,
//                         depot: true,
//                         department: true
//                     }
//                 }
//             },
//             orderBy: { createdAt: 'desc' },
//             skip,
//             take: limit
//         }),
//         prisma.request.count({
//             where: {
//                 userId: { in: userIds }
//             }
//         })
//     ]);

//     return {
//         requests,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit)
//     };
// };
export const getAdminPendingRequests = async (adminId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const fetchChildIds = async (parentIds, childRole) => {
        if (!parentIds || parentIds.length === 0) return [];
        const recs = await prisma.user.findMany({
            where: { managerId: { in: parentIds }, role: childRole },
            select: { id: true },
        });
        return recs.map(r => r.id);
    };

    // 1) Gather all User IDs under this Admin's hierarchy:
    //    Admin → Branch Officers → Senior Officers → Junior Officers → Users
    const branchRecs = await prisma.user.findMany({
        where: { adminId, role: "BRANCH_OFFICER" },
        select: { id: true }
    });
    const branchIds = branchRecs.map(r => r.id);

    const seniorIds = await fetchChildIds(branchIds, "SENIOR_OFFICER");
    const juniorIds = await fetchChildIds(seniorIds, "JUNIOR_OFFICER");
    const userIds = await fetchChildIds(juniorIds, "USER");

    // 2) Fetch & paginate requests where:
    //      • userId ∈ userIds
    //      • managerAcceptance = true
    //      • adminAcceptance = "PENDING"
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: {
                userId: { in: userIds },
                managerAcceptance: true
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
            orderBy: { createdAt: "desc" },
        }),
        prisma.request.count({
            where: {
                userId: { in: userIds },
                managerAcceptance: true,
                adminAcceptance: true
            },
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

export const acceptRequestByAdmin = async (requestId, acceptance, adminId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId }
    });

    if (!request) {
        throw new Error("Request not found");
    }

    return await prisma.request.update({
        where: { id: requestId },
        data: {
            adminAcceptance: acceptance,
            adminAcceptanceId: adminId
        }
    });
};

export const getUsersByAdminId = async (adminId, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;

    // Convert dates to start and end of day in ISO format
    const startDateTime = startDate ? new Date(startDate + 'T00:00:00.000Z') : undefined;
    const endDateTime = endDate ? new Date(endDate + 'T23:59:59.999Z') : undefined;

    // Build where clause with date filters
    const whereClause = {
        adminAcceptance: true,
        managerAcceptance: true,
        // adminAcceptanceId: adminId,
        ...(startDateTime && endDateTime && {
            date: {
                gte: startDateTime,
                lte: endDateTime
            }
        })
    };
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            include: {
                user: {
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
        prisma.request.count({
            where: whereClause
        })
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        dateRange: {
            startDate: startDateTime,
            endDate: endDateTime
        }
    };
};
