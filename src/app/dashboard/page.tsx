"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

const usageTrend = [
    { month: "Jan", sheets: 4 },
    { month: "Feb", sheets: 7 },
    { month: "Mar", sheets: 10 },
    { month: "Apr", sheets: 13 },
    { month: "May", sheets: 16 },
    { month: "Jun", sheets: 20 },
];

const sheetsByCategory = [
    { name: "Sales", value: 8 },
    { name: "Finance", value: 5 },
    { name: "Ops", value: 4 },
    { name: "Other", value: 3 },
];

const PIE_COLORS = ["#10b981", "#0ea5e9", "#f97316", "#6366f1"];

export default function DashboardOverviewPage() {
    const currentPlan = "Free";
    const renewsInDays = 12;
    const usedThisMonth = 0;
    const monthlyLimit: number = 5;

    const usagePercent =
        monthlyLimit === 0 ? 0 : Math.round((usedThisMonth / monthlyLimit) * 100);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-xl font-semibold tracking-tight">
                    Welcome back, Demo.
                </h1>
                <p className="mt-1 text-sm text-slate-600">
                    Here&apos;s how your sheets and automations are doing this month.
                </p>
            </div>

            {/* Stat cards */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Sheets created</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {usedThisMonth}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">This month</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Total sheets</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">12</p>
                    <p className="mt-1 text-[11px] text-slate-500">All time</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Current plan</p>
                    <p className="mt-2 text-lg font-semibold text-emerald-600">
                        {currentPlan}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Renews in {renewsInDays} days
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-medium text-slate-500">Usage</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">
                        {usagePercent}%
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        {usedThisMonth} / {monthlyLimit} sheets this month
                    </p>
                </div>
            </div>

            <div className="grid gap-4 mt-6 grid-cols-1 lg:grid-cols-3">
                {/* Trend chart */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-slate-500">
                                Usage trend
                            </p>
                            <p className="text-sm font-semibold text-slate-900">
                                Sheets generated over time
                            </p>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
                            Demo data
                        </span>
                    </div>
                    <div className="mt-4 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={usageTrend}>
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

                {/* Category pie */}
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-500">
                        Sheets by category
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                        Where you use SheetBuilder the most
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                        <div className="h-40 w-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={sheetsByCategory}
                                        dataKey="value"
                                        innerRadius={40}
                                        outerRadius={60}
                                        paddingAngle={3}
                                    >
                                        {sheetsByCategory.map((entry, index) => (
                                            <Cell
                                                key={entry.name}
                                                fill={PIE_COLORS[index % PIE_COLORS.length]}
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2 text-xs">
                            {sheetsByCategory.map((item, index) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{ backgroundColor: PIE_COLORS[index] }}
                                    />
                                    <span className="text-slate-700">{item.name}</span>
                                    <span className="ml-auto font-medium text-slate-900">
                                        {item.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent sheets list */}
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-500">Recent sheets</p>
                    <button className="rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-semibold text-slate-700 hover:bg-slate-50">
                        + New sheet
                    </button>
                </div>
                <p className="mt-4 text-xs text-slate-500">
                    No sheets created yet. Generate your first AI-built sheet from the
                    “My Sheets” tab.
                </p>
            </div>
        </div>
    );
}
