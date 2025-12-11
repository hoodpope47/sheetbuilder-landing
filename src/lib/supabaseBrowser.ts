"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClient: SupabaseClient | null = null;

/**
 * Browser-side Supabase client.
 * Use this ONLY in client components or hooks.
 */
export function supabaseBrowser(): SupabaseClient {
    if (!browserClient) {
        browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return browserClient;
}
