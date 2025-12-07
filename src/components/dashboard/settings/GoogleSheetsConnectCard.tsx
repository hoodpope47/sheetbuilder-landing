"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ui/ToastProvider";
import { cardClasses } from "@/design-system/theme";

type ConnectionStatus = {
    connected: boolean;
    updatedAt: string | null;
};

export function GoogleSheetsConnectCard() {
    const { showToast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<ConnectionStatus>({
        connected: false,
        updatedAt: null,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchConnectionStatus() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data: googleToken } = await supabase
                    .from("user_google_tokens")
                    .select("updated_at")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (googleToken) {
                    setStatus({
                        connected: true,
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

    // Handle toast notifications from query params
    useEffect(() => {
        const googleStatus = searchParams.get("googleStatus");

        if (!googleStatus) return;

        if (googleStatus === "connected") {
            showToast({
                variant: "success",
                title: "Google account connected",
                message: "We'll use this to create and update your Sheets.",
            });
            // Refresh connection status
            fetchConnectionStatus();
        } else if (googleStatus === "error") {
            showToast({
                variant: "error",
                title: "Google connection failed",
                message: "We couldn't save your Google connection. Please try again.",
            });
        }

        // Clean up URL params
        const params = new URLSearchParams(window.location.search);
        params.delete("googleStatus");
        params.delete("reason");
        const next = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;

        router.replace(next);

        async function fetchConnectionStatus() {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: googleToken } = await supabase
                    .from("user_google_tokens")
                    .select("updated_at")
                    .eq("user_id", user.id)
                    .maybeSingle();

                if (googleToken) {
                    setStatus({
                        connected: true,
                        updatedAt: googleToken.updated_at || null,
                    });
                }
            } catch (error) {
                console.error("[GoogleSheetsConnectCard] Error:", error);
            }
        }
    }, [searchParams, showToast, router]);

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

    function handleConnect() {
        window.location.href = "/api/google/oauth/start";
    }

    return (
        <div className={cardClasses.primary}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-sm font-medium text-slate-900">
                        Connect Google Sheets
                    </h2>

                    {status.connected ? (
                        <p className="mt-1 text-sm text-slate-500">
                            Connected as Google account
                            {status.updatedAt && (
                                <span className="text-slate-400">
                                    {" · Last updated "}
                                    {formatDate(status.updatedAt)}
                                </span>
                            )}
                        </p>
                    ) : (
                        <p className="mt-1 text-sm text-slate-500">
                            Connect your Google account so AI Sheet Builder can create and
                            manage spreadsheets directly in your Drive.
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
                <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Loading..." : status.connected ? "Reconnect Google" : "Connect Google Account"}
                </button>
            </div>
        </div>
    );
}