import { z } from "zod";

export const createRequestSchema = z.object({
    date: z.string().datetime(),
    selectedDepartment: z.string(),
    selectedSection: z.string(),
    stationID: z.string().optional(),
    missionBlock: z.string(),
    workType: z.string(),
    activity: z.string(),
    workLocationFrom: z.string().optional(),
    workLocationTo: z.string().optional(),
    demandTimeFrom: z.string().datetime(),
    demandTimeTo: z.string().datetime(),
    sigDisconnection: z.boolean().optional(),
    // elementarySectionFrom: z.string().optional(),
    elementarySectionTo: z.string().optional(),
    sigElementarySectionFrom: z.string().optional(),
    sigElementarySectionTo: z.string().optional(),
    repercussions: z.string().optional(),
    // otherLinesAffected: z.any().optional(), // JSON data
    requestremarks: z.string().optional(),
    selectedDepo: z.string().optional(),
    sigResponse: z.string().optional().default("yes"),
    ohDisconnection: z.string().optional(),
    oheDisconnection: z.string().optional(),
    oheResponse: z.string().optional().default("yes"),
    corridorType: z.string().optional().default("corridor"),
    sigActionsNeeded: z.boolean().optional().default(true),
    processedLineSections: z.array(z.object({
        block: z.string(),
        type: z.string(),
        lineName: z.string(),
        otherLines: z.string(),
        stream: z.string(),
        road: z.string(),
        otherRoads: z.string()
    })).optional(),
    trdActionsNeeded: z.boolean().optional().default(true),
    sigDisconnectionRequirements: z.string().optional(),
    trdDisconnectionRequirements: z.string().optional()
});

export const updateRequestSchema = createRequestSchema.partial();

export const requestIdSchema = z.object({
    id: z.string().uuid()
});

export const requestStatusSchema = z.object({
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
    ManagerResponse: z.string().optional()
});
