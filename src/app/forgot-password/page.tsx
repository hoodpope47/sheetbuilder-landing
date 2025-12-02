"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setInfo(null);

        if (!email) {
            setError("Please enter the email you used for your account.");
            return;
        }

        try {
            setLoading(true);
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(
                email
            );

            if (resetError) {
                setError(resetError.message || "Could not send reset email.");
                return;
            }

            setInfo("Check your inbox for a password reset link.");
        } catch (err: any) {
            setError(err.message || "Could not send reset email.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                <div className="mb-4">
                    <p className="text-xs font-semibold tracking-[0.14em] uppercase text-emerald-400">
                        Account
                    </p>
                    <h1 className="mt-1 text-lg font-semibold">Reset your password</h1>
                    <p className="mt-1 text-[11px] text-slate-400">
                        Enter the email linked to your workspace and we&apos;ll send you a
                        secure reset link.
                    </p>
                </div>

                {error && (
                    <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                        {error}
                    </div>
                )}
                {info && (
                    <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                        {info}
                    </div>
                )}

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
                            className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            placeholder="you@business.com"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? "Sending link…" : "Send reset link"}
                    </button>
                </form>

                <p className="mt-4 text-[11px] text-slate-400 text-center">
                    Remembered your password?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-emerald-300 hover:text-emerald-200"
                    >
                        Back to login
                    </Link>
                </p>
            </div>
        </main>
    );
}
