// src/services/officer.service.js

import prisma from "../prisma/index.js";
import { hashPassword } from "../utils/password.utils.js";

// Get all officers under a branch officer
export const getOfficersUnderBranch = async (
    branchOfficerId,
    page = 1,
    limit = 10
) => {
    const skip = (page - 1) * limit;

    // 1) Fetch Senior Officers under this Branch (paginated)
    const [seniors, totalSeniors] = await Promise.all([
        prisma.user.findMany({
            where: {
                managerId: branchOfficerId,
                role: "SENIOR_OFFICER",
            },
            select: {
                id: true,
                role: true,
                name: true,
                email: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        }),
        prisma.user.count({
            where: {
                managerId: branchOfficerId,
                role: "SENIOR_OFFICER",
            },
        }),
    ]);

    const seniorIds = seniors.map((s) => s.id);

    // 2) Fetch ALL Junior Officers under those Seniors
    const juniors = seniorIds.length
        ? await prisma.user.findMany({
            where: {
                managerId: { in: seniorIds },
                role: "JUNIOR_OFFICER",
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true,
                managerId: true,
            },
            orderBy: { createdAt: "desc" },
        })
        : [];

    const juniorIds = juniors.map((j) => j.id);

    // 3) Fetch ALL Users under those Juniors
    const users = juniorIds.length
        ? await prisma.user.findMany({
            where: {
                managerId: { in: juniorIds },
                role: "USER",
            },
            select: {
                id: true,
                name: true,
                role: true,
                email: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true,
                managerId: true,
            },
            orderBy: { createdAt: "desc" },
        })
        : [];

    return {
        officers: [...seniors, ...juniors, ...users],
        page,
    };
};


// Get all officers under an admin
export const getOfficersUnderAdmin = async (adminId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // First get all branch officers under this admin
    const branchOfficers = await prisma.user.findMany({
        where: {
            adminId,
            role: 'BRANCH_OFFICER'
        },
        select: { id: true }
    });

    const branchOfficerIds = branchOfficers.map(officer => officer.id);

    const [officers, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                OR: [
                    { adminId, role: 'BRANCH_OFFICER' },
                    { managerId: { in: branchOfficerIds } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                phone: true,
                location: true,
                managerId: true,
                depot: true,
                adminId: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({
            where: {
                OR: [
                    { adminId, role: 'BRANCH_OFFICER' },
                    { managerId: { in: branchOfficerIds } }
                ]
            }
        })
    ]);

    return {
        officers,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

// Get all officers under a senior officer
export const getOfficersUnderSenior = async (seniorOfficerId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [officers, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                managerId: seniorOfficerId,
                role: { in: ['JUNIOR_OFFICER', 'USER'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({
            where: {
                managerId: seniorOfficerId,
                role: { in: ['JUNIOR_OFFICER', 'USER'] }
            }
        })
    ]);

    return {
        officers,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

// Get all users under a junior officer
export const getUsersUnderJunior = async (juniorOfficerId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    console.log(juniorOfficerId);
    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where: {
                managerId: juniorOfficerId,
                role: 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.user.count({
            where: {
                managerId: juniorOfficerId,
                role: 'USER'
            }
        })
    ]);

    return {
        users,
        total,
        page,
        totalPages: Math.ceil(total / limit)
    };
};

// Get all users under junior officers who report to a senior officer
export const getUsersUnderSeniorOfficer = async (seniorOfficerId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    // First get all junior officers under this senior officer
    const [juniorOfficers, juniorOfficersCount] = await Promise.all([
        prisma.user.findMany({
            where: {
                managerId: seniorOfficerId,
                role: 'JUNIOR_OFFICER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({
            where: {
                managerId: seniorOfficerId,
                role: 'JUNIOR_OFFICER'
            }
        })
    ]);

    const juniorOfficerIds = juniorOfficers.map(officer => officer.id);

    // Then get all users under these junior officers
    const [users, usersCount] = await Promise.all([
        prisma.user.findMany({
            where: {
                managerId: { in: juniorOfficerIds },
                role: 'USER'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                phone: true,
                location: true,
                depot: true,
                createdAt: true,
                managerId: true,
                manager: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count({
            where: {
                managerId: { in: juniorOfficerIds },
                role: 'USER'
            }
        })
    ]);
    return {

        users: {
            officers: [...juniorOfficers, ...users],
            total: usersCount + juniorOfficersCount
        }
    };
};

// Create a new officer with proper hierarchy
export const createOfficer = async (data, creatorId, creatorRole, seniorOfficerId) => {
    const hashedPassword = await hashPassword(data.password);

    let managerId = null;
    let adminId = null;

    // Determine the appropriate manager/admin based on creator's role
    switch (creatorRole) {
        case 'SUPER_ADMIN':
            if (data.role === 'ADMIN') {
                // Admin created by super admin
                adminId = null;
            } else if (data.role === 'BRANCH_OFFICER') {
                // Branch officer needs to be under an admin
                if (!data.adminId) throw new Error("Admin ID is required when creating a Branch Officer");

                // Verify admin exists
                const admin = await prisma.user.findFirst({
                    where: { id: data.adminId, role: 'ADMIN' }
                });
                if (!admin) throw new Error("Invalid Admin selected");

                adminId = data.adminId;
            } else {
                throw new Error("Super Admin can only create Admin or Branch Officer roles");
            }
            break;

        case 'ADMIN':
            if (data.role === 'BRANCH_OFFICER') {
                // Branch officer created by admin
                adminId = creatorId;
            } else {
                throw new Error("Admin can only create Branch Officer roles");
            }
            break;

        case 'BRANCH_OFFICER':
            if (data.role === 'SENIOR_OFFICER') {
                // Senior officer created by branch officer
                managerId = creatorId;
            } else if (data.role === 'JUNIOR_OFFICER' || data.role === 'USER') {
                managerId = seniorOfficerId;
            } else {
                throw new Error("Branch Officer can only create Senior Officer roles");
            }
            break;

        case 'SENIOR_OFFICER':
            if (data.role === 'JUNIOR_OFFICER') {
                // Junior officer created by senior officer
                managerId = creatorId;
            } else if (data.role === 'JUNIOR_OFFICER' || data.role === 'USER') {
                managerId = seniorOfficerId;
            } else {
                throw new Error("Senior Officer can only create Junior Officer roles");
            }
            break;

        case 'JUNIOR_OFFICER':
            if (data.role === 'USER') {
                // User created by junior officer
                managerId = creatorId;
            } else {
                throw new Error("Junior Officer can only create User roles");
            }
            break;

        default:
            throw new Error("Invalid creator role");
    }

    return await prisma.user.create({
        data: {
            ...data,
            password: hashedPassword,
            managerId,
            adminId
        },
        select: {
            id: true,
            name: true,
            email: true,
            depot: true,
            role: true,
            department: true,
            phone: true,
            location: true,
            createdAt: true
        }
    });
};

// Update an officer
export const updateOfficer = async (id, data, updaterId, updaterRole) => {
    // Verify the officer exists and is under the updater's hierarchy
    let officer;

    switch (updaterRole) {
        case 'SUPER_ADMIN':
            // Super admin can update anyone
            officer = await prisma.user.findUnique({ where: { id } });
            break;

        case 'ADMIN':
            // Admin can update branch officers under them and their subordinates
            const branchOfficers = await prisma.user.findMany({
                where: { adminId: updaterId, role: 'BRANCH_OFFICER' },
                select: { id: true }
            });

            officer = await prisma.user.findFirst({
                where: {
                    id,
                    OR: [
                        { adminId: updaterId, role: 'BRANCH_OFFICER' },
                        { managerId: { in: branchOfficers.map(bo => bo.id) } }
                    ]
                }
            });
            break;

        case 'BRANCH_OFFICER':
            // Branch officer can update senior officers, junior officers, and users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: updaterId,
                    role: { in: ['SENIOR_OFFICER', 'JUNIOR_OFFICER', 'USER'] }
                }
            });
            break;

        case 'SENIOR_OFFICER':
            // Senior officer can update junior officers and users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: updaterId,
                    role: { in: ['JUNIOR_OFFICER', 'USER'] }
                }
            });
            break;

        case 'JUNIOR_OFFICER':
            // Junior officer can update users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: updaterId,
                    role: 'USER'
                }
            });
            break;

        default:
            throw new Error("Invalid updater role");
    }

    if (!officer) throw new Error("Officer not found or not authorized to update");

    // If password is being updated, hash it
    if (data.password) {
        data.password = await hashPassword(data.password);
    }

    return await prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            department: true,
            phone: true,
            location: true,
            depot: true,
            updatedAt: true
        }
    });
};

// Delete an officer
export const deleteOfficer = async (id, deleterId, deleterRole) => {
    // Verify the officer exists and is under the deleter's hierarchy
    let officer;

    switch (deleterRole) {
        case 'SUPER_ADMIN':
            // Super admin can delete anyone except other super admins
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    role: { not: 'SUPER_ADMIN' }
                }
            });
            break;

        case 'ADMIN':
            // Admin can delete branch officers under them and their subordinates
            const branchOfficers = await prisma.user.findMany({
                where: { adminId: deleterId, role: 'BRANCH_OFFICER' },
                select: { id: true }
            });

            officer = await prisma.user.findFirst({
                where: {
                    id,
                    OR: [
                        { adminId: deleterId, role: 'BRANCH_OFFICER' },
                        { managerId: { in: branchOfficers.map(bo => bo.id) } }
                    ]
                }
            });
            break;

        case 'BRANCH_OFFICER':
            // Branch officer can delete senior officers, junior officers, and users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: deleterId,
                    role: { in: ['SENIOR_OFFICER', 'JUNIOR_OFFICER', 'USER'] }
                }
            });
            break;

        case 'SENIOR_OFFICER':
            // Senior officer can delete junior officers and users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: deleterId,
                    role: { in: ['JUNIOR_OFFICER', 'USER'] }
                }
            });
            break;

        case 'JUNIOR_OFFICER':
            // Junior officer can delete users under them
            officer = await prisma.user.findFirst({
                where: {
                    id,
                    managerId: deleterId,
                    role: 'USER'
                }
            });
            break;

        default:
            throw new Error("Invalid deleter role");
    }

    if (!officer) throw new Error("Officer not found or not authorized to delete");

    // Check if officer has any subordinates
    const hasSubordinates = await prisma.user.findFirst({
        where: {
            OR: [
                { managerId: id },
                { adminId: id }
            ]
        }
    });

    if (hasSubordinates) {
        throw new Error("Cannot delete officer with subordinates. Reassign or delete subordinates first.");
    }

    return await prisma.user.delete({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            role: true
        }
    });
};

// Get available branch officers for an admin
export const getAvailableBranchOfficers = async (adminId) => {
    return await prisma.user.findMany({
        where: {
            adminId,
            role: 'BRANCH_OFFICER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            department: true
        }
    });
};

// Get available senior officers for a branch officer
export const getAvailableSeniorOfficers = async (branchOfficerId) => {
    return await prisma.user.findMany({
        where: {
            managerId: branchOfficerId,
            role: 'SENIOR_OFFICER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            department: true
        }
    });
};

// Get available junior officers for a senior officer
export const getAvailableJuniorOfficers = async (seniorOfficerId) => {
    return await prisma.user.findMany({
        where: {
            managerId: seniorOfficerId,
            role: 'JUNIOR_OFFICER'
        },
        select: {
            id: true,
            name: true,
            email: true,
            location: true,
            department: true
        }
    });
};

