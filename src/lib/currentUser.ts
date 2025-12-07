import { supabaseServer } from "@/lib/supabaseServer";

export async function getCurrentUserWithProfile() {
    const {
        data: { user },
        error,
    } = await supabaseServer.auth.getUser();

    if (error || !user) {
        return { user: null, profile: null };
    }

    const { data: profile } = await supabaseServer
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    return {
        user,
        profile,
    };
}
