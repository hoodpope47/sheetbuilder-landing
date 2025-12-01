"use client";

import { useState } from "react";

type TabId = "account" | "security" | "preferences" | "billing";

export default function SettingsPage() {
    const [tab, setTab] = useState<TabId>("account");

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">
                    Account settings
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Manage your profile, security, and billing preferences.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[200px,1fr]">
                {/* Left tabs */}
                <div className="rounded-2xl border border-slate-200 bg-white p-2 text-sm">
                    {[
                        { id: "account", label: "Account" },
                        { id: "security", label: "Security" },
                        { id: "preferences", label: "Preferences" },
                        { id: "billing", label: "Billing" },
                    ].map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id as TabId)}
                            className={[
                                "mb-1 flex w-full items-center rounded-xl px-3 py-2 text-left text-xs transition-colors",
                                tab === t.id
                                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                                    : "text-slate-600 hover:bg-slate-50",
                            ].join(" ")}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Right content */}
                <div className="space-y-4">
                    {tab === "account" && <AccountPanel />}
                    {tab === "security" && <SecurityPanel />}
                    {tab === "preferences" && <PreferencesPanel />}
                    {tab === "billing" && <BillingPanel />}
                </div>
            </div>
        </div>
    );
}

function AccountPanel() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 space-y-4 text-sm">
            <div>
                <p className="text-xs font-semibold text-slate-500">
                    Profile information
                </p>
                <p className="mt-1 text-xs text-slate-500">
                    In a future update this will be fully editable and synced with
                    Supabase.
                </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-slate-600">
                        First name
                    </label>
                    <input
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                        defaultValue="Demo"
                        readOnly
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-slate-600">
                        Last name
                    </label>
                    <input
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                        defaultValue="User"
                        readOnly
                    />
                </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-slate-600">
                        Email address
                    </label>
                    <input
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                        defaultValue="demo@sheetbuilder.ai"
                        readOnly
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="text-[11px] font-medium text-slate-600">
                        Company
                    </label>
                    <input
                        className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                        defaultValue="Demo Company"
                        readOnly
                    />
                </div>
            </div>

            <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-3">
                <p className="text-xs font-semibold text-red-700">Danger zone</p>
                <p className="mt-1 text-[11px] text-red-700/80">
                    In production this will permanently delete the account and all
                    content.
                </p>
                <button className="mt-3 rounded-full border border-red-300 px-3 py-1.5 text-[11px] font-semibold text-red-700 hover:bg-red-100">
                    Delete account (disabled in demo)
                </button>
            </div>
        </div>
    );
}

function SecurityPanel() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">Password</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    Password changes will be powered by Supabase auth.
                </p>
                <button className="mt-2 rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                    Change password (soon)
                </button>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">
                    Two-factor authentication
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                    Add an extra layer of protection to your account.
                </p>
                <button className="mt-2 rounded-full border border-slate-300 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-100">
                    Enable 2FA (soon)
                </button>
            </div>
        </div>
    );
}

function PreferencesPanel() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">Appearance</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    For now, the workspace uses the default light theme.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-700">
                    <span className="inline-flex h-4 w-8 items-center rounded-full bg-emerald-500/80 px-1 text-[10px] text-white">
                        <span className="inline-block h-3 w-3 rounded-full bg-white" />
                    </span>
                    <span>Light theme (default)</span>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">Language</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    Multi-language support will be added later.
                </p>
                <select
                    className="mt-2 h-9 w-48 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-800 focus:border-emerald-400 focus:outline-none"
                    defaultValue="en"
                >
                    <option value="en">English</option>
                </select>
            </div>
        </div>
    );
}

function BillingPanel() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 space-y-4 text-sm">
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">Current plan</p>
                <p className="mt-1 text-sm font-semibold text-emerald-600">Free</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    Upgrades are handled from the Billing tab or the public pricing page.
                </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <p className="text-xs font-semibold text-slate-700">Invoices</p>
                <p className="mt-1 text-[11px] text-slate-500">
                    When Stripe is fully connected, you&apos;ll see your invoices and
                    payment history here.
                </p>
            </div>
        </div>
    );
}
