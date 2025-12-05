"use client";

import { useState } from "react";
import {
    updateUserProfile,
    updateUserPreferences,
    updateUserEmail,
    updateUserPassword,
} from "@/lib/userClient";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { GoogleSheetsConnectCard } from "@/components/dashboard/settings/GoogleSheetsConnectCard";

type TabId = "account" | "security" | "preferences" | "billing";

const TABS: { id: TabId; label: string; description: string }[] = [
    {
        id: "account",
        label: "Account",
        description: "Basic profile details for your workspace.",
    },
    {
        id: "security",
        label: "Security",
        description: "Email, password, and authentication settings.",
    },
    {
        id: "preferences",
        label: "Preferences",
        description: "Theme, language, and communication choices.",
    },
    {
        id: "billing",
        label: "Billing",
        description: "Plan, invoices, and subscription management.",
    },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabId>("account");

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">Settings</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Manage your profile, security, preferences, and billing from one place.
                </p>
            </div>

            {/* Tabs header */}
            <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={[
                            "rounded-full px-3 py-1.5 text-xs font-medium transition",
                            activeTab === tab.id
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200",
                        ].join(" ")}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === "account" && <AccountSection />}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "preferences" && <PreferencesSection />}
            {activeTab === "billing" && <BillingSection />}

            {/* Google Sheets Connect - always visible */}
            <GoogleSheetsConnectCard />

            {/* Sign out section - always visible */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-slate-900">Sign out</h2>
                <p className="mt-1 text-xs text-slate-500">
                    End your current session on this device. You can always sign back in later.
                </p>
                <LogoutButton />
            </section>
        </div>
    );
}

function AccountSection() {
    const [fullName, setFullName] = useState("");
    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        try {
            setSaving(true);
            setStatus(null);
            setError(null);
            await updateUserProfile({
                full_name: fullName || undefined,
                company: company || undefined,
                job_title: jobTitle || undefined,
                phone: phone || undefined,
            });
            setStatus("Profile updated successfully.");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to update profile.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Profile details</h2>
                <p className="mt-1 text-xs text-slate-500">
                    These details help us personalize your workspace and invoices.
                </p>

                <div className="mt-4 space-y-3 text-xs">
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Full name</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Alex Hernandez"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Company</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="e.g. NoCost Replacement"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Job title</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={jobTitle}
                            onChange={(e) => setJobTitle(e.target.value)}
                            placeholder="e.g. Founder, Ops, RevOps"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Phone (optional)</label>
                        <input
                            type="tel"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+1 (555) 555-5555"
                        />
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        disabled={saving}
                        onClick={handleSave}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                    {status && (
                        <span className="text-[11px] text-emerald-700">{status}</span>
                    )}
                    {error && (
                        <span className="text-[11px] text-red-600">{error}</span>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Profile tips</h3>
                <p className="mt-2 text-xs text-slate-500">
                    Use a real name and company so your invoices and billing details look
                    professional, especially when sharing Sheets with clients or teams.
                </p>
            </div>
        </section>
    );
}

function SecuritySection() {
    const [email, setEmail] = useState("");
    const [emailStatus, setEmailStatus] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [emailSaving, setEmailSaving] = useState(false);

    const [password, setPassword] = useState("");
    const [passwordStatus, setPasswordStatus] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSaving, setPasswordSaving] = useState(false);

    async function handleEmailUpdate() {
        try {
            setEmailSaving(true);
            setEmailStatus(null);
            setEmailError(null);
            if (!email) {
                throw new Error("Please enter a new email.");
            }
            await updateUserEmail(email);
            setEmailStatus("Email updated. Please check your inbox to confirm.");
        } catch (err: any) {
            console.error(err);
            setEmailError(err.message || "Failed to update email.");
        } finally {
            setEmailSaving(false);
        }
    }

    async function handlePasswordUpdate() {
        try {
            setPasswordSaving(true);
            setPasswordStatus(null);
            setPasswordError(null);
            if (!password || password.length < 8) {
                throw new Error("Password should be at least 8 characters.");
            }
            await updateUserPassword(password);
            setPasswordStatus("Password updated successfully.");
            setPassword("");
        } catch (err: any) {
            console.error(err);
            setPasswordError(err.message || "Failed to update password.");
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">Change email</h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Update the email address associated with your workspace login.
                    </p>
                    <div className="mt-3 space-y-2 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-slate-700">New email</label>
                            <input
                                type="email"
                                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        <button
                            disabled={emailSaving}
                            onClick={handleEmailUpdate}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {emailSaving ? "Saving…" : "Update email"}
                        </button>
                        {emailStatus && (
                            <span className="text-[11px] text-emerald-700">{emailStatus}</span>
                        )}
                        {emailError && (
                            <span className="text-[11px] text-red-600">{emailError}</span>
                        )}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Change password
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                        Use a strong password you don&apos;t reuse elsewhere.
                    </p>
                    <div className="mt-3 space-y-2 text-xs">
                        <div className="space-y-1">
                            <label className="font-medium text-slate-700">New password</label>
                            <input
                                type="password"
                                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="At least 8 characters"
                            />
                        </div>
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                        <button
                            disabled={passwordSaving}
                            onClick={handlePasswordUpdate}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {passwordSaving ? "Saving…" : "Update password"}
                        </button>
                        {passwordStatus && (
                            <span className="text-[11px] text-emerald-700">{passwordStatus}</span>
                        )}
                        {passwordError && (
                            <span className="text-[11px] text-red-600">{passwordError}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Security best practices</h3>
                <p className="mt-2 text-xs text-slate-500">
                    Avoid sharing your login with others. If you need multiple people in a
                    workspace, add seats instead and give each teammate their own login.
                </p>
            </div>
        </section>
    );
}

function PreferencesSection() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [marketing, setMarketing] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        try {
            setSaving(true);
            setStatus(null);
            setError(null);
            await updateUserPreferences({
                theme,
                marketing_opt_in: marketing,
            });

            // Also sync with dashboard theme storage so the shell can pick it up
            try {
                if (typeof window !== "undefined") {
                    window.localStorage.setItem("sheetbuilder-dashboard-theme", theme);
                }
            } catch (err) {
                console.error("[PreferencesSection] Failed to store theme locally", err);
            }

            setStatus("Preferences saved.");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to save preferences.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Preferences</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Control how SheetBuilder looks, feels, and how often we reach out.
                </p>

                <div className="mt-4 space-y-4 text-xs">
                    <div className="space-y-2">
                        <p className="font-medium text-slate-700">Theme</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => setTheme("light")}
                                className={[
                                    "flex-1 rounded-lg border px-3 py-2 text-left",
                                    theme === "light"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-slate-200 bg-slate-50 hover:bg-slate-100",
                                ].join(" ")}
                            >
                                <p className="font-semibold text-slate-900 text-xs">Light</p>
                                <p className="text-[11px] text-slate-500">
                                    Clean white UI for bright environments.
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setTheme("dark")}
                                className={[
                                    "flex-1 rounded-lg border px-3 py-2 text-left",
                                    theme === "dark"
                                        ? "border-emerald-500 bg-slate-900 text-slate-50"
                                        : "border-slate-200 bg-slate-900 text-slate-50/70 hover:bg-slate-800",
                                ].join(" ")}
                            >
                                <p className="font-semibold text-xs">Dark</p>
                                <p className="text-[11px]">
                                    High-contrast UI for late-night sheet sessions.
                                </p>
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="font-medium text-slate-700">Communication</p>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                className="h-3 w-3 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                checked={marketing}
                                onChange={(e) => setMarketing(e.target.checked)}
                            />
                            <span className="text-xs text-slate-700">
                                I’d like to receive product updates, templates, and workflow
                                ideas.
                            </span>
                        </label>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        disabled={saving}
                        onClick={handleSave}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save preferences"}
                    </button>
                    {status && (
                        <span className="text-[11px] text-emerald-700">{status}</span>
                    )}
                    {error && (
                        <span className="text-[11px] text-red-600">{error}</span>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Your theme toggle</h3>
                <p className="mt-2 text-xs text-slate-500">
                    Theme and language will be used across your dashboard and can later be
                    connected to a global theme provider. For now, this saves your
                    preferences in your account so we can respect them in future updates.
                </p>
            </div>
        </section>
    );
}

function BillingSection() {
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function goToStripePortal() {
        try {
            setLoading(true);
            setStatus(null);
            setError(null);
            // For now, just redirect to pricing. Later this can call a real portal API.
            window.location.href = "/pricing?source=billing";
        } catch (err: any) {
            console.error(err);
            setError("Unable to open billing portal right now.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Billing</h2>
                <p className="mt-1 text-xs text-slate-500">
                    See your current plan, how billing works, and manage your subscription.
                </p>

                <div className="mt-4 space-y-3 text-xs">
                    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                        <div>
                            <p className="text-[11px] font-medium text-slate-600">
                                Current plan
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                Plan synced from Stripe
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                                Once you&apos;re live, this section will reflect your active Stripe
                                subscription and renewals.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        disabled={loading}
                        onClick={goToStripePortal}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {loading ? "Opening…" : "Manage billing"}
                    </button>
                    <button
                        onClick={() => {
                            window.location.href = "/pricing?source=billing";
                        }}
                        className="inline-flex items-center justify-center rounded-full border border-slate-300 px-4 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                    >
                        View pricing
                    </button>
                    {status && (
                        <span className="text-[11px] text-emerald-700">{status}</span>
                    )}
                    {error && (
                        <span className="text-[11px] text-red-600">{error}</span>
                    )}
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">
                    How billing will work
                </h3>
                <p className="mt-2 text-xs text-slate-500">
                    For now, billing is wired through Stripe Checkout from the pricing page. You’ll stay signed in to your workspace even if the public header shows a “Log in” link — that’s just for new visitors. Later, you can plug in a Stripe customer portal link here so customers can manage payment methods, invoices, and cancellations without contacting support.
                </p>
            </div>
        </section>
    );
}
