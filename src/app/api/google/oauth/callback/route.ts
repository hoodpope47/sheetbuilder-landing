import { NextRequest, NextResponse } from "next/server";
import { captureError } from "@/lib/monitoring";
import { getOAuthClient } from "@/lib/googleClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const errorParam = url.searchParams.get("error");
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state"); // Supabase user id

    if (errorParam) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?googleError=oauth_start_failed", request.url)
        );
    }

    if (!code) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?googleError=missing_code", request.url)
        );
    }

    if (!state) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?googleError=no_session", request.url)
        );
    }

    try {
        const { oauth2Client } = getOAuthClient();

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);

        const { access_token, refresh_token, expiry_date } = tokens;

        const payload: Record<string, any> = {
            user_id: state,
            access_token: access_token ?? null,
            refresh_token: refresh_token ?? null,
            expiry_date: expiry_date ? new Date(expiry_date).toISOString() : null
        };

        const { error } = await supabaseAdmin
            .from("user_google_tokens")
            .upsert(payload, { onConflict: "user_id" });

        if (error) {
            console.error("Supabase user_google_tokens upsert error", error);
            captureError(error, { context: "google_oauth_callback_upsert" });

            return NextResponse.redirect(
                new URL("/dashboard/settings?googleError=db_upsert_failed", request.url)
            );
        }

        return NextResponse.redirect(
            new URL("/dashboard/settings?googleStatus=connected", request.url)
        );
    } catch (error: any) {
        console.error("Google OAuth callback failed", error);
        captureError(error, { context: "google_oauth_callback" });

        return NextResponse.redirect(
            new URL("/dashboard/settings?googleError=callback_failed", request.url)
        );
    }
}
