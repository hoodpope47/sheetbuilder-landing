"use client";

import React, { useCallback, useEffect, useState, type ComponentProps } from "react";
import Image from "next/image";
import {
    updateUserPreferences,
    updateUserEmail,
    updateUserPassword,
} from "@/lib/userClient";
import { LogoutButton } from "@/components/dashboard/LogoutButton";
import { cardClasses, textStyles } from "@/design-system/theme";

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

type SettingsPageClientProps = {
    initialProfile?: {
        full_name: string | null;
        company_name: string | null;
        role: string | null;
        display_name?: string | null;
        phone?: string | null;
        profile_picture_url?: string | null;
    };
    workspaceUserId?: string;

    // Google connection props coming from the server
    initialGoogleConnected: boolean;
    hasGoogleConnection: boolean;
    googleConnectedLabel: string | null;
    googleLastUpdatedLabel: string | null;

    // NEW: query string values from the server
    googleStatus: string | null;
    googleError: string | null;

    // Optional extra flags
    googleConnected?: boolean;
};

// Optional summary cards used in settings; allow richer metadata
type SummaryCard = {
    cardTitle: string;
    cardMetric: string;
    cardLabel: string;
    sectionTitle?: string;
    body?: string;
};

export function SettingsPageClient({
    initialProfile,
    workspaceUserId = "",
    initialGoogleConnected,
    hasGoogleConnection = false,
    googleConnectedLabel,
    googleLastUpdatedLabel,
    googleStatus,
    googleError,
}: SettingsPageClientProps) {
    const [activeTab, setActiveTab] = useState<TabId>("account");

    // ----- Account/profile form state -----
    const [fullName, setFullName] = useState(initialProfile?.full_name ?? "");
    const [company, setCompany] = useState(initialProfile?.company_name ?? "");
    const [jobTitle, setJobTitle] = useState(initialProfile?.role ?? "");
    const [phone, setPhone] = useState(initialProfile?.phone ?? "");

    const [displayName, setDisplayName] = useState<string>(
        initialProfile?.display_name ??
            (typeof window !== "undefined"
                ? window.localStorage.getItem("aisb_display_name") || ""
                : ""),
    );

    const [profilePictureUrl, setProfilePictureUrl] = useState<string>(
        initialProfile?.profile_picture_url ??
            (typeof window !== "undefined"
                ? window.localStorage.getItem("aisb_profile_picture_url") || ""
                : ""),
    );

    const [effectiveWorkspaceId, setEffectiveWorkspaceId] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        let initialId: string | null = null;

        if (workspaceUserId && workspaceUserId.trim().length > 0) {
            initialId = workspaceUserId.trim();
        } else {
            const stored = window.localStorage.getItem("ai_sheet_workspace_user_id");
            if (stored && stored.trim().length > 0) {
                initialId = stored.trim();
            }
        }

        if (!initialId) {
            if (window.crypto?.randomUUID) {
                initialId = window.crypto.randomUUID();
            } else {
                initialId = `ws-${Date.now()}`;
            }
        }

        window.localStorage.setItem("ai_sheet_workspace_user_id", initialId);
        setEffectiveWorkspaceId(initialId);
    }, [workspaceUserId]);

    // -------------------------------------------------------------------
    // When we know the effectiveWorkspaceId, load any saved profile from
    // localStorage so the form is prefilled even after navigation/reload.
    // Profiles are stored per-workspace in "ai_sheet_profiles".
    // -------------------------------------------------------------------
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!effectiveWorkspaceId || !effectiveWorkspaceId.trim()) return;

        try {
            const raw = window.localStorage.getItem("ai_sheet_profiles");
            if (!raw) return;

            const parsed = JSON.parse(raw) as {
                [workspaceId: string]: {
                    full_name?: string | null;
                    company_name?: string | null;
                    role?: string | null;
                };
            };

            const stored = parsed[effectiveWorkspaceId];
            if (!stored) return;

            // Only override if fields are currently empty,
            // so we don't clobber unsaved user typing.
            if (!fullName && stored.full_name != null) {
                setFullName(stored.full_name);
            }
            if (!company && stored.company_name != null) {
                setCompany(stored.company_name);
            }
            if (!jobTitle && stored.role != null) {
                setJobTitle(stored.role);
            }
        } catch (err) {
            console.warn("[Settings] Failed to load profile from localStorage:", err);
        }
    }, [effectiveWorkspaceId]);

    // Load profile from API when we have an effectiveWorkspaceId
    useEffect(() => {
        if (!effectiveWorkspaceId || typeof window === "undefined") return;

        const controller = new AbortController();

        async function loadProfile() {
            try {
                const res = await fetch(
                    `/api/settings/profile?workspaceUserId=${encodeURIComponent(
                        effectiveWorkspaceId,
                    )}`,
                    { method: "GET", signal: controller.signal },
                );

                if (!res.ok) {
                    console.warn("[Settings] Failed to load profile from API:", res.status);
                    return;
                }

                const json = (await res.json()) as { profile: any | null };

                if (!json.profile) {
                    return;
                }

                const profile = json.profile;

                setFullName(profile.full_name ?? "");
                setCompany(profile.company_name ?? "");
                setJobTitle(profile.role ?? "");
                setDisplayName(profile.display_name ?? "");
                setPhone(profile.phone ?? "");
                setProfilePictureUrl(profile.profile_picture_url ?? "");

                window.localStorage.setItem("ai_sheet_profile_full_name", profile.full_name ?? "");
                window.localStorage.setItem("ai_sheet_profile_company_name", profile.company_name ?? "");
                window.localStorage.setItem("ai_sheet_profile_role", profile.role ?? "");
                window.localStorage.setItem("ai_sheet_profile_display_name", profile.display_name ?? "");
                window.localStorage.setItem("ai_sheet_profile_phone", profile.phone ?? "");
                window.localStorage.setItem(
                    "ai_sheet_profile_picture_url",
                    profile.profile_picture_url ?? "",
                );
            } catch (err) {
                if ((err as any).name === "AbortError") return;
                console.error("[Settings] Error loading profile from API:", err);
            }
        }

        loadProfile();

        return () => controller.abort();
    }, [effectiveWorkspaceId]);

    const [accountSaving, setAccountSaving] = useState(false);
    const [accountSaved, setAccountSaved] = useState(false);
    const [accountError, setAccountError] = useState<string | null>(null);

    const handleAccountSubmit = async (
        e: React.FormEvent<HTMLFormElement>,
    ) => {
        e.preventDefault();

        setAccountError(null);
        setAccountSaved(false);
        setAccountSaving(true);

        try {
            if (!effectiveWorkspaceId) {
                console.error("[Settings] No effectiveWorkspaceId when saving profile.");
                setAccountError(
                    "Something went wrong identifying your account. Please try again.",
                );
                return false;
            }

            const trimmedFullName = fullName?.trim() || null;
            const trimmedCompanyName = company?.trim() || null;
            const trimmedRole = jobTitle?.trim() || null;
            const trimmedPhone = phone?.trim() || null;
            const trimmedDisplayName = displayName?.trim() || null;
            const trimmedProfileUrl = profilePictureUrl?.trim() || null;

            const payload = {
                workspaceUserId: effectiveWorkspaceId,
                full_name: trimmedFullName,
                company_name: trimmedCompanyName,
                role: trimmedRole,
                phone: trimmedPhone,
                display_name: trimmedDisplayName,
                profile_picture_url: trimmedProfileUrl,
            };

            const res = await fetch("/api/settings/profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                console.error("[Settings] Save profile error response:", data);
                throw new Error(
                    data?.error || "Could not save profile. Please try again.",
                );
            }

            console.log("[Settings] Profile saved:", data);

            // -----------------------------------------------------------------
            // ALSO persist this profile per-workspace in localStorage so that
            // the dashboard "remembers" the user when they come back.
            // Key: "ai_sheet_profiles" → { [workspaceId]: { full_name, company_name, role } }
            // -----------------------------------------------------------------
            if (typeof window !== "undefined" && payload.workspaceUserId) {
                try {
                    const raw = window.localStorage.getItem("ai_sheet_profiles");
                    const map =
                        raw && raw.length
                            ? ((JSON.parse(raw) as {
                                  [workspaceId: string]: {
                                      full_name?: string | null;
                                      company_name?: string | null;
                                      role?: string | null;
                                  };
                              }) || {})
                            : {};

                    map[payload.workspaceUserId] = {
                        full_name: payload.full_name,
                        company_name: payload.company_name,
                        role: payload.role,
                    };

                    window.localStorage.setItem(
                        "ai_sheet_profiles",
                        JSON.stringify(map),
                    );

                    console.log(
                        "[Settings] Profile cached in localStorage for workspace:",
                        payload.workspaceUserId,
                    );
                } catch (storageErr) {
                    console.warn(
                        "[Settings] Failed to cache profile in localStorage:",
                        storageErr,
                    );
                }
            }

            // Update local state for locked view
            setFullName(trimmedFullName || "");
            setCompany(trimmedCompanyName || "");
            setJobTitle(trimmedRole || "");
            setPhone(trimmedPhone || "");
            setDisplayName(trimmedDisplayName || "");
            setProfilePictureUrl(trimmedProfileUrl || "");

            // Mirror to localStorage for sticky profile data
            if (typeof window !== "undefined") {
                window.localStorage.setItem("ai_sheet_profile_full_name", trimmedFullName ?? "");
                window.localStorage.setItem("ai_sheet_profile_company_name", trimmedCompanyName ?? "");
                window.localStorage.setItem("ai_sheet_profile_role", trimmedRole ?? "");
                window.localStorage.setItem("ai_sheet_profile_display_name", trimmedDisplayName ?? "");
                window.localStorage.setItem("ai_sheet_profile_phone", trimmedPhone ?? "");
                window.localStorage.setItem(
                    "ai_sheet_profile_picture_url",
                    trimmedProfileUrl ?? "",
                );
            }

            setAccountSaved(true);
            setAccountError(null);
            return true;
        } catch (err: any) {
            console.error("[Settings] Unable to save profile:", err);
            setAccountSaved(false);
            setAccountError(
                err?.message || "Could not save profile. Please try again.",
            );
            return false;
        } finally {
            setAccountSaving(false);
        }
    };

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

            {activeTab === "account" && (
                <AccountPanel
                    fullName={fullName}
                    company={company}
                    jobTitle={jobTitle}
                    phone={phone}
                    displayName={displayName}
                    profilePictureUrl={profilePictureUrl}
                    onFullNameChange={setFullName}
                    onCompanyChange={setCompany}
                    onJobTitleChange={setJobTitle}
                    onPhoneChange={setPhone}
                    onDisplayNameChange={setDisplayName}
                    onProfilePictureUrlChange={setProfilePictureUrl}
                    accountSaving={accountSaving}
                    accountSaved={accountSaved}
                    accountError={accountError}
                    onSubmit={handleAccountSubmit}
                />
            )}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "preferences" && <PreferencesSection />}
            {activeTab === "billing" && <BillingSection />}

            <GoogleConnectionCard
                workspaceUserId={effectiveWorkspaceId ?? workspaceUserId ?? ""}
                initialGoogleConnected={initialGoogleConnected}
                hasGoogleConnection={hasGoogleConnection}
                googleConnectedLabel={googleConnectedLabel}
                googleLastUpdatedLabel={googleLastUpdatedLabel}
                googleStatus={googleStatus}
                googleError={googleError}
            />

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

type AccountSectionProps = {
    fullName: string;
    company: string;
    jobTitle: string;
    phone: string;
    displayName: string;
    profilePictureUrl: string;
    onFullNameChange: (value: string) => void;
    onCompanyChange: (value: string) => void;
    onJobTitleChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onDisplayNameChange: (value: string) => void;
    onProfilePictureUrlChange: (value: string) => void;
    accountSaving: boolean;
    accountSaved: boolean;
    accountError: string | null;
    onSubmit: (e: React.FormEvent) => Promise<boolean | void> | boolean | void;
    onSaved?: () => void;
};

// Read-only wrapper around AccountSection.
// By default it shows a locked, greyish summary card.
// When "Edit profile" is clicked, it switches to the full editable AccountSection form.
type AccountPanelProps = ComponentProps<typeof AccountSection>;

function AccountPanel(props: AccountPanelProps) {
    const [isEditing, setIsEditing] = useState(false);

    // If the user has clicked "Edit profile", render the existing form.
    if (isEditing) {
        const { onSubmit, ...rest } = props;
        return (
            <AccountSection
                {...rest}
                onSubmit={async (e) => {
                    const ok = await onSubmit(e);
                    if (ok !== false) {
                        setIsEditing(false);
                    }
                }}
            />
        );
    }

    const {
        fullName,
        company,
        jobTitle,
        phone,
        displayName,
        profilePictureUrl,
    } = props;

    return (
        <section className={cardClasses.primary} aria-label="Profile details">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className={textStyles.sectionTitle}>Profile details</h2>
                    <p className={`${textStyles.body} text-slate-500`}>
                        These details help us personalize your workspace and invoices.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full border border-slate-300 px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
                >
                    Edit profile
                </button>
            </div>

            {/* Locked view content */}
            <dl className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Full name
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                        {fullName || "—"}
                    </dd>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Company
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                        {company || "—"}
                    </dd>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Job title
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                        {jobTitle || "—"}
                    </dd>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Phone
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                        {phone || "—"}
                    </dd>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Display name
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900">
                        {displayName || "—"}
                    </dd>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Profile picture URL
                    </dt>
                    <dd className="mt-1 text-sm text-slate-900 break-all">
                        {profilePictureUrl || "—"}
                    </dd>
                </div>
            </dl>
        </section>
    );
}

function AccountSection({
    fullName,
    company,
    jobTitle,
    phone,
    displayName,
    profilePictureUrl,
    onFullNameChange,
    onCompanyChange,
    onJobTitleChange,
    onPhoneChange,
    onDisplayNameChange,
    onProfilePictureUrlChange,
    accountSaving,
    accountSaved,
    accountError,
    onSubmit,
    onSaved,
}: AccountSectionProps) {

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-4"
            >
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
                            onChange={(e) => onFullNameChange(e.target.value)}
                            placeholder="e.g. Alex Hernandez"
                        />
                        <p className="mt-1 text-[11px] text-slate-500">
                            This name (and its first letter) is shown in the top-right avatar and across your dashboard.
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Company</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={company}
                            onChange={(e) => onCompanyChange(e.target.value)}
                            placeholder="e.g. NoCost Replacement"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Job title</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={jobTitle}
                            onChange={(e) => onJobTitleChange(e.target.value)}
                            placeholder="e.g. Founder, Ops, RevOps"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Phone (optional)</label>
                        <input
                            type="tel"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={phone}
                            onChange={(e) => onPhoneChange(e.target.value)}
                            placeholder="+1 (555) 555-5555"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Display name</label>
                        <input
                            type="text"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={displayName}
                            onChange={(e) => onDisplayNameChange(e.target.value)}
                            placeholder="Name shown in your dashboard"
                        />
                        <p className="text-[11px] text-slate-500">
                            This name appears in the top-right of your dashboard.
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Profile picture URL</label>
                        <input
                            type="url"
                            className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            value={profilePictureUrl}
                            onChange={(e) => onProfilePictureUrlChange(e.target.value)}
                            placeholder="https://…"
                        />
                        <p className="text-[11px] text-slate-500">
                            Paste a link to your logo or headshot. We'll use it in your dashboard avatar.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={accountSaving}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-60"
                    >
                        {accountSaving ? "Saving..." : "Save changes"}
                    </button>
                    {accountError && (
                        <p className="mt-2 text-sm text-red-500">{accountError}</p>
                    )}
                    {accountSaved && (
                        <p className="mt-2 text-sm text-emerald-600">Saved successfully.</p>
                    )}
                </div>
            </form>

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

export default SettingsPageClient;

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
            if (!password) {
                throw new Error("Please enter a new password.");
            }
            await updateUserPassword(password);
            setPasswordStatus("Password updated successfully.");
        } catch (err: any) {
            console.error(err);
            setPasswordError(err.message || "Failed to update password.");
        } finally {
            setPasswordSaving(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Security</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Update your email and password for this AI Sheet Builder account.
                </p>

                <div className="mt-4 space-y-4 text-xs">
                    <div className="space-y-2">
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
                        <button
                            disabled={emailSaving}
                            onClick={handleEmailUpdate}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {emailSaving ? "Updating…" : "Update email"}
                        </button>
                        {emailStatus && (
                            <p className="text-[11px] text-emerald-700">{emailStatus}</p>
                        )}
                        {emailError && (
                            <p className="text-[11px] text-red-600">{emailError}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="space-y-1">
                            <label className="font-medium text-slate-700">New password</label>
                            <input
                                type="password"
                                className="h-8 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs text-slate-800 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            disabled={passwordSaving}
                            onClick={handlePasswordUpdate}
                            className="inline-flex items-center justify-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
                        >
                            {passwordSaving ? "Updating…" : "Update password"}
                        </button>
                        {passwordStatus && (
                            <p className="text-[11px] text-emerald-700">{passwordStatus}</p>
                        )}
                        {passwordError && (
                            <p className="text-[11px] text-red-600">{passwordError}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Security tips</h3>
                <p className="mt-2 text-xs text-slate-500">
                    Use a strong password and keep your email up to date so you never miss important notifications.
                </p>
            </div>
        </section>
    );
}

function PreferencesSection() {
    const [theme, setTheme] = useState<"light" | "dark">("light");
    const [notificationsEmail, setNotificationsEmail] = useState(true);
    const [notificationsProduct, setNotificationsProduct] = useState(true);
    const [status, setStatus] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    type PreferencesUpdateInput = {
        theme?: "light" | "dark";
        language?: "en" | "es";
        marketing_opt_in?: boolean;
        notifications_email?: boolean;
        notifications_product?: boolean;
    };

    async function handleSave() {
        try {
            setSaving(true);
            setStatus(null);
            setError(null);

            const payload: PreferencesUpdateInput = {
                theme,
                notifications_email: notificationsEmail,
                notifications_product: notificationsProduct,
            };

            await updateUserPreferences(payload as any);

            setStatus("Preferences updated.");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to update preferences.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="grid gap-4 md:grid-cols-[minmax(0,2fr),minmax(0,1.2fr)]">
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <h2 className="text-sm font-semibold text-slate-900">Preferences</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Control your theme and notification settings.
                </p>

                <div className="mt-4 space-y-3 text-xs">
                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Theme</label>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setTheme("light")}
                                className={[
                                    "rounded-lg border px-3 py-1.5 transition",
                                    theme === "light"
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                                ].join(" ")}
                            >
                                Light
                            </button>
                            <button
                                onClick={() => setTheme("dark")}
                                className={[
                                    "rounded-lg border px-3 py-1.5 transition",
                                    theme === "dark"
                                        ? "border-slate-800 bg-slate-900 text-white"
                                        : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300",
                                ].join(" ")}
                            >
                                Dark
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="font-medium text-slate-700">Notifications</label>
                        <div className="space-y-1">
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={notificationsEmail}
                                    onChange={(e) => setNotificationsEmail(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-slate-700">Email updates</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={notificationsProduct}
                                    onChange={(e) => setNotificationsProduct(e.target.checked)}
                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <span className="text-slate-700">Product tips &amp; news</span>
                            </label>
                        </div>
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
                <h3 className="text-sm font-semibold text-slate-900">Preference tips</h3>
                <p className="mt-2 text-xs text-slate-500">
                    We'll add more customization soon—language, timezone, and branded exports are coming next.
                </p>
            </div>
        </section>
    );
}

function BillingSection() {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
            <h2 className="text-sm font-semibold text-slate-900">Billing</h2>
            <p className="mt-1 text-xs text-slate-500">
                Billing integration coming soon. You can manage your subscription and invoices here once it's available.
            </p>
        </section>
    );
}

type GoogleCardProps = {
    workspaceUserId: string;
    initialGoogleConnected: boolean;
    hasGoogleConnection: boolean;
    googleConnectedLabel: string | null;
    googleLastUpdatedLabel: string | null;
    googleStatus: string | null;
    googleError: string | null;
};

function GoogleConnectionCard({
    workspaceUserId,
    initialGoogleConnected,
    hasGoogleConnection,
    googleConnectedLabel,
    googleLastUpdatedLabel,
    googleStatus,
    googleError,
}: GoogleCardProps) {
    const [connected, setConnected] = useState<boolean>(
        initialGoogleConnected || hasGoogleConnection || false,
    );
    const [isConnecting, setIsConnecting] = useState(false);
    const [_connectError, setConnectError] = useState<string | null>(null);
    const [isDisconnecting, setIsDisconnecting] = useState(false);

    const STORAGE_KEY = "aiSheet_google_connected";

    const statusLabel = connected ? "Connected" : "Not connected";

    const showMeta =
        (connected || hasGoogleConnection) &&
        (googleConnectedLabel || googleLastUpdatedLabel);

    // Hydrate from localStorage on mount so state persists across tab changes/refresh
    useEffect(() => {
        if (typeof window === "undefined") return;

        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === "true") {
            setConnected(true);
        } else if (stored === "false") {
            setConnected(false);
        } else if (hasGoogleConnection && !connected) {
            setConnected(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hasGoogleConnection]);

    // React to query param (?googleStatus=connected|disconnected|error)
    useEffect(() => {
        if (!googleStatus) return;

        if (googleStatus === "connected") {
            setConnected(true);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, "true");
            }
            console.log("Google Sheets connected");
        } else if (googleStatus === "disconnected") {
            setConnected(false);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, "false");
            }
            console.log("Google Sheets disconnected");
        } else if (googleStatus === "error") {
            console.error("Google connection error:", googleError);
        }
    }, [googleStatus, googleError]);

    const handleConnectClick = useCallback(
        () => {
            setIsConnecting(true);
            setConnectError(null);

            try {
                const searchParams = new URLSearchParams();

                // Include workspaceUserId if we have it (but don't block if we don't)
                if (workspaceUserId) {
                    searchParams.set("workspaceUserId", workspaceUserId);
                }

                // Always send user back to settings after OAuth
                searchParams.set("returnTo", "/dashboard/settings");

                // Use GET redirect – matches the existing /api/google/oauth/start route
                window.location.href = `/api/google/oauth/start?${searchParams.toString()}`;
            } catch (error) {
                console.error("Failed to start Google OAuth", error);
                setConnectError(
                    error instanceof Error
                        ? error.message
                        : "Failed to start Google OAuth"
                );
                setIsConnecting(false);
            }
        },
        [workspaceUserId]
    );

    const handleDisconnectClick = useCallback(async () => {
        try {
            if (!workspaceUserId) {
                console.error("Missing workspace user id for disconnect");
                return;
            }

            setIsDisconnecting(true);

            const res = await fetch("/api/google/oauth/disconnect", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ workspaceUserId }),
            });

            if (!res.ok) {
                throw new Error("Failed to disconnect Google account");
            }

            setConnected(false);
            if (typeof window !== "undefined") {
                window.localStorage.setItem(STORAGE_KEY, "false");
            }

            console.log("Disconnected from Google");
        } catch (err) {
            console.error("Failed to disconnect Google:", err);
        } finally {
            setIsDisconnecting(false);
        }
    }, [workspaceUserId]);

    return (
        <section
            className={cardClasses.primary}
            aria-labelledby="google-connection-heading"
        >
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2
                        id="google-connection-heading"
                        className={textStyles.sectionTitle}
                    >
                        Connect Google Sheets
                    </h2>
                    <p className={`${textStyles.body} mt-1 text-slate-500`}>
                        {connected
                            ? "Google Sheets is connected. We’ll create and update spreadsheets in your Drive."
                            : "Connect your Google account so AI Sheet Builder can create and manage spreadsheets in your Drive."}
                    </p>
                    {showMeta && (
                        <p className="mt-1 text-xs text-slate-400">
                            {googleConnectedLabel
                                ? `Connected as ${googleConnectedLabel}`
                                : null}
                            {googleConnectedLabel && googleLastUpdatedLabel ? " · " : null}
                            {googleLastUpdatedLabel
                                ? `Last updated ${googleLastUpdatedLabel}`
                                : null}
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={connected ? handleDisconnectClick : handleConnectClick}
                        disabled={isConnecting || isDisconnecting}
                        className={`inline-flex items-center rounded-full px-5 py-2.5 text-sm font-medium shadow-sm ${
                            connected
                                ? "bg-white text-slate-900 ring-1 ring-slate-200 hover:bg-slate-50"
                                : "bg-emerald-500 text-white hover:bg-emerald-600"
                        }`}
                    >
                        <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                            <Image
                                src="/logos/google.png"
                                alt="Google"
                                width={24}
                                height={24}
                                className="h-6 w-6 object-contain"
                            />
                        </span>

                        <span>
                            {connected
                                ? isDisconnecting
                                    ? "Disconnecting..."
                                    : "Disconnect from Google"
                                : isConnecting
                                    ? "Connecting..."
                                    : "Connect Google Account"}
                        </span>
                    </button>

                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                        {statusLabel}
                    </span>
                </div>
            </div>
        </section>
    );
}
