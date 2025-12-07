import { NextRequest, NextResponse } from "next/server";
import { getDashboardUser } from "@/lib/userClient";
import { suggestTemplateAndSpec } from "@/lib/brain/userBrain";
import { captureError } from "@/lib/monitoring";

export async function POST(request: NextRequest) {
    try {
        // Check authentication
        const user = await getDashboardUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Parse request body
        const body = await request.json();
        const { query, templateSlug, templateCategory } = body;

        if (!query || typeof query !== "string") {
            return NextResponse.json(
                { error: "Missing or invalid 'query' field" },
                { status: 400 }
            );
        }

        // Call AI brain to generate suggestion
        const suggestion = await suggestTemplateAndSpec({
            userId: user.id,
            query: query.trim(),
            templateSlug,
            templateCategory,
        });

        return NextResponse.json({
            success: true,
            ...suggestion,
        });
    } catch (error) {
        captureError(error, { context: "POST /api/brain/suggest" });

        return NextResponse.json(
            {
                error: "Failed to generate AI suggestion",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
