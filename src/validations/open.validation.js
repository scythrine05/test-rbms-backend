import { z } from "zod";

export const getSanctionedRequestsSchema = z.object({
    start_date: z.string().optional(),
    end_date: z.string().optional(),
});

export const patchSanctionedRequestSchema = z.object({
    id: z.string().min(1, "id is required"),
    availed: z.boolean({ required_error: "availed is required" }),
});
