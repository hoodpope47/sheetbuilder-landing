"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProfileAndUsage, type ProfileInfo, type UsageSummary } from "@/lib/usage";

type TabId = "profile" | "billing" | "security";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("profile");
    const [profile, setProfile] = useState<ProfileInfo | null>(null);
    const [usage, setUsage] = useState<UsageSummary | null>(null);

    useEffect(() => {
        async function init() {
            const { profile, usage } = await fetchProfileAndUsage();
            setProfile(profile);
            setUsage(usage);
        }
        void init();
    }, []);

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
            <div className="mx-auto w-full max-w-4xl px-4 py-10">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
                            Account settings
                        </h1>
                        <p className="mt-1 text-sm text-slate-400">
                            Manage your profile, billing, and security preferences.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="rounded-full border border-slate-700 px-4 py-2 text-xs font-medium text-slate-300 hover:border-emerald-400/70 hover:text-emerald-200 transition"
                    >
                        ← Back to dashboard
                    </Link>
                </div>

                <div className="mb-6 flex gap-2 border-b border-slate-800">
                    {(["profile", "billing", "security"] as TabId[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={[
                                "px-3 py-2 text-xs font-medium border-b-2 transition-colors",
                                activeTab === tab
                                    ? "border-emerald-400 text-emerald-300"
                                    : "border-transparent text-slate-400 hover:text-slate-200",
                            ].join(" ")}
                        >
                            {tab[0].toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {activeTab === "profile" && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
                        <h2 className="text-sm font-semibold text-slate-50 mb-3">Profile</h2>
                        <p className="text-slate-300 mb-2">
                            Name: <span className="font-medium">{profile?.fullName ?? "Demo User"}</span>
                        </p>
                        <p className="text-slate-300 mb-2">
                            Email: <span className="font-mono text-xs">{profile?.email ?? "demo@sheetbuilder.ai"}</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-3">
                            Profile data is synced with Supabase. In a future update you’ll be able to edit this directly.
                        </p>
                    </section>
                )}

                {activeTab === "billing" && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
                        <h2 className="text-sm font-semibold text-slate-50 mb-3">Billing & plan</h2>
                        <p className="text-slate-300">
                            Current plan:{" "}
                            <span className="font-semibold text-emerald-400">
                                {(profile?.plan ?? "free").toUpperCase()}
                            </span>
                        </p>
                        <p className="mt-2 text-slate-300">
                            Sheets used this month:{" "}
                            <span className="font-medium">
                                {usage?.sheetsThisMonth ?? 0}
                            </span>
                        </p>
                        <p className="mt-2 text-xs text-slate-400">
                            Plan upgrades and billing are powered by Stripe. When your account is fully live, this section will show your invoices and subscription status.
                        </p>
                        <div className="mt-4 flex gap-2">
                            <Link
                                href="/pricing"
                                className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition"
                            >
                                View plans & upgrade
                            </Link>
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-emerald-400/80 hover:text-emerald-200 transition"
                                disabled
                            >
                                Manage billing (coming soon)
                            </button>
                        </div>
                    </section>
                )}

                {activeTab === "security" && (
                    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-sm">
                        <h2 className="text-sm font-semibold text-slate-50 mb-3">Security</h2>
                        <p className="text-slate-300">
                            This is a demo security panel. In a future update, you’ll be able to:
                        </p>
                        <ul className="mt-2 list-disc pl-5 text-slate-300 text-xs space-y-1">
                            <li>Change your password</li>
                            <li>Review active sessions and devices</li>
                            <li>Enable multi-factor authentication</li>
                        </ul>
                    </section>
                )}
            </div>
        </main>
    );
}
