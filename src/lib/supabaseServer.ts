import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase URL or SERVICE_ROLE_KEY is not set");
}

// Server-only client (safe to use ONLY in route handlers / server components)
export const supabaseServer = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        persistSession: false,
    },
});
