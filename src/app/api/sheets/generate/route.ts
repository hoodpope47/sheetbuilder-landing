import { NextRequest, NextResponse } from "next/server";
import { generateAndStoreSheetSpec } from "@/lib/sheetBrain";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));

        const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
        const category =
            typeof body.category === "string" && body.category.trim().length > 0
                ? body.category.trim()
                : null;

        if (!prompt) {
            return NextResponse.json(
                { error: "Missing prompt" },
                { status: 400 }
            );
        }

        // TODO: once auth is wired, extract userId from session
        const userId: string | null = null;

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
