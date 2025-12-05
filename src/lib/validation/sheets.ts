import { z } from "zod";

/**
 * Schema for the body of POST /api/sheets/generate
 *
 * We keep it intentionally simple for now, and can evolve it later.
 */
export const sheetGenerateSchema = z.object({
    prompt: z
        .string()
        .min(10, "Please describe the sheet in a bit more detail."),
    userId: z.string().uuid().optional().nullable(),
    plan: z.string().optional().nullable(),
});

export type SheetGenerateInput = z.infer<typeof sheetGenerateSchema>;
