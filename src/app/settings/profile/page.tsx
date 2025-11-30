"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type ProfileFormState = {
    fullName: string;
    companyName: string;
    jobTitle: string;
    timezone: string;
    phone: string;
    preferredLanguage: string;
    marketingOptIn: boolean;
};

const DEFAULT_PROFILE: ProfileFormState = {
    fullName: "",
    companyName: "",
    jobTitle: "",
    timezone: "America/New_York",
    phone: "",
    preferredLanguage: "en",
    marketingOptIn: true,
};

export default function ProfileSettingsPage() {
    const [profile, setProfile] = useState<ProfileFormState>(DEFAULT_PROFILE);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            setLoading(false);
            return;
        }

        const loadProfile = async () => {
            try {
                setLoading(true);
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();

                if (userError || !user) {
                    setLoading(false);
                    return;
                }

                const { data, error } = await supabase
                    .from("profiles")
                    .select(
                        "full_name, company_name, job_title, timezone, phone, preferred_language, marketing_opt_in"
                    )
                    .eq("id", user.id)
                    .single();

                if (error) {
                    console.warn("[Profile] No saved profile yet or error:", error.message);
                    setLoading(false);
                    return;
                }

                setProfile({
                    fullName: data.full_name ?? "",
                    companyName: data.company_name ?? "",
                    jobTitle: data.job_title ?? "",
                    timezone: data.timezone ?? "America/New_York",
                    phone: data.phone ?? "",
                    preferredLanguage: data.preferred_language ?? "en",
                    marketingOptIn: data.marketing_opt_in ?? true,
                });
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleChange = <K extends keyof ProfileFormState>(
        key: K,
        value: ProfileFormState[K]
    ) => {
        setProfile((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);

        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            setStatus(
                "Supabase is not configured yet. Profile will be saved here once it is connected."
            );
            return;
        }

        try {
            setSaving(true);
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                setStatus("You need to be logged in to update your profile.");
                return;
            }

            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    full_name: profile.fullName,
                    company_name: profile.companyName,
                    job_title: profile.jobTitle,
                    timezone: profile.timezone,
                    phone: profile.phone,
                    preferred_language: profile.preferredLanguage,
                    marketing_opt_in: profile.marketingOptIn,
                })
                .eq("id", user.id);

            if (error) {
                console.error(error);
                setStatus("Failed to save profile. Please try again.");
            } else {
                setStatus("Profile updated.");
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-sm font-semibold tracking-tight text-slate-50">
                    Profile
                </h1>
                <p className="mt-1 text-[11px] text-slate-400">
                    Update your personal details so we can tailor sheet templates and emails to
                    your workflow.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                        label="Full name"
                        value={profile.fullName}
                        onChange={(v) => handleChange("fullName", v)}
                        placeholder="Alex Hernandez"
                    />
                    <Field
                        label="Company"
                        value={profile.companyName}
                        onChange={(v) => handleChange("companyName", v)}
                        placeholder="No Cost Replacement / SheetBuilder"
                    />
                    <Field
                        label="Role"
                        value={profile.jobTitle}
                        onChange={(v) => handleChange("jobTitle", v)}
                        placeholder="Ops lead, founder, analyst…"
                    />
                    <Field
                        label="Phone (optional)"
                        value={profile.phone}
                        onChange={(v) => handleChange("phone", v)}
                        placeholder="+1 (555) 555-5555"
                    />
                    <Field
                        label="Primary timezone"
                        value={profile.timezone}
                        onChange={(v) => handleChange("timezone", v)}
                        placeholder="America/New_York"
                    />
                    <Field
                        label="Preferred language"
                        value={profile.preferredLanguage}
                        onChange={(v) => handleChange("preferredLanguage", v)}
                        placeholder="en"
                    />
                </div>

                <div className="mt-2 flex items-start gap-2">
                    <button
                        type="button"
                        onClick={() =>
                            handleChange("marketingOptIn", !profile.marketingOptIn)
                        }
                        className={[
                            "relative inline-flex h-4 w-7 items-center rounded-full border transition",
                            profile.marketingOptIn
                                ? "border-emerald-400 bg-emerald-400"
                                : "border-slate-600 bg-slate-800",
                        ].join(" ")}
                    >
                        <span
                            className={[
                                "h-3 w-3 rounded-full bg-slate-950 shadow transition-transform",
                                profile.marketingOptIn ? "translate-x-3" : "translate-x-0.5",
                            ].join(" ")}
                        />
                    </button>
                    <div className="text-[11px] text-slate-300">
                        <div className="font-medium">Product updates & tips</div>
                        <p className="text-slate-400">
                            Receive occasional emails about new templates and features. No spam,
                            ever.
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition disabled:opacity-60"
                    >
                        {saving ? "Saving…" : "Save changes"}
                    </button>
                    {loading && (
                        <p className="text-[11px] text-slate-400">Loading profile…</p>
                    )}
                    {status && !loading && (
                        <p className="text-[11px] text-slate-300">{status}</p>
                    )}
                </div>
            </form>
        </div>
    );
}

type FieldProps = {
    label: string;
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
};

function Field({ label, value, placeholder, onChange }: FieldProps) {
    return (
        <label className="flex flex-col gap-1 text-[11px]">
            <span className="text-slate-300">{label}</span>
            <input
                className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400/80 focus:outline-none focus:ring-0"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
            />
        </label>
    );
}
