"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type CallbackType =
    | "signup"
    | "magiclink"
    | "recovery"
    | "invite"
    | "email_change"
    | "reauthentication"
    | string
    | null;

interface CallbackState {
    type: CallbackType;
    title: string;
    message: string;
    redirectTo: string;
    redirectLabel: string;
    delayMs: number;
}

function parseHashType(): CallbackType {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash.startsWith("#")
        ? window.location.hash.slice(1)
        : window.location.hash;
    const params = new URLSearchParams(hash);
    const type = params.get("type");
    return (type as CallbackType) || null;
}

export default function AuthCallbackPage() {
    const router = useRouter();
    const [state, setState] = useState<CallbackState | null>(null);
    const [checkingUser, setCheckingUser] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const init = async () => {
            const type = parseHashType();

            let base: CallbackState = {
                type,
                title: "You’re all set",
                message: "Taking you back to your workspace…",
                redirectTo: "/dashboard",
                redirectLabel: "Go to dashboard",
                delayMs: 2500,
            };

            if (type === "signup") {
                base = {
                    type,
                    title: "Email verified",
                    message:
                        "Your AI Sheet Builder account is confirmed. You can now sign in to your workspace.",
                    redirectTo: "/login",
                    redirectLabel: "Go to login",
                    delayMs: 3500,
                };
            } else if (type === "magiclink") {
                base = {
                    type,
                    title: "Signed in successfully",
                    message:
                        "You’ve been signed in with a magic link. Redirecting you to your workspace…",
                    redirectTo: "/dashboard",
                    redirectLabel: "Go to dashboard",
                    delayMs: 2500,
                };
            } else if (type === "email_change") {
                base = {
                    type,
                    title: "Email updated",
                    message:
                        "Your login email has been updated. You’ll be redirected to settings in a moment.",
                    redirectTo: "/dashboard/settings",
                    redirectLabel: "Go to settings",
                    delayMs: 3000,
                };
            } else if (type === "invite") {
                base = {
                    type,
                    title: "You’ve joined a workspace",
                    message:
                        "Your invite has been confirmed. Redirecting you to your dashboard…",
                    redirectTo: "/dashboard",
                    redirectLabel: "Go to dashboard",
                    delayMs: 2500,
                };
            } else if (!type) {
                base = {
                    type: null,
                    title: "Redirecting",
                    message:
                        "We’re finishing up your authentication. You’ll be redirected automatically.",
                    redirectTo: "/dashboard",
                    redirectLabel: "Go to dashboard",
                    delayMs: 2500,
                };
            }

            try {
                // Optional: verify that we DO have a user for logged-in flows
                const { data } = await supabase.auth.getUser();
                if (!isMounted) return;

                if (!data?.user && type !== "signup") {
                    // If no user and this isn't just email verification,
                    // send them to login instead of dashboard.
                    base = {
                        ...base,
                        redirectTo: "/login",
                        redirectLabel: "Go to login",
                    };
                }

                setState(base);

                // Auto-redirect after delay
                setTimeout(() => {
                    if (!isMounted) return;
                    router.push(base.redirectTo);
                }, base.delayMs);
            } finally {
                if (isMounted) {
                    setCheckingUser(false);
                }
            }
        };

        init();

        return () => {
            isMounted = false;
        };
    }, [router]);

    const title = state?.title || "Redirecting…";
    const message =
        state?.message ||
        "We’re finishing up your authentication. You’ll be redirected automatically.";
    const redirectLabel = state?.redirectLabel || "Continue";

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                <div className="flex items-center gap-2 mb-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-sm font-semibold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-50">
                            AI Sheet Builder
                        </span>
                        <span className="text-[11px] text-slate-400">
                            Authentication in progress
                        </span>
                    </div>
                </div>

                <div className="mb-3 rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-4">
                    <h1 className="text-base font-semibold text-slate-50 mb-1.5">
                        {title}
                    </h1>
                    <p className="text-[12px] text-slate-300">{message}</p>

                    <p className="mt-2 text-[11px] text-slate-500">
                        If nothing happens, click the button below to continue.
                    </p>

                    <button
                        type="button"
                        onClick={() => state && router.push(state.redirectTo)}
                        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-[0_0_25px_rgba(45,212,191,0.4)]"
                    >
                        {redirectLabel}
                    </button>
                </div>

                {!checkingUser && (
                    <p className="mt-2 text-[10px] text-slate-500 text-center">
                        You can close this tab once you’ve been redirected. Your AI Sheet
                        Builder workspace will remember your login.
                    </p>
                )}
            </div>
        </main>
    );
}
