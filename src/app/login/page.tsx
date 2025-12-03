"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Admin alias support: allow "admin" in the email field to map to a real email.
// IMPORTANT: change ADMIN_EMAIL to the actual admin email in your Supabase project.
const ADMIN_USERNAME = "admin";
const ADMIN_EMAIL = "admin@sheetbuilder.ai"; // e.g. "admin@sheetbuilder.ai"

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loadingEmailLogin, setLoadingEmailLogin] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  async function handleEmailLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoadingEmailLogin(true);

      // If the user types "admin" instead of an email, map to the real admin email.
      let loginEmail = email.trim();
      if (loginEmail.toLowerCase() === ADMIN_USERNAME.toLowerCase()) {
        loginEmail = ADMIN_EMAIL;
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Unable to log in.");
        return;
      }

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Unable to log in.");
    } finally {
      setLoadingEmailLogin(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError(null);
      setLoadingGoogle(true);

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (oauthError) {
        setError(oauthError.message || "Google sign-in failed.");
      }
      // Supabase handles the redirect for Google.
    } catch (err: any) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoadingGoogle(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 md:flex-row">
        {/* LEFT: Hero */}
        <section className="flex-1 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 px-6 py-8 shadow-[0_0_80px_rgba(15,23,42,0.9)] mb-6 md:mb-0 w-full">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-[11px] font-medium text-emerald-300 mb-4">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            AI Sheet Builder · Workspace
          </div>

          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-50">
            Turn messy ideas into structured,{" "}
            <span className="text-emerald-400">
              production-ready Google Sheets.
            </span>
          </h1>

          <p className="mt-3 text-sm text-slate-300 max-w-lg">
            Log in to your workspace to generate new sheets, browse templates,
            and track how much time you&apos;ve saved with automation.
          </p>

          <ul className="mt-4 space-y-2 text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-500/15 text-[10px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>AI-designed sheets for sales, ops, finance, and content.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-500/15 text-[10px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>Usage tracking so you can see how automation compounds.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-[3px] h-4 w-4 rounded-full bg-emerald-500/15 text-[10px] flex items-center justify-center text-emerald-300">
                ✓
              </span>
              <span>
                Secure account with profile, billing, and settings in one place.
              </span>
            </li>
          </ul>

          <div className="mt-6 flex items-center justify-between text-[11px] text-slate-500">
            <span>SheetBuilder Workspace · 2025</span>
            <span>Built for people who live in Google Sheets.</span>
          </div>
        </section>

        {/* RIGHT: Login card */}
        <section className="flex-1 w-full">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/80 px-6 py-7 shadow-[0_0_80px_rgba(15,23,42,0.9)] backdrop-blur max-w-md mx-auto w-full">
            <div className="flex items-center gap-2 mb-5">
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

            {/* Google OAuth (Apple button removed) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loadingGoogle}
              className="mb-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-50 hover:bg-slate-800 transition disabled:opacity-70 disabled:cursor-wait"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
                <span className="text-[12px] leading-none text-slate-900 font-bold">
                  G
                </span>
              </span>
              <span>
                {loadingGoogle ? "Connecting to Google…" : "Continue with Google"}
              </span>
            </button>

            <div className="flex items-center gap-2 my-4">
              <div className="h-px flex-1 bg-slate-800" />
              <span className="text-[11px] text-slate-500">
                or continue with email
              </span>
              <div className="h-px flex-1 bg-slate-800" />
            </div>

            {/* Email/password login (supports "admin" alias) */}
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
                  type="text"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="you@business.com or admin"
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
                    className="text-[11px] text-emerald-300 hover:text-emerald-200"
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
                  className="h-10 w-full rounded-lg border border-slate-700 bg-slate-900/70 px-3 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loadingEmailLogin}
                className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition shadow-[0_0_25px_rgba(45,212,191,0.4)] disabled:opacity-70 disabled:cursor-wait"
              >
                {loadingEmailLogin ? "Signing you in…" : "Continue to dashboard"}
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
        </section>
      </div>
    </main>
  );
}