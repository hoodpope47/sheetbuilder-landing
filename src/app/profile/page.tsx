"use client";

import { useEffect, useState, Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { fetchOrCreateProfile, updateProfile } from "@/lib/userClient";
import { useTheme } from "@/lib/theme";

function ProfileContent() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [company, setCompany] = useState("");
    const [role, setRole] = useState("");
    const [bio, setBio] = useState("");
    const [industry, setIndustry] = useState("");

    useEffect(() => {
        let cancelled = false;
        async function load() {
            try {
                const profile = await fetchOrCreateProfile();
                if (!profile || cancelled) return;

                if (!cancelled) {
                    setFullName(profile.full_name || "");
                    setEmail(profile.email || "");
                    setCompany(profile.company || "");
                    setRole(profile.role || "");
                    // Mock fields if not in DB schema yet, or add to schema if desired.
                    // For now, we'll just keep them in local state to demonstrate UI.
                }
            } catch (err) {
                console.error("Failed to load profile", err);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }
        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await updateProfile({
                full_name: fullName,
                email,
                company,
                role,
            });
            // Simulate saving other fields
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
            console.error(err);
            setError("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    return (
        <DashboardShell>
            <div className="mb-6">
                <h1 className="text-lg font-semibold tracking-tight">Profile</h1>
                <p className="mt-1 text-sm text-slate-600">Manage your public profile and bio.</p>
            </div>
            <div className="max-w-2xl">
                <div className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-16 w-16 rounded-full bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-xl font-bold text-slate-500">
                            {fullName ? fullName[0].toUpperCase() : "U"}
                        </div>
                        <div>
                            <button className="text-xs font-medium text-emerald-600 hover:text-emerald-500 hover:underline">
                                Change avatar
                            </button>
                            <p className="text-[10px] text-slate-500 mt-1">
                                JPG, GIF or PNG. Max 1MB.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                    placeholder="jane@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">Bio</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none resize-none"
                                placeholder="Tell us a little about yourself..."
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Company
                                </label>
                                <input
                                    type="text"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-600">
                                    Role
                                </label>
                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none"
                                    placeholder="Product Manager"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-600">
                                Industry
                            </label>
                            <select
                                value={industry}
                                onChange={(e) => setIndustry(e.target.value)}
                                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:bg-white focus:outline-none"
                            >
                                <option value="">Select an industry...</option>
                                <option value="marketing">Marketing</option>
                                <option value="sales">Sales</option>
                                <option value="finance">Finance</option>
                                <option value="operations">Operations</option>
                                <option value="engineering">Engineering</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div className="pt-4 flex items-center justify-end gap-3">
                            <button
                                type="button"
                                className="text-xs font-medium text-slate-500 hover:text-slate-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-400 disabled:opacity-50"
                            >
                                {saving ? "Saving..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardShell>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={<div className="p-8 text-slate-400">Loading profile...</div>}>
            <ProfileContent />
        </Suspense>
    );
}
