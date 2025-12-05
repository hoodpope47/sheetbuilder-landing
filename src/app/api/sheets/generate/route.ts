import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreSheetSpec } from "@/lib/sheetBrain";

import { sheetGenerateSchema } from "@/lib/validation/sheets";

export async function POST(req: NextRequest) {
    try {
        const json = await req.json();
        const parsed = sheetGenerateSchema.safeParse(json);

        if (!parsed.success) {
            const message =
                parsed.error.issues[0]?.message ||
                "Invalid request body for sheet generation";
            return NextResponse.json({ error: message }, { status: 400 });
        }

        const { prompt, userId, plan } = parsed.data;
        const rawPrompt = prompt.trim();

        const category = null; // We'll skip category for now or extract it if needed later

        // TODO: once auth is wired, extract userId from session if not provided in body
        // const userIdFromSession = ...;

        const result = await generateAndStoreSheetSpec({
            prompt,
            category,
            userId,
        });

        return NextResponse.json(
            {
                requestId: result.requestId,
                specId: result.specId,
                spec: result.spec,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("[/api/sheets/generate] error", error);
        return NextResponse.json(
            { error: error?.message || "Failed to generate sheet spec" },
            { status: 500 }
        );
    }
}
