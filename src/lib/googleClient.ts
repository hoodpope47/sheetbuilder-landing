import { google } from "googleapis";

const scopes = [
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/spreadsheets",
];

export function getOAuthClient() {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI!;

    const oauth2Client = new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
    );

    return { oauth2Client, scopes };
}
