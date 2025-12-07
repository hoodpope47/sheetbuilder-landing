import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabaseServer";
import { exchangeCodeForTokens } from "@/lib/googleOAuthServer";
import { captureError } from "@/lib/monitoring";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const code = url.searchParams.get("code");
        const state = url.searchParams.get("state");

        // Check for code and state
        if (!code || !state) {
            return NextResponse.redirect(
                new URL("/dashboard/settings?googleStatus=error", request.url)
            );
        }

        // Read and parse google_oauth_state cookie
        const cookieStore = await cookies();
        const stateCookie = cookieStore.get("google_oauth_state");

        if (!stateCookie) {
            return NextResponse.redirect(
                new URL("/dashboard/settings?googleStatus=error&reason=state", request.url)
            );
        }

        let stored: { state: string; userId: string; redirectTo: string };
        try {
            stored = JSON.parse(stateCookie.value);
        } catch {
            return NextResponse.redirect(
                new URL("/dashboard/settings?googleStatus=error&reason=state", request.url)
            );
        }

        // Verify state matches
        if (state !== stored.state) {
            return NextResponse.redirect(
                new URL("/dashboard/settings?googleStatus=error&reason=state", request.url)
            );
        }

        // Exchange code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // Upsert tokens into user_google_tokens
        const { error } = await supabaseServer
            .from("user_google_tokens")
            .upsert({
                user_id: stored.userId,
                access_token: tokens.access_token ?? null,
                refresh_token: tokens.refresh_token ?? null,
                scope: tokens.scope ?? null,
                token_type: tokens.token_type ?? null,
                expiry_date: tokens.expiry_date
                    ? new Date(tokens.expiry_date).toISOString()
                    : null
            }, { onConflict: "user_id" });

        if (error) {
            captureError(error, { context: "api/google/oauth/callback/upsert" });
            return NextResponse.redirect(
                new URL("/dashboard/settings?googleStatus=error", request.url)
            );
        }

        // Clear the state cookie
        cookieStore.delete("google_oauth_state");

        // Redirect to success page
        return NextResponse.redirect(
            new URL(stored.redirectTo || "/dashboard/settings?googleStatus=connected", request.url)
        );
    } catch (error) {
        captureError(error, { context: "api/google/oauth/callback" });
        return NextResponse.redirect(
            new URL("/dashboard/settings?googleStatus=error", request.url)
        );
    }
}
