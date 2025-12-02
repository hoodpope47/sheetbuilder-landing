"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Unable to sign in.");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        setError(error.message || "Google sign-in failed.");
      }
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    }
  }

  async function handleAppleLogin() {
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        setError(error.message || "Apple sign-in failed.");
      }
    } catch (err: any) {
      setError(err.message || "Apple sign-in failed.");
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="grid max-w-4xl w-full gap-8 md:grid-cols-[1.1fr,1fr] items-center">
        <section className="hidden md:block rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 px-8 py-9 shadow-[0_0_80px_rgba(15,23,42,0.9)]">
          <p className="inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-200">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI Sheet Builder · Workspace
          </p>
          <h1 className="mt-4 text-2xl font-semibold leading-snug">
            Turn messy ideas into structured,{" "}
            <span className="text-emerald-300">
              production-ready Google Sheets.
            </span>
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Log in to your workspace to generate new sheets, browse templates,
            and track how much time you&apos;ve saved with automation.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-slate-200">
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[11px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>AI-designed sheets for sales, ops, finance, and content.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[11px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>Usage tracking so you can see how automation compounds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-400/15 text-[11px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>Secure account with profile, billing, and settings.</span>
            </li>
          </ul>
          <div className="mt-6 flex items-center justify-between text-[11px] text-slate-500">
            <span>SheetBuilder Workspace · 2025</span>
            <span>Built for people who live in Google Sheets.</span>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950 text-sm font-semibold">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-slate-50">
                AI Sheet Builder
              </span>
              <span className="text-[11px] text-slate-400">
                Sign in to your workspace
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-3 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 text-[11px] text-red-100">
              {error}
            </div>
          )}

          <div className="space-y-3 mb-4">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-50 border border-slate-700 hover:bg-slate-800 transition"
            >
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <span className="text-[11px] leading-none text-slate-900">G</span>
              </span>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              className="inline-flex w-full items-center justify-center rounded-full bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-900 border border-slate-700 hover:bg-slate-100 transition"
            >
              <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[13px] leading-none text-white">
                
              </span>
              Continue with Apple
            </button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-[10px]">
              <span className="bg-slate-950 px-3 text-slate-500">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[11px] font-medium text-slate-200"
              >
                Email
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-medium text-slate-200"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition disabled:opacity-70 disabled:cursor-wait"
            >
              {loading ? "Signing in…" : "Continue to dashboard"}
            </button>
          </form>

          <p className="mt-4 text-[11px] text-slate-400 text-center">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-emerald-300 hover:text-emerald-200"
            >
              Start for free
            </Link>
          </p>

          <p className="mt-4 text-[10px] text-slate-500 text-center">
            By continuing, you agree to our{" "}
            <span className="underline underline-offset-2">Terms of Service</span>{" "}
            and{" "}
            <span className="underline underline-offset-2">Privacy Policy</span>.
          </p>
        </section>
      </div>
    </main>
  );
}