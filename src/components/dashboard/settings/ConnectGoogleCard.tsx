"use client";

import { useEffect, useMemo, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleLogo } from "./GoogleLogo";
import { useToast } from "@/components/ui/ToastProvider";
import { cardClasses } from "@/design-system/theme";

type ConnectGoogleCardProps = {
    connected: boolean;
    connectedLabel?: string | null;
    lastUpdated?: string | null;
};

export function ConnectGoogleCard({
    connected,
    connectedLabel,
    lastUpdated,
}: ConnectGoogleCardProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { showToast } = useToast();
    const [isPending, startTransition] = useTransition();

    const formattedLastUpdated = useMemo(() => {
        if (!lastUpdated) return null;
        try {
            return new Date(lastUpdated).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        } catch {
            return lastUpdated;
        }
    }, [lastUpdated]);

    useEffect(() => {
        const googleStatus = searchParams.get("googleStatus");
        const googleError = searchParams.get("googleError");

        if (!googleStatus && !googleError) return;

        if (googleStatus === "connected") {
            showToast({
                variant: "success",
                title: "Google account connected",
                message: "We'll use this to create and update your Sheets.",
            });
        } else if (googleStatus === "disconnected") {
            showToast({
                variant: "info",
                title: "Disconnected from Google",
                message: "You can reconnect any time from Settings.",
            });
        } else if (googleStatus === "error") {
            showToast({
                variant: "error",
                title: "Google connection failed",
                message: "We couldn't complete Google sign-in. Please try again.",
            });
        }

        if (googleError === "start_failed") {
            showToast({
                variant: "error",
                title: "Google connection failed",
                message: "We couldn't start Google sign-in. Please try again.",
            });
        } else if (googleError === "disconnect_failed") {
            showToast({
                variant: "error",
                title: "Couldn't disconnect Google",
                message: "Please try again, or contact support if this persists.",
            });
        } else if (googleError === "no_session") {
            showToast({
                variant: "error",
                title: "Please sign in",
                message: "Log in before connecting your Google account.",
            });
        }

        const params = new URLSearchParams(searchParams.toString());
        params.delete("googleStatus");
        params.delete("googleError");
        const next = params.toString()
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;

        router.replace(next);
    }, [router, searchParams, showToast]);

    const handleConnect = () => {
        window.location.href = "/api/google/oauth/start";
    };

    const handleDisconnect = () => {
        if (isPending) return;

        startTransition(async () => {
            try {
                const response = await fetch("/api/google/oauth/disconnect", {
                    method: "POST",
                });

                if (response.status >= 400) {
                    throw new Error("disconnect_failed");
                }

                showToast({
                    variant: "info",
                    title: "Disconnected from Google",
                    message: "You can reconnect any time from Settings.",
                });

                router.refresh();
            } catch (error) {
                console.error("[ConnectGoogleCard] disconnect error:", error);
                showToast({
                    variant: "error",
                    title: "Couldn't disconnect Google",
                    message: "Please try again.",
                });
            }
        });
    };

    return (
        <div className={cardClasses.primary}>
            <div className="space-y-3">
                <div>
                    <h3 className="text-base font-semibold text-slate-900">
                        Connect Google Sheets
                    </h3>
                    <p className="mt-2 text-sm text-slate-500">
                        {connected
                            ? "Google Sheets is connected. We'll create and update spreadsheets directly in your Drive."
                            : "Connect your Google account so AI Sheet Builder can create and manage spreadsheets in your Drive."}
                    </p>
                    {connected && (
                        <p className="mt-2 text-xs text-slate-500">
                            Connected as{" "}
                            <span className="font-medium text-slate-700">
                                {connectedLabel || "Google account"}
                            </span>
                            {formattedLastUpdated && (
                                <span>
                                    {" "}
                                    · Last updated{" "}
                                    <span className="font-medium text-slate-700">
                                        {formattedLastUpdated}
                                    </span>
                                </span>
                            )}
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {connected ? (
                        <button
                            type="button"
                            onClick={handleDisconnect}
                            disabled={isPending}
                            className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <GoogleLogo />
                            {isPending ? "Disconnecting…" : "Disconnect Google"}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleConnect}
                            disabled={isPending}
                            className="inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <GoogleLogo />
                            {isPending ? "Connecting…" : "Connect Google"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
