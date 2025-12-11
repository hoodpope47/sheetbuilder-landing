import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { captureError } from "@/lib/monitoring";

/**
 * Disconnect Google Sheets for the current user.
 *
 * This route:
 *  - Deletes any rows in user_google_tokens for the provided user.
 *  - Returns { ok: true } on success.
 *
 * It does NOT revoke the token with Google yet (that can be added later),
 * but it's enough to treat the account as "disconnected" inside AI Sheet Builder.
 */
export async function POST(req: NextRequest) {
    try {
        const { userId } = await req.json();

        if (!userId || typeof userId !== "string") {
            return NextResponse.json(
                { ok: false, code: "MISSING_USER", message: "Missing user id" },
                { status: 400 },
            );
        }

        const { error: deleteError } = await supabaseAdmin
            .from("user_google_tokens")
            .delete()
            .eq("user_id", userId);

        if (deleteError) {
            captureError(deleteError, { context: "google_disconnect_delete_tokens" });
            return NextResponse.json(
                { ok: false, code: "DELETE_FAILED", message: deleteError.message },
                { status: 500 },
            );
        }

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error: any) {
        captureError(error, { context: "google_disconnect_unhandled" });
        return NextResponse.json(
            {
                ok: false,
                code: "UNEXPECTED",
                message: error?.message ?? "Unexpected error disconnecting Google account",
            },
            { status: 500 },
        );
    }
}
