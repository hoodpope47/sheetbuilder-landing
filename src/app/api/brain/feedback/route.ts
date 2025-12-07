import { NextRequest, NextResponse } from "next/server";
import { getDashboardUser } from "@/lib/userClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { logSheetEvent } from "@/lib/brain/logSheetEvent";
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
        const { sheetSpecId, rating, comment } = body;

        if (!sheetSpecId || !rating) {
            return NextResponse.json(
                { error: "Missing required fields: sheetSpecId, rating" },
                { status: 400 }
            );
        }

        // Insert feedback into sheet_feedback table
        const { error: feedbackError } = await supabaseServer
            .from("sheet_feedback")
            .insert({
                user_id: user.id,
                sheet_spec_id: sheetSpecId,
                rating,
                comment: comment || null,
            });

        if (feedbackError) {
            throw feedbackError;
        }

        // Log feedback_submitted event
        await logSheetEvent({
            userId: user.id,
            sheetSpecId,
            eventType: "feedback_submitted",
            metadata: { rating },
        });

        return NextResponse.json({
            success: true,
            message: "Feedback submitted successfully",
        });
    } catch (error) {
        captureError(error, { context: "POST /api/brain/feedback" });

        return NextResponse.json(
            { error: "Failed to submit feedback" },
            { status: 500 }
        );
    }
}
