"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { UsageByCategoryCard } from "@/components/dashboard/overview/UsageByCategoryCard";
import { cardClasses, textStyles, palette, layout } from "@/design-system/theme";
import { useLocalProfileIdentity } from "@/lib/clientIdentity";

export default function DashboardPage() {
    const identity = useLocalProfileIdentity();
    const greetingName = identity.displayName || identity.fullName || "there";
    const [metrics, setMetrics] = useState<UsageMetrics>({
        sheetsThisMonth: 0,
        totalSheets: 0,
        planLimit: 5,
        usagePercent: 0,
        monthlyUsageSeries: [],
        usingDemoData: true,
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadMetrics() {
            try {
                setIsLoading(true);

                // Get current user
                const { data: { user } } = await supabase.auth.getUser();
                const userId = user?.id || getOrCreateLocalUserId();

                // Fetch usage metrics
                const usageMetrics = await getUsageMetrics(supabase, userId);
                setMetrics(usageMetrics);
            } catch (error) {
                console.error("[Dashboard] Error loading metrics:", error);
                // Keep default metrics on error
            } finally {
                setIsLoading(false);
            }
        }

        loadMetrics();
    }, []);

    return (
        <main className={`${layout.mainContainer} ${layout.pagePadding}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-semibold ${palette.textPrimary}`}>
                        {`Welcome back, ${greetingName}.`}
                    </h1>
                    <p className={`mt-1 text-sm ${palette.textMuted}`}>
                        Here&apos;s how your sheets and automations are doing this month.
                    </p>
                </div>

                <Link
                    href="/dashboard/templates"
                    className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-600"
                >
                    + New sheet
                </Link>
            </div>

            {/* Top stats */}
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className={cardClasses.primary}>
                    <p className={textStyles.cardLabel}>
                        Sheets created
                    </p>
                    <p className={`mt-2 ${textStyles.cardMetric}`}>
                        {isLoading ? "—" : metrics.sheetsThisMonth}
                    </p>
                    <p className={`mt-1 text-xs ${palette.textMuted}`}>
                        This month
                    </p>
                </div>

                <div className={cardClasses.primary}>
                    <p className={textStyles.cardLabel}>
                        Total sheets
                    </p>
                    <p className={`mt-2 ${textStyles.cardMetric}`}>
                        {isLoading ? "—" : metrics.totalSheets}
                    </p>
                    <p className={`mt-1 text-xs ${palette.textMuted}`}>
                        All time
                    </p>
                </div>

                <div className={cardClasses.primary}>
                    <p className={textStyles.cardLabel}>
                        Current plan
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-500">
                        Free
                    </p>
                    <p className={`mt-1 text-xs ${palette.textMuted}`}>
                        5 sheets/month
                    </p>
                </div>

                <div className={cardClasses.primary}>
                    <p className={textStyles.cardLabel}>
                        Usage
                    </p>
                    <p className={`mt-2 ${textStyles.cardMetric}`}>
                        {isLoading ? "—" : `${Math.round(metrics.usagePercent)}%`}
                    </p>
                    <p className={`mt-1 text-xs ${palette.textMuted}`}>
                        {metrics.sheetsThisMonth} / {metrics.planLimit} sheets this month
                    </p>
                </div>
            </div>

            {/* Charts row */}
            <div className="grid gap-6 lg:grid-cols-[2fr,1.25fr]">
                {/* Line chart: usage trend */}
                <div className={cardClasses.primary}>
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <p className={textStyles.cardLabel}>
                                Usage trend
                            </p>
                            <p className={textStyles.cardTitle}>
                                Sheets generated over time
                            </p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-wide ${metrics.usingDemoData
                                ? "bg-amber-50 text-amber-600"
                                : "bg-emerald-50 text-emerald-600"
                            }`}>
                            {metrics.usingDemoData ? "Demo data" : "Live data"}
                        </span>
                    </div>

                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={metrics.monthlyUsageSeries}
                                margin={{ top: 10, right: 16, left: -20, bottom: 0 }}
                            >
                                <XAxis
                                    dataKey="monthLabel"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fontSize: 12, fill: "#9ca3af" }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#ffffff",
                                        borderRadius: 8,
                                        border: "1px solid #e2e8f0",
                                        padding: "6px 10px",
                                        fontSize: 12,
                                        color: "#0f172a",
                                        boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                                    }}
                                    labelStyle={{ color: "#64748b" }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut chart card */}
                <UsageByCategoryCard />
            </div>

            {/* Recent sheets */}
            <div className={`mt-6 ${cardClasses.primary}`}>
                <div className="mb-3 flex items-center justify-between">
                    <div>
                        <p className={textStyles.cardTitle}>
                            Recent sheets
                        </p>
                        <p className={`text-xs ${palette.textMuted}`}>
                            No sheets created yet. Generate your first AI-built sheet from the
                            &quot;Templates&quot; tab.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/sheets"
                        className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                        View all
                    </Link>
                </div>
            </div>
        </main>
    );
}
