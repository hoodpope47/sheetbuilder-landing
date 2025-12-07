import { NextRequest, NextResponse } from "next/server";
import { getOAuthClient } from "@/lib/googleClient";

export async function GET(request: NextRequest) {
    const url = new URL(request.url);
    const uid = url.searchParams.get("uid");

    if (!uid) {
        return NextResponse.redirect(
            new URL("/dashboard/settings?googleError=no_session", request.url)
        );
    }

    const { oauth2Client, scopes } = getOAuthClient();

    const authorizationUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        include_granted_scopes: true,
        prompt: "consent",
        scope: scopes,
        state: uid
    });

    return NextResponse.redirect(authorizationUrl);
}
