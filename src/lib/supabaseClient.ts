"use client";

import { createBrowserClient } from "@supabase/auth-helpers-nextjs";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
    if (browserClient) return browserClient;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
        console.warn(
            "[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set. Supabase client will be null."
        );
        return null;
    }

    browserClient = createBrowserClient(url, anonKey);
    return browserClient;
}
