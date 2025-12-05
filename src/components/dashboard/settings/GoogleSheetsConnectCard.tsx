"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

export function GoogleSheetsConnectCard() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleConnect() {
        try {
            setError(null);
            setLoading(true);

            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            if (!supabaseUrl || !supabaseAnonKey) {
                console.error(
                    "[GoogleConnect] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
                );
                setError(
                    "Supabase is not configured correctly. Please check your environment variables."
                );
                setLoading(false);
                return;
            }

            // Create a browser Supabase client
            const supabase = createClient(supabaseUrl, supabaseAnonKey);

            const redirectTo =
                typeof window !== "undefined"
                    ? `${window.location.origin}/dashboard/settings`
                    : undefined;

            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    scopes:
                        "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
                    redirectTo,
                },
            });

            if (error) {
                console.error("[GoogleConnect] OAuth error", error);
                setError(error.message);
                setLoading(false);
            }
            // On success, Supabase will redirect to Google and then back to /dashboard/settings
        } catch (err) {
            console.error("[GoogleConnect] Unexpected error", err);
            setError("Something went wrong starting Google sign-in.");
            setLoading(false);
        }
    }

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col gap-3">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">
                        Connect Google Sheets
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Connect your Google account so AI Sheet Builder can create and
                        manage Sheets directly in your Drive. You&apos;ll approve access on
                        Google&apos;s side.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleConnect}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {loading ? "Redirecting to Google..." : "Connect Google Account"}
                </button>

                <p className="text-[11px] leading-relaxed text-slate-400">
                    We request limited access to create and update spreadsheets on your
                    behalf. You can revoke access anytime from your Google Account
                    settings.
                </p>

                {error && (
                    <p className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-medium text-red-700">
                        {error}
                    </p>
                )}
            </div>
        </section>
    );
}