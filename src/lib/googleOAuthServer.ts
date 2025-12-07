import { google } from "googleapis";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

export function getGoogleOAuthClient() {
    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

export async function exchangeCodeForTokens(code: string) {
    const client = getGoogleOAuthClient();
    const { tokens } = await client.getToken(code);
    return tokens;
}
