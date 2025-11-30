"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type BillingState = {
    planId: "free" | "starter" | "pro" | "enterprise" | "unknown";
    planLabel: string;
    status: string;
    renewsAt: string | null;
};

const DEFAULT_BILLING: BillingState = {
    planId: "unknown",
    planLabel: "Unknown",
    status: "Unknown",
    renewsAt: null,
};

export default function BillingSettingsPage() {
    const [billing, setBilling] = useState<BillingState>(DEFAULT_BILLING);
    const [loading, setLoading] = useState(true);
    const [portalLoading, setPortalLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            // Still allow UI, but show "Free" by default
            setBilling({
                planId: "free",
                planLabel: "Free",
                status: "Supabase not connected (showing demo data)",
                renewsAt: null,
            });
            setLoading(false);
            return;
        }

        const loadBilling = async () => {
            try {
                setLoading(true);
                const {
                    data: { user },
                    error: userError,
                } = await supabase.auth.getUser();
                if (userError || !user) {
                    setBilling({
                        planId: "free",
                        planLabel: "Free",
                        status: "Not logged in",
                        renewsAt: null,
                    });
                    return;
                }

                // This expects a "subscriptions" table in Supabase, but will degrade gracefully if it does not exist.
                const { data, error } = await supabase
                    .from("subscriptions")
                    .select("plan_id, status, current_period_end")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .maybeSingle();

                if (error || !data) {
                    setBilling({
                        planId: "free",
                        planLabel: "Free",
                        status: "No active subscription",
                        renewsAt: null,
                    });
                    return;
                }

                const planId = (data.plan_id as BillingState["planId"]) || "free";

                setBilling({
                    planId,
                    planLabel: prettyPlanLabel(planId),
                    status: data.status ?? "active",
                    renewsAt: data.current_period_end
                        ? new Date(data.current_period_end).toLocaleDateString()
                        : null,
                });
            } finally {
                setLoading(false);
            }
        };

        loadBilling();
    }, []);

    const handleManageBilling = async () => {
        setError(null);

        try {
            setPortalLoading(true);
            // This expects a backend route /api/stripe/portal later; for now, just go to /pricing
            const res = await fetch("/api/stripe/portal", {
                method: "POST",
            });

            if (res.ok) {
                const data = await res.json();
                if (data.url) {
                    window.location.href = data.url;
                    return;
                }
            }

            // Fallback: open pricing page
            window.location.href = "/pricing";
        } catch (err: any) {
            console.error(err);
            setError("Unable to open billing portal. Redirecting to pricing.");
            window.location.href = "/pricing";
        } finally {
            setPortalLoading(false);
        }
    };

    return (
        <div className="space-y-4 text-xs">
            <div>
                <h1 className="text-sm font-semibold tracking-tight text-slate-50">
                    Billing
                </h1>
                <p className="mt-1 text-[11px] text-slate-400">
                    View your current plan, manage invoices, and upgrade when Sheet Builder
                    saves you real time.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <h2 className="text-xs font-semibold text-slate-100">Current plan</h2>
                    <p className="mt-1 text-[11px] text-slate-300">
                        {loading ? "Loading…" : billing.planLabel}
                    </p>

                    <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                        <p>
                            Status:{" "}
                            <span className="font-medium text-slate-200">{billing.status}</span>
                        </p>
                        {billing.renewsAt && (
                            <p>
                                Renews on:{" "}
                                <span className="font-medium text-slate-200">
                                    {billing.renewsAt}
                                </span>
                            </p>
                        )}
                        {!billing.renewsAt && (
                            <p>No renewal date yet. Free or trial plan.</p>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleManageBilling}
                            disabled={portalLoading}
                            className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition disabled:opacity-60"
                        >
                            {portalLoading ? "Opening…" : "Manage billing"}
                        </button>

                        <Link
                            href="/pricing"
                            className="text-[11px] font-medium text-emerald-300 hover:text-emerald-200"
                        >
                            View plans & pricing
                        </Link>
                    </div>

                    {error && (
                        <p className="mt-3 text-[11px] text-red-300">
                            {error}
                        </p>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                    <h2 className="text-xs font-semibold text-slate-100">
                        Plan comparison
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-400">
                        Quick snapshot of what you get as you scale from Free to Pro or
                        Enterprise.
                    </p>

                    <ul className="mt-3 space-y-2 text-[11px] text-slate-300">
                        <li className="flex gap-2">
                            <span className="mt-[2px] inline-block h-3 w-3 rounded-full bg-emerald-400/90" />
                            <span>
                                <strong className="text-slate-50">Free</strong> — 5 AI sheets /
                                month, core templates.
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-[2px] inline-block h-3 w-3 rounded-full bg-emerald-400/70" />
                            <span>
                                <strong className="text-slate-50">Starter</strong> — up to 30 AI
                                sheets / month, saved prompts, priority support.
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-[2px] inline-block h-3 w-3 rounded-full bg-emerald-400/60" />
                            <span>
                                <strong className="text-slate-50">Pro</strong> — unlimited*
                                sheets, advanced templates, team access.
                            </span>
                        </li>
                        <li className="flex gap-2">
                            <span className="mt-[2px] inline-block h-3 w-3 rounded-full bg-emerald-400/50" />
                            <span>
                                <strong className="text-slate-50">Enterprise</strong> — SSO,
                                security review, onboarding & SLAs.
                            </span>
                        </li>
                    </ul>

                    <p className="mt-4 text-[10px] text-slate-500">
                        *Fair-use limits apply to prevent abuse. If you ever hit them, we&apos;ll
                        talk like humans.
                    </p>
                </div>
            </div>
        </div>
    );
}

function prettyPlanLabel(planId: BillingState["planId"]): string {
    switch (planId) {
        case "free":
            return "Free";
        case "starter":
            return "Starter";
        case "pro":
            return "Pro";
        case "enterprise":
            return "Enterprise";
        default:
            return "Unknown";
    }
}
