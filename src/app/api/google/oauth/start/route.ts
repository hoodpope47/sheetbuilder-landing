import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";
import { getGoogleOAuthClient } from "@/lib/googleOAuthServer";
import { captureError } from "@/lib/monitoring";

export async function GET() {
    try {
        // Get Supabase authenticated user
        const { data: { user }, error } = await supabaseServer.auth.getUser();

        if (error || !user) {
            return NextResponse.json(
                { ok: false, code: "NOT_AUTHENTICATED" },
                { status: 401 }
            );
        }

        // Generate random state string
        const state = crypto.randomUUID();

        // Store state in cookie
        const cookieStore = await cookies();
        cookieStore.set("google_oauth_state", JSON.stringify({
            state,
            userId: user.id,
            redirectTo: "/dashboard/settings?googleStatus=connected"
        }), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 10 * 60 // 10 minutes
        });

        // Create auth URL
        const client = getGoogleOAuthClient();
        const url = client.generateAuthUrl({
            access_type: "offline",
            include_granted_scopes: true,
            scope: [
                "https://www.googleapis.com/auth/drive.file",
                "https://www.googleapis.com/auth/spreadsheets"
            ],
            state,
            prompt: "consent" // Force consent screen to get refresh token
        });

        return NextResponse.redirect(url);
    } catch (error) {
        captureError(error, { context: "api/google/oauth/start" });
        return NextResponse.json(
            { ok: false, code: "INTERNAL_ERROR" },
            { status: 500 }
        );
    }
}
