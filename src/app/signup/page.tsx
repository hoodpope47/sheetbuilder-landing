"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    async function handleSignup(e: FormEvent) {
        e.preventDefault();
        setError(null);
        setEmailSent(false);

        if (!fullName || !email || !password) {
            setError("Please fill in your name, email, and password.");
            return;
        }

        try {
            setLoading(true);

            const emailRedirectTo =
                typeof window !== "undefined"
                    ? `${window.location.origin}/login`
                    : undefined;

            const { error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    ...(emailRedirectTo
                        ? {
                            emailRedirectTo,
                        }
                        : {}),
                },
            });

            if (signUpError) {
                setError(signUpError.message || "Unable to create your account.");
                return;
            }

            setEmailSent(true);
        } catch (err: any) {
            setError(err.message || "Unable to create your account.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-xs font-semibold">
                            A
                        </div>
                        <span className="text-xs font-semibold text-slate-50">
                            AI Sheet Builder
                        </span>
                    </div>
                    <h1 className="text-lg font-semibold">Create your free workspace</h1>
                </div>

                {/* Success banner */}
                {emailSent && (
                    <div className="mb-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-100">
                        Check your email to confirm your account. Once verified, you&apos;ll
                        be able to sign in to your workspace.
                    </div>
                )}

                {/* Error banner */}
                {error && (
                    <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
                        {error}
                    </div>
                )}

                {/* Email signup form */}
                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="fullName"
                            className="text-[11px] font-medium text-slate-200"
                        >
                            Full name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            autoComplete="name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            placeholder="Alex Hernandez"
                        />
                    </div>

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

                    <div className="space-y-1.5">
                        <label
                            htmlFor="password"
                            className="text-[11px] font-medium text-slate-200"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-[0_0_25px_rgba(45,212,191,0.4)] disabled:opacity-70 disabled:cursor-wait"
                    >
                        {loading ? "Creating your account…" : "Create free account"}
                    </button>
                </form>

                <p className="mt-4 text-[11px] text-slate-400 text-center">
                    Already have an account?{" "}
                    <Link
                        href="/login"
                        className="font-medium text-emerald-300 hover:text-emerald-200"
                    >
                        Log in
                    </Link>
                </p>

                <p className="mt-4 text-[10px] text-slate-500 text-center">
                    By creating an account, you agree to our{" "}
                    <Link
                        href="/terms"
                        className="underline underline-offset-2 text-slate-400 hover:text-slate-300"
                    >
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                        href="/privacy"
                        className="underline underline-offset-2 text-slate-400 hover:text-slate-300"
                    >
                        Privacy Policy
                    </Link>
                    . You can change or delete your account any time from Settings.
                </p>
            </div>
        </main>
    );
}
