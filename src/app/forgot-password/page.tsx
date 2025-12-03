"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);

        const trimmedEmail = email.trim();
        if (!trimmedEmail) {
            setError("Please enter the email associated with your account.");
            return;
        }

        try {
            setLoading(true);

            const redirectTo =
                typeof window !== "undefined"
                    ? `${window.location.origin}/reset-password`
                    : undefined;

            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                trimmedEmail,
                redirectTo ? { redirectTo } : undefined
            );

            if (resetError) {
                setError(resetError.message || "Unable to send reset email.");
                return;
            }

            setSent(true);
        } catch (err: any) {
            setError(err.message || "Unable to send reset email.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="mx-auto w-full max-w-md">
                <div className="w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-xs font-semibold">
                                A
                            </div>
                            <span className="text-xs font-semibold text-slate-50">
                                AI Sheet Builder
                            </span>
                        </div>
                        <h1 className="text-lg font-semibold">Reset your password</h1>
                    </div>

                    {sent && (
                        <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                            Check your email for a link to reset your password. Once you set a
                            new password, you&apos;ll be able to log in again.
                        </div>
                    )}

                    {error && (
                        <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                            {error}
                        </div>
                    )}

                    <p className="mb-4 text-[12px] text-slate-400">
                        Enter the email you use for your workspace. We&apos;ll send you a
                        secure link to choose a new password.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="text-[11px] font-medium text-slate-200"
                            >
                                Work email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                placeholder="you@business.com"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-[0_0_25px_rgba(45,212,191,0.4)] disabled:opacity-70 disabled:cursor-wait"
                        >
                            {loading ? "Sending reset link…" : "Send reset link"}
                        </button>
                    </form>

                    <p className="mt-4 text-[11px] text-slate-400 text-center">
                        Remembered your password?{" "}
                        <a
                            href="/login"
                            className="font-medium text-emerald-300 hover:text-emerald-200"
                        >
                            Back to login
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
