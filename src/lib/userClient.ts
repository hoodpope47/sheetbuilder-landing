import { supabase } from "@/lib/supabaseClient";

// --- User's Safe Logic ---

const SUPABASE_ENABLED =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function isValidUuid(value: string | null | undefined): boolean {
    if (!value) return false;
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(
        value
    );
}

export type UserProfile = {
    id: string;
    email: string | null;
    full_name: string | null;
    company?: string | null;
    role?: string | null;
    phone?: string | null;
    avatar_url?: string | null;
    created_at?: string;
    updated_at?: string;
};

// Alias for backward compatibility if needed
export type ProfileRow = UserProfile;

export type UserSettings = {
    id: string;
    theme: "light" | "dark";
    notifications_email: boolean;
    notifications_product: boolean;
    created_at?: string;
    updated_at?: string;
};

// Alias for backward compatibility if needed
export type UserSettingsRow = UserSettings;

function canHitSupabase(userId: string | null | undefined): boolean {
    if (!SUPABASE_ENABLED) {
        if (process.env.NODE_ENV === "development") {
            console.info("[userClient] Supabase disabled (missing env vars). Skipping DB call.");
        }
        return false;
    }
    if (!isValidUuid(userId)) {
        if (process.env.NODE_ENV === "development") {
            console.info("[userClient] Skipping DB call (userId is not a UUID)", { userId });
        }
        return false;
    }
    return true;
}

// --- Existing Local ID Logic ---

const LOCAL_USER_ID_KEY = "sheetbuilder_user_id";

export function getOrCreateLocalUserId(): string {
    if (typeof window === "undefined") return "demo-user-id";
    let id = window.localStorage.getItem(LOCAL_USER_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        window.localStorage.setItem(LOCAL_USER_ID_KEY, id);
    }
    return id;
}

// --- New Safe Functions ---

export async function getOrCreateUserProfile(
    userId: string,
    email?: string | null,
    fullName?: string | null
): Promise<UserProfile | null> {
    if (!canHitSupabase(userId)) {
        // Return mock data for demo users so UI doesn't break
        return {
            id: userId,
            email: email || "demo@sheetbuilder.ai",
            full_name: fullName || "Demo User",
            company: null,
            role: null,
            phone: null,
            avatar_url: null
        };
    }

    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle<UserProfile>();

    if (error && error.code !== "PGRST116") {
        console.error("[userClient] Failed to fetch profile", error);
        return null;
    }

    if (data) {
        return data;
    }

    // Create new profile if none exists
    const { data: insertData, error: insertError } = await supabase
        .from("profiles")
        .insert({
            id: userId,
            email: email ?? null,
            full_name: fullName ?? null,
        })
        .select("*")
        .maybeSingle<UserProfile>();

    if (insertError) {
        console.error("[userClient] Failed to create profile", insertError);
        return null;
    }

    return insertData ?? null;
}

export async function getOrCreateUserSettings(
    userId: string
): Promise<UserSettings | null> {
    if (!canHitSupabase(userId)) {
        // Return mock settings
        return {
            id: "mock-settings-id",
            theme: "dark",
            notifications_email: true,
            notifications_product: true
        } as any;
    }

    const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle<UserSettings>();

    if (error && error.code !== "PGRST116") {
        console.error("[userClient] Failed to fetch user_settings", error);
        return null;
    }

    if (data) {
        return data;
    }

    const { data: insertData, error: insertError } = await supabase
        .from("user_settings")
        .insert({
            user_id: userId,
            theme: "dark",
            notifications_email: true,
            notifications_product: true,
        })
        .select("*")
        .maybeSingle<UserSettings>();

    if (insertError) {
        console.error("[userClient] Failed to create user_settings", insertError);
        return null;
    }

    return insertData ?? null;
}

export async function updateUserTheme(
    userId: string,
    theme: "light" | "dark"
): Promise<void> {
    if (!canHitSupabase(userId)) {
        return;
    }

    const { error } = await supabase
        .from("user_settings")
        .update({ theme })
        .eq("user_id", userId);

    if (error) {
        console.error("[userClient] Failed to update theme", error);
        return;
    }
}

// --- Adapters for Backward Compatibility ---

export async function fetchOrCreateProfile(): Promise<UserProfile | null> {
    const userId = getOrCreateLocalUserId();
    return getOrCreateUserProfile(userId);
}

export async function updateProfile(
    updates: Partial<Omit<UserProfile, "id" | "created_at">>
): Promise<UserProfile | null> {
    const userId = getOrCreateLocalUserId();

    if (!canHitSupabase(userId)) {
        console.log("[userClient] Mock update profile:", updates);
        return {
            id: userId,
            email: updates.email || "demo@sheetbuilder.ai",
            full_name: updates.full_name || "Demo User",
            company: null,
            role: null,
            phone: null,
            avatar_url: null,
            ...updates
        } as UserProfile;
    }

    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select("*")
        .single();

    if (error) {
        console.error("[userClient] Failed to update profile", error);
        throw error;
    }

    return data as UserProfile;
}

export async function fetchUserSettings(): Promise<UserSettings | null> {
    const userId = getOrCreateLocalUserId();
    return getOrCreateUserSettings(userId);
}

export async function updateThemePreference(theme: "light" | "dark"): Promise<UserSettings | null> {
    const userId = getOrCreateLocalUserId();
    await updateUserTheme(userId, theme);
    return getOrCreateUserSettings(userId);
}

// Convenience wrappers from user request
export async function ensureUserProfile(
    userId: string,
    email?: string | null,
    fullName?: string | null
) {
    return getOrCreateUserProfile(userId, email, fullName);
}

export async function ensureUserSettings(userId: string) {
    return getOrCreateUserSettings(userId);
}
