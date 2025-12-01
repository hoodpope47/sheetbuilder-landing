import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[supabaseClient] Missing SUPABASE env vars");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
    },
});

// Helper type for rows
export type ProfileRow = {
    id: string;
    email: string | null;
    full_name: string | null;
    company: string | null;
    role: string | null;
    phone: string | null;
    avatar_url: string | null;
    created_at: string;
};

export type UserSettingsRow = {
    id: string;
    user_id: string;
    theme: "dark" | "light";
    created_at: string;
    updated_at: string;
};
