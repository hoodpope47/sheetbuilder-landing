import { google } from 'googleapis';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { getOAuthClient } from '@/lib/googleClient';

export async function getSheetsClientForUser(userId: string) {
    const { data, error } = await supabaseAdmin
        .from('user_google_tokens')
        .select('access_token, refresh_token, expiry_date')
        .eq('user_id', userId)
        .maybeSingle();

    if (error || !data || !data.access_token) {
        throw new Error('google_not_connected');
    }

    const { oauth2Client } = getOAuthClient();

    oauth2Client.setCredentials({
        access_token: data.access_token,
        refresh_token: data.refresh_token ?? undefined,
        expiry_date: data.expiry_date ? new Date(data.expiry_date).getTime() : undefined
    });

    const sheets = google.sheets({ version: 'v4', auth: oauth2Client });
    return sheets;
}
