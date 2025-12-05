"use client";

import Link from "next/link";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { UsageByCategoryCard } from "@/components/dashboard/overview/UsageByCategoryCard";
import { cardClasses, textStyles, palette, layout } from "@/design-system/theme";

// Demo data for the line chart (sheets generated over time).
// Later we can replace this with real per-user data from Supabase.
const usageTrend = [
    { month: "Jan", sheets: 5 },
    { month: "Feb", sheets: 7 },
    { month: "Mar", sheets: 10 },
    { month: "Apr", sheets: 13 },
    { month: "May", sheets: 16 },
    { month: "Jun", sheets: 20 },
];

// Demo recent sheets list.
// You can wire this to a real "sheets" table later.
const recentSheets = [
    {
        id: "1",
        name: "Monthly Revenue & Expenses – May",
        category: "Finance",
        createdAt: "2 days ago",
    },
    {
        id: "2",
        name: "Content Calendar – Q3",
        category: "Marketing",
        createdAt: "5 days ago",
    },
    {
        id: "3",
        name: "Ops Daily Checklist – Team A",
        category: "Ops",
        createdAt: "1 week ago",
    },
];

export default function DashboardPage() {
    return (
        <main className={`${layout.mainContainer} ${layout.pagePadding}`}>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                    <h1 className={`text-2xl font-semibold ${palette.textPrimary}`}>
                        Welcome back, Demo.
                    </h1>
                    <p className={`mt-1 text-sm ${palette.textMuted}`}>
                        Here&apos;s how your sheets and automations are doing this month.
                    </p>
                </div>

                <Link
                    href="/dashboard/sheets/new"
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
                        0
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
                        12
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
                        Renews in 12 days
                    </p>
                </div>

                <div className={cardClasses.primary}>
                    <p className={textStyles.cardLabel}>
                        Usage
                    </p>
                    <p className={`mt-2 ${textStyles.cardMetric}`}>
                        0%
                    </p>
                    <p className={`mt-1 text-xs ${palette.textMuted}`}>
                        0 / 5 sheets this month
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
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-emerald-600">
                            Demo data
                        </span>
                    </div>

                    <div className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={usageTrend}
                                margin={{ top: 10, right: 16, left: -20, bottom: 0 }}
                            >
                                <XAxis
                                    dataKey="month"
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
                                    dataKey="sheets"
                                    stroke="#22c55e"
                                    strokeWidth={2}
                                    dot={false}
                                    activeDot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut chart card (hover-to-pop is handled inside UsageByCategoryCard) */}
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
                            &quot;My Sheets&quot; tab.
                        </p>
                    </div>
                    <Link
                        href="/dashboard/sheets"
                        className="text-xs font-medium text-emerald-600 hover:underline"
                    >
                        View all
                    </Link>
                </div>

                <div className="divide-y divide-slate-100 text-sm">
                    {recentSheets.map((sheet) => (
                        <div
                            key={sheet.id}
                            className="flex items-center justify-between py-2.5"
                        >
                            <div>
                                <p className={`font-medium ${palette.textPrimary}`}>
                                    {sheet.name}
                                </p>
                                <p className={`text-xs ${palette.textMuted}`}>
                                    {sheet.category} · {sheet.createdAt}
                                </p>
                            </div>
                            <Link
                                href="/dashboard/sheets"
                                className={`text-xs font-medium ${palette.textMuted} hover:${palette.textPrimary}`}
                            >
                                Open
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
