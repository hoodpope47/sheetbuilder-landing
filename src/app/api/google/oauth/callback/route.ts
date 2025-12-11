import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthClient } from "@/lib/googleOAuthServer";

/**
 * Minimal Google OAuth callback:
 * - Tries to exchange the "code" for tokens (for future use).
 * - Regardless of token persistence, it redirects the user back to
 *   /dashboard/settings with googleStatus=connected on success.
 * - Only uses googleStatus=error when Google itself sends an "error" param
 *   or when the "code" is missing.
 *
 * NOTE: This does NOT yet persist tokens to Supabase. That will be a separate
 * command once we decide on the exact user-id strategy.
 */
export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const base =
        process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

    // If Google sends an explicit error (e.g. user denied consent)
    if (oauthError) {
        return NextResponse.redirect(
            `${base}/dashboard/settings?googleStatus=error&googleError=${encodeURIComponent(
                oauthError,
            )}`,
        );
    }

    // If there is no code at all, treat as generic error
    if (!code) {
        return NextResponse.redirect(
            `${base}/dashboard/settings?googleStatus=error&googleError=missing_code`,
        );
    }

    try {
        // Try to exchange code for tokens so we know OAuth succeeded.
        // We intentionally do NOT persist tokens in this minimal version.
        const client = await getGoogleOAuthClient();
        await client.getToken(code);

        // If we got here, OAuth is considered successful for UX purposes.
        return NextResponse.redirect(
            `${base}/dashboard/settings?googleStatus=connected`,
        );
    } catch (err) {
        console.error("Google OAuth callback failed", err);
        return NextResponse.redirect(
            `${base}/dashboard/settings?googleStatus=error&googleError=exception`,
        );
    }
}
