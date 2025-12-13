import { supabaseServer } from "@/lib/supabaseServer";
import { SettingsPageClient } from "./SettingsPageClient";

type SettingsPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = supabaseServer;

    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
        console.error("[Settings page] auth.getUser error", userError);
    }

    let profileRow: any = null;
    if (user) {
        const { data, error } = await supabase
            .from("workspace_profiles")
            .select("full_name, company_name, role")
            .eq("workspace_user_id", user.id)
            .maybeSingle();

        if (error) {
            console.error("[Settings page] workspace_profiles error", error);
        } else {
            profileRow = data;
        }
    }

    const workspaceUserId = user?.id ?? "";

    const sp = await searchParams;

    const googleStatus =
        typeof sp.googleStatus === "string" ? sp.googleStatus : null;
    const googleError =
        typeof sp.googleError === "string" ? sp.googleError : null;
    const initialGoogleConnected = googleStatus === "connected";

    const initialProfile = {
        full_name: profileRow?.full_name ?? "",
        company_name: profileRow?.company_name ?? "",
        role: profileRow?.role ?? "",
        phone: "",
        display_name: "",
        profile_picture_url: "",
    };

    let googleConnected = false;
    let googleConnectedLabel: string | null = null;
    let googleLastUpdatedLabel: string | null = null;

    if (user) {
        const { data: tokenRow } = await supabase
            .from("user_google_tokens")
            .select("updated_at, google_email, email")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (tokenRow) {
            googleConnected = true;
            googleConnectedLabel =
                // Prefer explicit google_email, fall back to email column if present
                (tokenRow as any).google_email ??
                (tokenRow as any).email ??
                "Google account";

            if (tokenRow.updated_at) {
                try {
                    googleLastUpdatedLabel = new Date(tokenRow.updated_at).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                    );
                } catch {
                    googleLastUpdatedLabel = tokenRow.updated_at;
                }
            }
        }
    }

    return (
        <SettingsPageClient
            initialProfile={initialProfile}
            initialGoogleConnected={initialGoogleConnected}
            googleStatus={googleStatus}
            googleError={googleError}
            workspaceUserId={workspaceUserId}
            hasGoogleConnection={googleConnected}
            googleConnected={googleConnected}
            googleConnectedLabel={googleConnectedLabel}
            googleLastUpdatedLabel={googleLastUpdatedLabel}
        />
    );
}
