"use client";

import { useEffect, useMemo, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    getCurrentUserId,
    getOrCreateUsageForMonth,
    getRecentUsageEvents,
} from "@/lib/userClient";

type UsageRow = {
    user_id: string;
    month_key: string;
    sheets_generated: number;
    plan: string | null;
};

type UsageEvent = {
    id: string;
    type: string;
    description: string | null;
    created_at: string;
};

function getCurrentMonthKey() {
    const now = new Date();
    const y = now.getFullYear();
    const m = `${now.getMonth() + 1}`.padStart(2, "0");
    return `${y}-${m}`;
}

export default function UsagePage() {
    const [usage, setUsage] = useState<UsageRow | null>(null);
    const [events, setEvents] = useState<UsageEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Demo fallback: last 6 months, simple ramp
    const demoTrend = useMemo(
        () => [
            { month: "Jun", sheets: 3 },
            { month: "Jul", sheets: 4 },
            { month: "Aug", sheets: 6 },
            { month: "Sep", sheets: 8 },
            { month: "Oct", sheets: 10 },
            { month: "Nov", sheets: 12 },
        ],
        []
    );

    useEffect(() => {
        let cancelled = false;

        async function loadUsage() {
            try {
                setLoading(true);
                setError(null);

                const userId = await getCurrentUserId();
                if (!userId) {
                    setError("You must be logged in to see usage.");
                    setLoading(false);
                    return;
                }

                const monthKey = getCurrentMonthKey();
                const usageRow = await getOrCreateUsageForMonth(userId, monthKey);
                const eventRows = await getRecentUsageEvents(userId, 10);

                if (cancelled) return;

                setUsage(usageRow);
                setEvents(eventRows || []);
            } catch (err: any) {
                console.error("[UsagePage] Failed to load usage", err);
                if (!cancelled) {
                    setError("We couldn’t load your usage yet. Showing demo data.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        loadUsage();
        return () => {
            cancelled = true;
        };
    }, []);

    const planName = usage?.plan || "Free";
    const monthlyLimit =
        planName === "starter"
            ? 30
            : planName === "pro"
                ? 999
                : planName === "enterprise"
                    ? 9999
                    : 5; // free
    const usedThisMonth = usage?.sheets_generated ?? 0;
    const usagePercent =
        monthlyLimit > 0
            ? Math.max(0, Math.min(100, Math.round((usedThisMonth / monthlyLimit) * 100)))
            : 0;

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
                        {loading ? "…" : usedThisMonth}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Counting AI-generated templates and schema-based sheets.
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Monthly limit</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {loading ? "…" : monthlyLimit === 999 || monthlyLimit === 9999 ? "Unlimited*" : monthlyLimit}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Based on your current plan ({planName}).
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Upgrade suggestion</p>
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                        {usagePercent >= 90
                            ? "You’re at the limit — upgrade recommended."
                            : usagePercent >= 70
                                ? "You’re getting close — consider upgrading soon."
                                : "You’re comfortably within your plan."}
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
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Live + demo data
                        </span>
                    </div>

                    <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-slate-600">
                            <span>
                                {usedThisMonth} /{" "}
                                {monthlyLimit === 999 || monthlyLimit === 9999
                                    ? "∞"
                                    : monthlyLimit}{" "}
                                sheets
                            </span>
                            <span>{usagePercent}%</span>
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
                                style={{ width: `${usagePercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-6 h-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={demoTrend}>
                                <XAxis
                                    dataKey="month"
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
                                    dataKey="sheets"
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
                        When you’re consistently hitting {Math.max(5, Math.round(monthlyLimit * 0.7))}+
                        sheets per month, it’s usually time to move up a plan.
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
                        Last {events.length || 0} events
                    </span>
                </div>
                {loading ? (
                    <p className="mt-4 text-xs text-slate-500">Loading activity…</p>
                ) : events.length === 0 ? (
                    <p className="mt-4 text-xs text-slate-500">
                        No usage events yet. Once you start generating sheets, you&apos;ll see
                        activity here.
                    </p>
                ) : (
                    <ul className="mt-4 space-y-3 text-xs">
                        {events.map((event) => (
                            <li key={event.id} className="flex items-start gap-2">
                                <span className="mt-[3px] inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-emerald-500" />
                                <div className="flex-1">
                                    <p className="text-slate-800">
                                        {event.description || event.type}
                                    </p>
                                    <p className="mt-0.5 text-[10px] text-slate-400">
                                        {new Date(event.created_at).toLocaleString()}
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
