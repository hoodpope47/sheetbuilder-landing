"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { supabase } from "@/lib/supabaseClient";
import { getOrCreateLocalUserId } from "@/lib/userClient";
import { getUsageMetrics, type UsageMetrics } from "@/lib/usage";
import { formatDistanceToNow, format } from "date-fns";

type RecentEvent = {
    id: string;
    event_type: string;
    template_slug: string | null;
    created_at: string;
};

function getEventLabel(eventType: string): string {
    const labels: Record<string, string> = {
        sheet_created: "New sheet created",
        spec_created: "New setup saved",
        customization_completed: "Template customized",
        sheet_deleted: "Sheet deleted",
    };
    return labels[eventType] || eventType;
}

export default function UsagePage() {
    const [metrics, setMetrics] = useState<UsageMetrics>({
        sheetsThisMonth: 0,
        totalSheets: 0,
        planLimit: 5,
        usagePercent: 0,
        monthlyUsageSeries: [],
        usingDemoData: true,
    });
    const [recentEvents, setRecentEvents] = useState<RecentEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setIsLoading(true);
                setError(null);

                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                const userId = user?.id || getOrCreateLocalUserId();

                // Fetch usage metrics
                const usageMetrics = await getUsageMetrics(supabase, userId);
                setMetrics(usageMetrics);

                // Fetch recent events
                const { data: events, error: eventsError } = await supabase
                    .from("sheet_events_log")
                    .select("id, event_type, template_slug, created_at")
                    .eq("user_id", userId)
                    .order("created_at", { ascending: false })
                    .limit(10);

                if (eventsError) {
                    console.error("[UsagePage] Error loading events:", eventsError);
                } else {
                    setRecentEvents((events || []) as RecentEvent[]);
                }
            } catch (err) {
                console.error("[UsagePage] Error loading usage:", err);
                setError("We couldn't load your usage data. Showing demo data.");
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const planName = "Free";
    const monthlyLimit = metrics.planLimit;
    const usedThisMonth = metrics.sheetsThisMonth;
    const usagePercent = metrics.usagePercent;

    // Dynamic upgrade suggestion based on usage
    let upgradeSuggestion = "You're comfortably within your plan.";
    if (usagePercent >= 80) {
        upgradeSuggestion = "You're close to your limit. Consider upgrading when this becomes a pattern.";
    } else if (usagePercent >= 40) {
        upgradeSuggestion = "You're using your plan consistently. Keep an eye on your limit.";
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    Usage &amp; limits
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    See how many AI-generated sheets you&apos;ve used this month and when you
                    should upgrade.
                </p>
            </div>

            {error && (
                <div className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-xs text-amber-900">
                    {error}
                </div>
            )}

            {/* Summary cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Sheets this month</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {isLoading ? "…" : usedThisMonth}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Counting AI-generated templates and schema-based sheets.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Monthly limit</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {isLoading ? "…" : monthlyLimit}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Based on your current plan ({planName}).
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Upgrade suggestion</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                        {upgradeSuggestion}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        This is based on your recent month of usage.
                    </p>
                </div>
            </div>

            {/* Progress + mini chart */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">
                                Monthly usage
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                How close you are to your limit
                            </p>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${metrics.usingDemoData
                                ? "bg-amber-50 text-amber-700"
                                : "bg-emerald-50 text-emerald-700"
                            }`}>
                            {metrics.usingDemoData ? "Demo data" : "Live data"}
                        </span>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>
                                {usedThisMonth} / {monthlyLimit} sheets
                            </span>
                            <span>{Math.round(usagePercent)}%</span>
                        </div>
                        <div className="mt-2 h-2 rounded-full bg-slate-100">
                            <div
                                className={[
                                    "h-2 rounded-full transition-all",
                                    usagePercent >= 90
                                        ? "bg-red-500"
                                        : usagePercent >= 70
                                            ? "bg-amber-500"
                                            : "bg-emerald-500",
                                ].join(" ")}
                                style={{ width: `${Math.min(100, usagePercent)}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={metrics.monthlyUsageSeries}>
                                <XAxis
                                    dataKey="monthLabel"
                                    stroke="#9ca3af"
                                    fontSize={11}
                                    tickLine={false}
                                />
                                <YAxis
                                    stroke="#9ca3af"
                                    fontSize={11}
                                    tickLine={false}
                                    width={32}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: 10,
                                        borderColor: "#e5e7eb",
                                        fontSize: 11,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Upgrade callout */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">
                    <p className="text-xs font-semibold text-emerald-800">
                        Upgrade when automation pays for itself
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-950">
                        When you're consistently hitting {Math.max(3, Math.round(monthlyLimit * 0.6))}+
                        sheets per month, it's usually time to move up a plan.
                    </p>
                    <p className="mt-2 text-[11px] text-emerald-900/80">
                        You can upgrade or downgrade any time from the pricing page. No
                        long-term contracts.
                    </p>
                    <button
                        onClick={() => {
                            window.location.href = "/pricing?source=usage";
                        }}
                        className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-500"
                    >
                        View plans &amp; upgrade
                    </button>
                </div>
            </div>

            {/* Activity timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">
                        Recent activity
                    </p>
                    <span className="text-[11px] text-slate-400">
                        Last {recentEvents.length || 0} events
                    </span>
                </div>
                {isLoading ? (
                    <p className="mt-4 text-xs text-slate-500">Loading activity…</p>
                ) : recentEvents.length === 0 ? (
                    <p className="mt-4 text-xs text-slate-500">
                        No usage events yet. Once you start generating sheets, you&apos;ll see
                        activity here.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3 text-xs">
                        {recentEvents.map((event) => (
                            <li key={event.id} className="flex items-start gap-2">
                                <span className="mt-[3px] inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                                <div className="flex-1">
                                    <p className="text-slate-800">
                                        {getEventLabel(event.event_type)}
                                        {event.template_slug && (
                                            <span className="text-slate-500"> · {event.template_slug}</span>
                                        )}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        {format(new Date(event.created_at), "MMM d, yyyy")} ·{" "}
                                        {formatDistanceToNow(new Date(event.created_at), {
                                            addSuffix: true,
                                        })}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
