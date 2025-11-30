"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/auth";
import { setUser } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Please enter both email (or username) and password.");
      return;
    }

    setIsSubmitting(true);

    const ok = authenticate(emailOrUsername.trim(), password);
    if (!ok) {
      setIsSubmitting(false);
      setError("Invalid credentials. Try admin / admin123.");
      return;
    }

    // Dev-only session
    setUser("admin");
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-slate-200 px-8 py-10">
        <h1 className="text-center text-2xl font-semibold tracking-tight text-slate-900 mb-6">
          Sign in
        </h1>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50 transition"
          >
            <span className="mr-2 text-lg">🟢</span>
            <span>Sign in with Google</span>
          </button>
          <button
            type="button"
            className="w-full inline-flex items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-900 transition"
          >
            <span className="mr-2 text-lg"></span>
            <span>Sign in with Apple</span>
          </button>
        </div>

        <div className="flex items-center my-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="mx-3 text-[11px] font-medium tracking-[0.16em] text-slate-400 uppercase">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Email or username
            </label>
            <input
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              placeholder="you@example.com or admin"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 w-full inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>

          <p className="mt-3 text-[11px] text-center text-slate-400">
            Dev login: <span className="font-mono">admin / admin123</span>
          </p>
        </form>
      </div>
    </div>
  );
}
