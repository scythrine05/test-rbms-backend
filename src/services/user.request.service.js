import prisma from "../prisma/index.js";

export const createRequest = async (data, userId) => {
    // Create a list of allowed fields from the Prisma schema
    const allowedFields = [
        "adminAcceptance",
        "date",
        "selectedDepartment",
        "selectedSection",
        "stationID",
        "missionBlock",
        "workType",
        "activity",
        "freshCautionRequired",
        "freshCautionSpeed",
        "freshCautionLocationFrom",
        "freshCautionLocationTo",
        "adjacentLinesAffected",
        "workLocationFrom",
        "workLocationTo",
        "demandTimeFrom",
        "demandTimeTo",
        "sigDisconnection",
        "elementarySection",
        "elementarySectionTo",
        "sigElementarySectionFrom",
        "sigElementarySectionTo",
        "repercussions",
        "trdWorkLocation",
        "requestremarks",
        "status",
        "selectedDepo",
        "sigResponse",
        "ohDisconnection",
        "oheDisconnection",
        "oheResponse",
        "corridorType",
        "corridorTypeSelection",
        "sigActionsNeeded",
        "trdActionsNeeded",
        "ManagerResponse",
        "sigDisconnectionRequirements",
        "sntDisconnectionRequirements",
        "sntDisconnectionLine",
        "sntDisconnectionLineFrom",
        "sntDisconnectionLineTo",
        "trdDisconnectionRequirements",
        "powerBlockRequirements",
        "powerBlockRequired",
        "sntDisconnectionRequired",
        "processedLineSections",
        "routeFrom",
        "routeTo",
        "DisconnAcceptance",
        "managerAcceptanceId",
        "managerAcceptance",
        "adminAcceptanceId",
        "sntDisconnectionAssignTo",
        "trdDisconnectionAssignTo",
    ];

    // Filter out any fields that aren't in the allowedFields list
    const filteredData = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key)),
    );

    return await prisma.request.create({
        data: {
            ...filteredData,
            userId,
            status: "PENDING",
        },
    });
};


export const updatedSatus = async (requestId, status,reason) => {
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: { 
            userStatus: status,
            reasonForReject:reason
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    
    if (!updatedRequest) throw new Error("Request not found or update failed");
    return updatedRequest;
};
export const userResponse = async (requestId, userResponse,reason) => {
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: { 
            userResponse:userResponse,
            availedResponse:reason
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    
    if (!updatedRequest) throw new Error("Request not found or update failed");
    return updatedRequest;
};


export const updateOptimizeTimes = async (requestId, optimizeTimeFrom,optimizeTimeTo) => {
    const updatedRequest = await prisma.request.update({
        where: { id: requestId },
        data: { 
            optimizeTimeFrom:optimizeTimeFrom,
            optimizeTimeTo:optimizeTimeTo,
            isSanctioned:true
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    });
    
    if (!updatedRequest) throw new Error("Request not found or update failed");
    return updatedRequest;
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
                    role: true,
                },
            },
            //     manager: {
            //         select: {
            //             id: true,
            //             name: true,
            //             email: true,
            //             role: true
            //         }
            //     }
        },
    });
    if (!request) throw new Error("Request not found");
    return request;
};

export const updateRequest = async (id, data) => {
    return await prisma.request.update({
        where: { id },
        data,
    });
};

export const deleteRequest = async (id) => {
    return await prisma.request.delete({
        where: { id },
    });
};

export const updateRequestStatus = async (id, status, managerId, ManagerResponse) => {
    return await prisma.request.update({
        where: { id },
        data: {
            status,
            managerId,
            ManagerResponse,
        },
    });
};



export const getUserRequests = async (userId, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;
    
    const whereClause = {
        userId,
        ...(startDate && endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        })
    };

    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({ where: whereClause }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};


export const getUserRequestsData = async (
  userId,
  page = 1,
  limit = 30,
  startDate,
  endDate
) => {
  const skip = (page - 1) * limit;

  const whereClause = {
    userId,
    optimizeStatus: true,
    ...(startDate && endDate && {
      createdAt: {
        gte: new Date(startDate),
        lte: new Date(endDate),
      },
    }),
  };

  const [requests, total] = await Promise.all([
    prisma.request.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.request.count({ where: whereClause }),
  ]);

  return {
    requests,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
};

// export const getUserRequestsData = async (userId, page = 1, limit = 30,startDate,endDate) => {
//     const skip = (page - 1) * limit;
//     const [requests, total] = await Promise.all([
//         prisma.request.findMany({
//             where: { userId,optimizeStatus:true },
            
//             orderBy: { createdAt: "desc" },
//             skip,
//             take: limit,
//         }),
//         prisma.request.count({ where: { userId } }),
//     ]);

//     return {
//         requests,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//     };
// };
export const getManagerRequests = async (managerId, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;
    
    const whereClause = {
        managerId,
        ...(startDate && endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
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
                        role: true,
                    },
                },
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({ where: whereClause }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

export const getOtherRequests = async (selectedDepo, page = 1, limit = 10, userEmail, startDate, endDate) => {
    const skip = (page - 1) * limit;

    // Build the where clause
    const whereClause = {
        selectedDepo: selectedDepo,
        OR: [
            {
                sntDisconnectionRequired: true,
                sntDisconnectionAssignTo: userEmail,
            },
            {
                trdActionsNeeded: true, 
                trdDisconnectionAssignTo: userEmail,
            }
        ],
        ...(startDate && endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        })
    };

    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({
            where: whereClause,
        }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

export const updateOtherRequest = async (id, acceptance, disconnectionRequestRejectRemarks) => {
    console.log(acceptance ? "ACCEPTED" : "REJECTED");
    return await prisma.request.update({
        where: { id },
        data: {
            DisconnAcceptance: acceptance ? "ACCEPTED" : "REJECTED",
            disconnectionRequestRejectRemarks: !acceptance ? disconnectionRequestRejectRemarks : null,
        },
    });
};
export const getManagerUsersRequests = async (
  managerId,
  role,
  page = 1,
  limit = 10,
  startDate,
  endDate,
  status
) => {
  try {
    // Validate inputs
    if (page < 1) throw new Error('Page must be at least 1');
    if (limit < 1) throw new Error('Limit must be at least 1');
    
    const skip = (page - 1) * limit;

    // Helper to fetch user IDs with a single query
    const getUserIds = async ({ managerId: managerIdCondition, role: targetRole, field = 'managerId' }) => {
      const where = { 
        [field]: Array.isArray(managerIdCondition) 
          ? { in: managerIdCondition } 
          : managerIdCondition
      };
      if (targetRole) where.role = targetRole;
      
      const users = await prisma.user.findMany({
        where,
        select: { id: true }
      });
      
      return users.map(user => user.id);
    };

    // 1. Build the list of USER-IDs under this manager hierarchy
    let userIds = [];

    switch (role) {
      case 'BRANCH_OFFICER':
        const seniorIds = await getUserIds({ managerId, role: 'SENIOR_OFFICER' });
        const juniorIds = await getUserIds({ managerId: seniorIds, role: 'JUNIOR_OFFICER' });
        userIds = await getUserIds({ managerId: juniorIds, role: 'USER' });
        break;

      case 'SENIOR_OFFICER':
        const juniorOfficerIds = await getUserIds({ managerId, role: 'JUNIOR_OFFICER' });
        userIds = await getUserIds({ managerId: juniorOfficerIds, role: 'USER' });
        break;

      case 'JUNIOR_OFFICER':
        userIds = await getUserIds({ managerId, role: 'USER' });
        break;

      default:
        throw new Error(`Role ${role} is not supported for this endpoint`);
    }

    // Early return if no users found
    if (userIds.length === 0) {
      return {
        requests: [],
        total: 0,
        page,
        totalPages: 0
      };
    }

    // 2. Build the where clause for requests
    const where = { userId: { in: userIds } };

    // Date filtering
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    } else if (startDate) {
      where.date = { gte: new Date(startDate) };
    } else if (endDate) {
      where.date = { lte: new Date(endDate) };
    }

    // Status filtering
    if (status && status !== 'ALL') {
      where.status = status;
    }

    // 3. Query requests with pagination
    const [requests, total] = await Promise.all([
      prisma.request.findMany({
        where,
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
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.request.count({ where }),
    ]);

    return {
      requests,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };

  } catch (error) {
    console.error('Error in getManagerUsersRequests:', error);
    throw error;
  }
};
// export const getManagerUsersRequests = async (managerId, role, page = 1, limit = 10) => {
//     const skip = (page - 1) * limit;

//     // helper to fetch direct reports of a given role
//     const fetchIds = async (ids, targetRole, field = "managerId") => {
//         if (ids.length === 0) return [];
//         const records = await prisma.user.findMany({
//             where: { [field]: { in: ids }, role: targetRole },
//             select: { id: true },
//         });
//         return records.map((r) => r.id);
//     };

//     // 1⃣ Build the list of USER-IDs under this manager, by role:
//     let userIds = [];

//     if (role === "BRANCH_OFFICER") {
//         const seniorIds = await prisma.user
//             .findMany({
//                 where: { managerId, role: "SENIOR_OFFICER" },
//                 select: { id: true },
//             })
//             .then((recs) => recs.map((r) => r.id));
//         console.log(seniorIds);
//         const juniorIds = await fetchIds(seniorIds, "JUNIOR_OFFICER");
//         console.log(juniorIds);
//         userIds = await fetchIds(juniorIds, "USER");
//     } else if (role === "SENIOR_OFFICER") {
//         // Senior → Juniors → Users
//         const juniorIds = await prisma.user
//             .findMany({
//                 where: { managerId, role: "JUNIOR_OFFICER" },
//                 select: { id: true },
//             })
//             .then((recs) => recs.map((r) => r.id));

//         userIds = await fetchIds(juniorIds, "USER");
//     } else if (role === "JUNIOR_OFFICER") {
//         // Junior → Users
//         userIds = await prisma.user
//             .findMany({
//                 where: { managerId, role: "USER" },
//                 select: { id: true },
//             })
//             .then((recs) => recs.map((r) => r.id));
//     } else {
//         throw new Error(`Role ${role} is not supported for this endpoint.`);
//     }

//     // 2⃣ Query & paginate Requests for those USER-IDs
//     const [requests, total] = await Promise.all([
//         prisma.request.findMany({
//             where: { userId: { in: userIds } },
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         name: true,
//                         email: true,
//                         role: true,
//                         depot: true,
//                         department: true,
//                     },
//                 },
//             },
//             orderBy: { createdAt: "desc" },
//             skip,
//             take: limit,
//         }),
//         prisma.request.count({
//             where: { userId: { in: userIds } },
//         }),
//     ]);

//     return {
//         requests,
//         total,
//         page,
//         totalPages: Math.ceil(total / limit),
//     };
// };

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
export const getAdminPendingRequests = async (adminId, role, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;

    const fetchChildIds = async (parentIds, childRole) => {
        if (!parentIds || parentIds.length === 0) return [];
        const recs = await prisma.user.findMany({
            where: { managerId: { in: parentIds }, role: childRole },
            select: { id: true },
        });
        return recs.map((r) => r.id);
    };

    // 1) Gather all User IDs under this Admin's hierarchy:
    //    Admin → Branch Officers → Senior Officers → Junior Officers → Users
    const branchRecs = await prisma.user.findMany({
        where: { adminId, role: "BRANCH_OFFICER" },
        select: { id: true },
    });
    const branchIds = branchRecs.map((r) => r.id);

    const seniorIds = await fetchChildIds(branchIds, "SENIOR_OFFICER");
    const juniorIds = await fetchChildIds(seniorIds, "JUNIOR_OFFICER");
    const userIds = await fetchChildIds(juniorIds, "USER");

    // 2) Build where clause for requests
    const whereClause = {
        userId: { in: userIds },
        managerAcceptance: true,
        ...(startDate && endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        })
    };

    // 3) Fetch & paginate requests
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
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
            where: whereClause,
        }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

// export const acceptRequestByManager = async (requestId, managerId) => {
//     const request = await prisma.request.findUnique({
//         where: { id: requestId },
//     });

//     if (!request) {
//         throw new Error("Request not found");
//     }

//     return await prisma.request.update({
//         where: { id: requestId },
//         data: {
//             managerAcceptance: true,
//             managerAcceptanceId: managerId,
//         },
//     });
// };

// export const acceptRequestByManager = async (requestId, managerId, isAccept) => {
//     const request = await prisma.request.findUnique({
//         where: { id: requestId },
//     });

//     if (!request) {
//         throw new Error("Request not found");
//     }

//     return await prisma.request.update({
//         where: { id: requestId },
//         data: {
//             managerAcceptance: isAccept,
//             managerAcceptanceId: managerId,
//             status: isAccept ? "APPROVED" : "REJECTED",  // Update status based on isAccept
//         },
//     });
// };
export const acceptRequestByManager = async (requestId, managerId, isAccept, remark) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        throw new Error("Request not found");
    }

    return await prisma.request.update({
        where: { id: requestId },
        data: {
            managerAcceptance: isAccept,
            managerAcceptanceId: managerId,
            status: isAccept ? "APPROVED" : "REJECTED",
            remarkByManager: remark || null, // Store the rejection reason
        },
    });
};

export const acceptRequestByAdmin = async (requestId, acceptance, adminId) => {
    const request = await prisma.request.findUnique({
        where: { id: requestId },
    });

    if (!request) {
        throw new Error("Request not found");
    }

    return await prisma.request.update({
        where: { id: requestId },
        data: {
            adminAcceptance: acceptance,
            adminAcceptanceId: adminId,
            adminRequestStatus: acceptance ? "ACCEPTED" : "REJECTED"
        },
    });
};

export const getUsersByAdminId = async (adminId, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;

    // Convert dates to start and end of day in ISO format
    const startDateTime = startDate ? new Date(startDate + "T00:00:00.000Z") : undefined;
    const endDateTime = endDate ? new Date(endDate + "T23:59:59.999Z") : undefined;

    const whereClause = {
        adminAcceptance: true,
        adminRequestStatus:"ACCEPTED",
        managerAcceptance: true,
        adminAcceptanceId: adminId,
        ...(startDateTime &&
            endDateTime && {
                date: {
                    gte: startDateTime,
                    lte: endDateTime,
                },
            }),
    };
    console.log(whereClause);
    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({
            where: whereClause,
        }),
    ]);
    console.log(requests);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        dateRange: {
            startDate: startDateTime,
            endDate: endDateTime,
        },
    };
};







export const approveAllPendingRequests = async (adminId) => {
  return await prisma.$transaction(async (tx) => {
    // First get all pending requests that will be updated
    const pendingRequests = await tx.request.findMany({
      where: {
        adminRequestStatus: 'PENDING',
      },
      select: {
        id: true,
      },
    });

    if (pendingRequests.length === 0) {
      throw new Error('No pending requests found');
    }

    // Update all pending requests - removed updatedAt
    await tx.request.updateMany({
      where: {
        adminRequestStatus: 'PENDING',
      },
      data: {
        adminRequestStatus: 'ACCEPTED',
        adminAcceptance: true,
        adminAcceptanceId: adminId,
        // Removed: updatedAt: new Date(),
      },
    });

    return {
      count: pendingRequests.length,
      requestIds: pendingRequests.map(req => req.id),
    };
  });
};



// export const saveOptimizedData = async (optimizedData) => {
//     try {
//         const created = await prisma.optimize_Table.createMany({
//             data: optimizedData.map(request => {
//                 // Combine date with time for proper DateTime format
//                 const timeFrom = new Date(`${request.date}T${request.demandTimeFrom}:00`);
//                 const timeTo = new Date(`${request.date}T${request.demandTimeTo}:00`);
                
//                 return {
//                     id: request.id,
//                     optimizeTimeFrom: timeFrom,
//                     optimizeTimeTo: timeTo,
//                     date: new Date(request.date),
//                     missionBlock: request.missionBlock,
//                     otherAffectedLine: request.otherAffectedLine,
//                     selectedDepartment: request.selectedDepartment,
//                     selectedDepo: request.selectedDepo,
//                     selectedStream: request.selectedStream,
//                     selectedLine: request.selectedLine || 
//                                 request.processedLineSections?.[0]?.lineName || 
//                                 'N/A',
//                     selectedSection: request.selectedSection,
//                 };
//             }),
//             skipDuplicates: true
//         });

//         return { 
//             success: true, 
//             count: created.count,
//             message: `${created.count} new optimized records added`
//         };
//     } catch (error) {
//         console.error('Failed to add optimized data:', error);
//         throw new Error('Database operation failed');
//     } 
// };
export const saveOptimizedData = async (optimizedData) => {
    try {
        // First, create the optimized records
        const created = await prisma.optimize_Table.createMany({
            data: optimizedData.map(request => {
                // Combine date with time for proper DateTime format
                const timeFrom = new Date(`${request.date}T${request.demandTimeFrom}:00`);
                const timeTo = new Date(`${request.date}T${request.demandTimeTo}:00`);
                
                return {
                    id: request.id,
                    optimizeTimeFrom: timeFrom,
                    optimizeTimeTo: timeTo,
                    date: new Date(request.date),
                    missionBlock: request.missionBlock,
                    otherAffectedLine: request.otherAffectedLine,
                    selectedDepartment: request.selectedDepartment,
                    selectedDepo: request.selectedDepo,
                    selectedStream: request.selectedStream,
                    selectedLine: request.selectedLine || 
                                request.processedLineSections?.[0]?.lineName || 
                                'N/A',
                    selectedSection: request.selectedSection,
                };
            }),
            skipDuplicates: true
        });

        // Then update the original requests with the optimized times
        await Promise.all(optimizedData.map(async (request) => {
            const timeFrom = new Date(`${request.date}T${request.demandTimeFrom}:00`);
            const timeTo = new Date(`${request.date}T${request.demandTimeTo}:00`);
            
            await prisma.Request.update({
                where: { id: request.id },
                data: {
                    optimizeTimeFrom: timeFrom,
                    optimizeTimeTo: timeTo
                }
            });
        }));

        return { 
            success: true, 
            count: created.count,
            message: `${created.count} new optimized records added and requests updated`
        };
    } catch (error) {
        console.error('Failed to process optimized data:', error);
        throw new Error('Database operation failed');
    } 
};

export const getTrdRequests = async (selectedDepo, page = 1, limit = 10, userEmail, startDate, endDate) => {
    const skip = (page - 1) * limit;

    // Build the where clause
    const whereClause = {
        trdActionsNeeded: true,
        selectedDepo: selectedDepo,
        ...(userEmail && { trdDisconnectionAssignTo: userEmail }),
        ...(startDate && endDate && {
            date: {
                gte: new Date(startDate),
                lte: new Date(endDate)
            }
        })
    };

    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({
            where: whereClause,
        }),
    ]);

    return {
        requests,
        total,
        page,
        totalPages: Math.ceil(total / limit),
    };
};

export const getOptimizeData = async (adminId, page = 1, limit = 10, startDate, endDate) => {
    const skip = (page - 1) * limit;

    // Convert dates
    const startDateTime = startDate ? new Date(startDate + "T00:00:00.000Z") : undefined;
    const endDateTime = endDate ? new Date(endDate + "T23:59:59.999Z") : undefined;

    // 1. Get optimized IDs
    const optimizedIds = await prisma.optimize_Table.findMany({
        select: { id: true }
    });
    const optimizedIdList = optimizedIds.map(item => item.id);

    // 2. Get matching requests
    const whereClause = {
        id: { in: optimizedIdList },
        adminAcceptance: true,
        adminRequestStatus: "ACCEPTED",
        managerAcceptance: true,
        adminAcceptanceId: adminId,
        ...(startDateTime && endDateTime && {
            date: { gte: startDateTime, lte: endDateTime }
        })
    };

    const [requests, total] = await Promise.all([
        prisma.request.findMany({
            where: whereClause,
            include: { user: { select: { id: true, name: true, email: true, role: true } } },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.request.count({ where: whereClause })
    ]);

    // 3. Get optimize data separately if needed
    const optimizeData = await prisma.optimize_Table.findMany({
        where: { id: { in: optimizedIdList } }
    });

    // Combine data
    const result = requests.map(request => ({
        ...request,
        optimizeData: optimizeData.find(opt => opt.id === request.id)
    }));

    return {
        requests: result,
        total,
        page,
        totalPages: Math.ceil(total / limit),
        dateRange: { startDate: startDateTime, endDate: endDateTime }
    };
};


export const saveOptimizedRequestsStatus = async (requestIds) => {
  try {
    await prisma.Request.updateMany({
      where: { 
        id: { in: requestIds } 
      },
      data: {
        optimizeStatus: true,
      },
    });

    return {
      success: true,
      message: `${requestIds.length} requests marked as optimized`,
    };
  } catch (error) {
    console.error("Failed to update optimized status:", error);
    throw new Error("Database operation failed");
  }
};



