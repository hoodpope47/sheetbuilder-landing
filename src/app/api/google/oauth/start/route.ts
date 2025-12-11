import { NextRequest, NextResponse } from "next/server";
import { getGoogleOAuthClient } from "@/lib/googleOAuthServer";
import { captureError } from "@/lib/monitoring";

const SCOPES = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
    "openid",
    "email",
    "profile",
];

export async function GET(_req: NextRequest) {
    try {
        const client = getGoogleOAuthClient();

        const authorizationUrl = client.generateAuthUrl({
            access_type: "offline",
            scope: SCOPES,
            include_granted_scopes: true,
            prompt: "consent",
            // We are not threading state here in this step to keep it simple.
        });

        return NextResponse.redirect(authorizationUrl);
    } catch (error) {
        // Log but avoid crashing the app
        try {
            captureError?.(error, { context: "google_oauth_start" });
        } catch {
            // ignore monitoring failures
        }

        const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
        return NextResponse.redirect(
            `${base}/dashboard/settings?googleError=start_failed`,
        );
    }
}
