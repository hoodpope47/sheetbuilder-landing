"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// If you have a generated Database type, you can import it and use:
// import type { Database } from "@/types/supabase";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Simple singleton so we don't recreate the client on every call
let browserClient: SupabaseClient | null = null;

export function createSupabaseClient() {
    if (!browserClient) {
        if (!supabaseUrl || !supabaseAnonKey) {
            // Helpful debug log if env vars are missing
            // This will show up in the browser console if something is misconfigured
            console.error(
                "[supabaseClientComponent] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars.",
            );
        }

        browserClient = createClient(supabaseUrl, supabaseAnonKey);
    }

    return browserClient;
}
