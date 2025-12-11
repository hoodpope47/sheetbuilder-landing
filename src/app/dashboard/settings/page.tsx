import { supabaseServer } from "@/lib/supabaseServer";
import { SettingsPageClient } from "./SettingsPageClient";

type SettingsPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
    const supabase = supabaseServer;

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user?.id)
        .maybeSingle();

    const workspaceUserId = user?.id ?? "";

    const sp = await searchParams;

    const googleStatus =
        typeof sp.googleStatus === "string" ? sp.googleStatus : null;
    const googleError =
        typeof sp.googleError === "string" ? sp.googleError : null;
    const initialGoogleConnected = googleStatus === "connected";

    const initialProfile = {
        full_name: profile?.full_name ?? "",
        company: profile?.company ?? "",
        job_title: profile?.job_title ?? "",
        phone: profile?.phone ?? "",
        display_name: profile?.display_name ?? "",
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
