"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
    const router = useRouter();

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [checkingSession, setCheckingSession] = useState(true);
    const [sessionOk, setSessionOk] = useState(false);

    // After Supabase redirects back with a recovery token, the browser client
    // will create a temporary session. We just need to verify that we have a user.
    useEffect(() => {
        let isMounted = true;

        const checkUser = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (!isMounted) return;

                if (error || !data?.user) {
                    setSessionOk(false);
                    setError(
                        "This password reset link is invalid or has expired. Please request a new one."
                    );
                } else {
                    setSessionOk(true);
                }
            } catch (err: any) {
                if (!isMounted) return;
                setSessionOk(false);
                setError(
                    err?.message ||
                    "Something went wrong while validating your reset link."
                );
            } finally {
                if (isMounted) {
                    setCheckingSession(false);
                }
            }
        };

        checkUser();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!password || !confirm) {
            setError("Please enter and confirm your new password.");
            return;
        }

        if (password.length < 8) {
            setError("Your new password must be at least 8 characters long.");
            return;
        }

        if (password !== confirm) {
            setError("Passwords do not match. Please try again.");
            return;
        }

        try {
            setLoading(true);

            const { error: updateError } = await supabase.auth.updateUser({
                password,
            });

            if (updateError) {
                setError(updateError.message || "Failed to reset your password.");
                return;
            }

            setSuccess("Your password has been updated. Redirecting to login…");

            // Give the user a moment to read the message, then send to login
            setTimeout(() => {
                router.push("/login");
            }, 2000);
        } catch (err: any) {
            setError(err?.message || "Unexpected error while resetting password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="mx-auto w-full max-w-md">
                <div className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                    <div className="flex items-center gap-2 mb-5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-sm font-semibold">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-50">
                                AI Sheet Builder
                            </span>
                            <span className="text-[11px] text-slate-400">
                                Choose a new password
                            </span>
                        </div>
                    </div>

                    {checkingSession && (
                        <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-200">
                            Validating your reset link…
                        </div>
                    )}

                    {!checkingSession && !sessionOk && (
                        <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                            {error ||
                                "This password reset link is invalid or has expired. Please request a new one from the login page."}
                        </div>
                    )}

                    {!checkingSession && sessionOk && (
                        <>
                            {error && (
                                <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="new-password"
                                        className="text-[11px] font-medium text-slate-200"
                                    >
                                        New password
                                    </label>
                                    <input
                                        id="new-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label
                                        htmlFor="confirm-password"
                                        className="text-[11px] font-medium text-slate-200"
                                    >
                                        Confirm new password
                                    </label>
                                    <input
                                        id="confirm-password"
                                        type="password"
                                        autoComplete="new-password"
                                        value={confirm}
                                        onChange={(e) => setConfirm(e.target.value)}
                                        className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-[0_0_25px_rgba(45,212,191,0.4)] disabled:opacity-70 disabled:cursor-wait"
                                >
                                    {loading ? "Updating password…" : "Save new password"}
                                </button>
                            </form>

                            <p className="mt-4 text-[10px] text-slate-500 text-center">
                                If this wasn&apos;t you, you can safely ignore the email. Your AI
                                Sheet Builder account will stay secure.
                            </p>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}
