"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchOrCreateProfile, updateProfile } from "@/lib/userClient";
import { useTheme } from "@/lib/theme";

type TabId = "profile" | "billing" | "security";

function SettingsContent() {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get("tab") as TabId) || "profile";

    const [activeTab, setActiveTab] = useState<TabId>(initialTab);
    const [loadingProfile, setLoadingProfile] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoadingProfile(true);
            try {
                const profile = await fetchOrCreateProfile();
                if (!profile || cancelled) return;
                setFullName(profile.full_name || "");
                setEmail(profile.email || "");
                setCompany(profile.company || "");
                setRole(profile.role || "");
                setPhone(profile.phone || "");
                setAvatarUrl(profile.avatar_url || "");
            } catch (err) {
                console.error("[Settings] Failed to load profile", err);
                if (!cancelled) setProfileError("Could not load profile.");
            } finally {
                if (!cancelled) setLoadingProfile(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    async function handleProfileSave(e: React.FormEvent) {
        e.preventDefault();
        setProfileError(null);
        setSavingProfile(true);
        try {
            await updateProfile({
                full_name: fullName,
                email,
                company,
                role,
                phone,
                avatar_url: avatarUrl || null,
            });
        } catch (err: any) {
            console.error(err);
            setProfileError("Unable to save profile right now.");
        } finally {
            setSavingProfile(false);
        }
    }

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">
                        Account settings
                    </h1>
                    <p className="mt-1 text-sm text-slate-300">
                        Manage your profile, billing, and security preferences.
                    </p>
                </div>
                <Link
                    href="/dashboard"
                    className="inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200"
                >
                    ← Back to dashboard
                </Link>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-800/70">
                <nav className="-mb-px flex gap-6 text-sm">
                    {(["profile", "billing", "security"] as TabId[]).map((tab) => {
                        const label =
                            tab === "profile"
                                ? "Profile"
                                : tab === "billing"
                                    ? "Billing"
                                    : "Security";
                        const isActive = activeTab === tab;
                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={[
                                    "border-b-2 pb-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "border-emerald-400 text-slate-50"
                                        : "border-transparent text-slate-400 hover:text-slate-200",
                                ].join(" ")}
                            >
                                {label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {activeTab === "profile" && (
                <section className="sb-surface rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5">
                    <h2 className="text-sm font-semibold text-slate-50">Profile</h2>
                    <p className="mt-1 text-xs text-slate-300">
                        Update your personal details. These are used on invoices and
                        workspace emails.
                    </p>

                    {profileError && (
                        <div className="mt-3 rounded-lg border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
                            {profileError}
                        </div>
                    )}

                    <form
                        onSubmit={handleProfileSave}
                        className="mt-4 grid gap-4 md:grid-cols-2"
                    >
                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-slate-200">
                                Full name
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="Jane Doe"
                            />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                            <label className="text-xs font-medium text-slate-200">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                            />
                            <p className="text-[11px] text-slate-400">
                                We&apos;ll use this for account emails and billing receipts.
                            </p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-200">
                                Company
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                                placeholder="Acme Inc."
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-200">
                                Role / title
                            </label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="Ops lead, founder, analyst…"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-200">
                                Phone number
                            </label>
                            <input
                                type="tel"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-200">
                                Avatar URL (optional)
                            </label>
                            <input
                                type="url"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-50 outline-none focus:border-emerald-400"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://…"
                            />
                            <p className="text-[11px] text-slate-400">
                                In a future update, you&apos;ll be able to upload directly.
                            </p>
                        </div>

                        <div className="md:col-span-2 flex items-center justify-between pt-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-slate-200">
                                    Theme
                                </span>
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="sb-chip inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-medium text-emerald-300"
                                >
                                    {theme === "dark"
                                        ? "Dark · click for Light"
                                        : "Light · click for Dark"}
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
                            >
                                {savingProfile ? "Saving…" : "Save profile"}
                            </button>
                        </div>
                    </form>
                </section>
            )}

            {activeTab === "billing" && (
                <section className="sb-surface rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5">
                    <h2 className="text-sm font-semibold text-slate-50">
                        Billing & plan
                    </h2>
                    <p className="mt-1 text-xs text-slate-300">
                        Your subscription and invoices are managed securely via Stripe.
                    </p>

                    <div className="mt-4 flex flex-col gap-3">
                        <div className="rounded-xl bg-slate-900/90 px-4 py-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Current plan
                            </p>
                            <p className="mt-1 text-sm font-semibold text-emerald-400">
                                FREE
                            </p>
                            <p className="mt-1 text-xs text-slate-300">
                                Sheets used this month: 0 (demo value — will sync with usage
                                tracking when live).
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300"
                            >
                                View plans &amp; upgrade
                            </Link>

                            <button
                                type="button"
                                className="inline-flex items-center rounded-full border border-slate-600 px-4 py-1.5 text-xs font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200"
                            >
                                Manage billing (coming soon)
                            </button>
                        </div>

                        <p className="mt-1 text-[11px] text-slate-400">
                            Once Stripe is fully connected in production, this panel will show
                            your active subscription, invoices, and a link to the customer
                            portal.
                        </p>
                    </div>
                </section>
            )}

            {activeTab === "security" && (
                <section className="sb-surface rounded-2xl border border-slate-800/80 bg-slate-900/70 p-5 space-y-5">
                    <div>
                        <h2 className="text-sm font-semibold text-slate-50">Security</h2>
                        <p className="mt-1 text-xs text-slate-300">
                            Industry-standard options to keep your account safe.
                        </p>
                    </div>

                    {/* Change password */}
                    <div className="rounded-xl bg-slate-900/90 px-4 py-3">
                        <h3 className="text-xs font-semibold text-slate-100">
                            Change password
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-400">
                            In a production build, this will trigger a secure password reset
                            flow via Supabase Auth or your chosen provider.
                        </p>
                        <button
                            type="button"
                            className="mt-3 inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200"
                        >
                            Send password reset email
                        </button>
                    </div>

                    {/* Sessions */}
                    <div className="rounded-xl bg-slate-900/90 px-4 py-3">
                        <h3 className="text-xs font-semibold text-slate-100">
                            Active sessions & devices
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-400">
                            This demo panel will later show the browsers and devices where
                            you&apos;re signed in, with the ability to sign out remotely.
                        </p>
                        <button
                            type="button"
                            className="mt-3 inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-red-400/80 hover:text-red-200"
                        >
                            Sign out of all other sessions (coming soon)
                        </button>
                    </div>

                    {/* 2FA */}
                    <div className="rounded-xl bg-slate-900/90 px-4 py-3">
                        <h3 className="text-xs font-semibold text-slate-100">
                            Two-factor authentication
                        </h3>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Industry-standard 2FA with an authenticator app (TOTP). This is a
                            placeholder for when we connect a real auth provider.
                        </p>
                        <button
                            type="button"
                            className="mt-3 inline-flex items-center rounded-full border border-slate-600 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-emerald-400/70 hover:text-emerald-200"
                        >
                            Enable 2FA (coming soon)
                        </button>
                    </div>

                    {/* Danger zone */}
                    <div className="rounded-xl border border-red-500/50 bg-red-900/10 px-4 py-3">
                        <h3 className="text-xs font-semibold text-red-200">
                            Danger zone
                        </h3>
                        <p className="mt-1 text-[11px] text-red-100/80">
                            Deleting your account will remove your profile and disconnect
                            Stripe in a production setup. This is a demo placeholder only.
                        </p>
                        <button
                            type="button"
                            className="mt-3 inline-flex items-center rounded-full border border-red-500/70 px-3 py-1.5 text-[11px] font-medium text-red-100 hover:bg-red-500/10"
                        >
                            Delete account (coming soon)
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 px-4 py-8">
            <Suspense fallback={<div className="text-sm text-slate-400">Loading settings...</div>}>
                <SettingsContent />
            </Suspense>
        </main>
    );
}
