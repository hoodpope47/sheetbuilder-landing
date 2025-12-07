"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { cardClasses } from "@/design-system/theme";

type ConnectionStatus = {
    connected: boolean;
    email: string | null;
    updatedAt: string | null;
};

export function GoogleSheetsConnectCard() {
    const [status, setStatus] = useState<ConnectionStatus>({
        connected: false,
        email: null,
        updatedAt: null,
    });
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchConnectionStatus() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                setUserId(user.id);

                const { data: googleToken } = await supabase
                    .from("user_google_tokens")
                    .select("metadata, updated_at")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (googleToken) {
                    setStatus({
                        connected: true,
                        email: googleToken.metadata?.google_email || null,
                        updatedAt: googleToken.updated_at || null,
                    });
                }
            } catch (error) {
                console.error("[GoogleSheetsConnectCard] Error fetching status:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchConnectionStatus();
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "";
        try {
            return new Date(dateString).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return "";
        }
    };

    const googleConnectHref = userId
        ? `/api/google/oauth/start?uid=${encodeURIComponent(userId)}`
        : "/dashboard/settings?googleError=no_session";

    return (
        <div className={cardClasses.primary}>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-sm font-medium text-slate-900">
                        Connect Google Sheets
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Connect your Google account so AI Sheet Builder can create and
                        manage spreadsheets directly in your Drive.
                    </p>

                    {status.connected && (
                        <p className="mt-2 text-xs text-slate-500">
                            Connected as{" "}
                            <span className="font-medium text-slate-700">
                                {status.email ?? "Google account"}
                            </span>
                            {status.updatedAt && (
                                <>
                                    {" · Last updated "}
                                    {formatDate(status.updatedAt)}
                                </>
                            )}
                        </p>
                    )}
                </div>

                {status.connected && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        Connected
                    </span>
                )}
            </div>

            <div className="mt-4">
                <Link
                    href={googleConnectHref}
                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                    {loading ? "Loading..." : status.connected ? "Reconnect Google" : "Connect Google Account"}
                </Link>
            </div>
        </div>
    );
}