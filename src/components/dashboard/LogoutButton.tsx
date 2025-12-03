"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogout() {
        try {
            setLoading(true);
            setError(null);

            const { error: signOutError } = await supabase.auth.signOut();
            if (signOutError) {
                setError(signOutError.message || "Failed to sign out.");
                return;
            }

            // After sign-out, send user back to login
            router.push("/login");
        } catch (err: any) {
            setError(err?.message || "Unexpected error while signing out.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="mt-3 flex flex-col items-start gap-2">
            {error && (
                <div className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700">
                    {error}
                </div>
            )}
            <button
                type="button"
                onClick={handleLogout}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
                {loading ? "Signing you out…" : "Log out of workspace"}
            </button>
            <p className="text-[11px] text-slate-500">
                You can sign back in any time with your email and password.
            </p>
        </div>
    );
}
