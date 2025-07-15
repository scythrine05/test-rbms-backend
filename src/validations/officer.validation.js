import { z } from "zod";

// Define the role enum based on the complete hierarchy
const roleEnum = z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "BRANCH_OFFICER",
    "SENIOR_OFFICER",
    "JUNIOR_OFFICER",
    "DEPT_CONTROLLER",
    "USER",
]);

export const officerValidation = {
    createOfficer: z.object({
        body: z
            .object({
                name: z.string().min(2, "Name must be at least 2 characters"),
                email: z.string().email("Invalid email address"),
                password: z.string().min(6, "Password must be at least 6 characters"),
                role: roleEnum,
                department: z.string().optional(),
                phone: z.string().optional(),
                location: z.string(),
                adminId: z.string().uuid("Invalid admin ID").optional(),
                managerId: z.string().uuid("Invalid manager ID").optional(),
            })
            .refine(
                (data) => {
                    // Role-specific validations
                    if (data.role === "ADMIN" && data.adminId) {
                        return false; // Admin should not have an adminId
                    }
                    if (data.role === "BRANCH_OFFICER" && !data.adminId) {
                        return false; // Branch officer must have an adminId
                    }
                    if (data.role === "DEPT_CONTROLLER" && !data.adminId) {
                        return false; // Branch officer must have an adminId
                    }
                    if (
                        (data.role === "SENIOR_OFFICER" ||
                            data.role === "JUNIOR_OFFICER" ||
                            data.role === "USER") &&
                        !data.managerId
                    ) {
                        return false; // Senior, Junior, and User must have a managerId
                    }
                    return true;
                },
                {
                    message:
                        "Invalid role configuration. Please check adminId and managerId requirements for the selected role.",
                },
            ),
    }),

    updateOfficer: z.object({
        params: z.object({
            id: z.string().uuid("Invalid officer ID"),
        }),
        body: z
            .object({
                name: z.string().min(2, "Name must be at least 2 characters").optional(),
                email: z.string().email("Invalid email address").optional(),
                password: z.string().min(6, "Password must be at least 6 characters").optional(),
                department: z.string().optional(),
                phone: z.string().optional(),
                location: z.string().optional(),
            })
            .refine(
                (data) => {
                    // Ensure at least one field is being updated
                    return Object.keys(data).length > 0;
                },
                {
                    message: "At least one field must be provided for update",
                },
            ),
    }),

    deleteOfficer: z.object({
        params: z.object({
            id: z.string().uuid("Invalid officer ID"),
        }),
    }),

    // Additional validation schemas for specific operations
    assignOfficer: z.object({
        params: z.object({
            id: z.string().uuid("Invalid officer ID"),
        }),
        body: z
            .object({
                managerId: z.string().uuid("Invalid manager ID").optional(),
                adminId: z.string().uuid("Invalid admin ID").optional(),
            })
            .refine(
                (data) => {
                    // Ensure at least one assignment field is provided
                    return data.managerId || data.adminId;
                },
                {
                    message: "Either managerId or adminId must be provided",
                },
            ),
    }),
};
