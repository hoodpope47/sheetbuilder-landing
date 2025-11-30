"use client";

import Link from "next/link";
import { useState } from "react";

const TABS = ["Overview", "Schemas", "History"] as const;
type TabKey = (typeof TABS)[number];

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState<TabKey>("Overview");
    const [prompt, setPrompt] = useState(
        "Create a sales pipeline tracker with stages, deal value, and probability."
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-950/95">
                <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-800">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-slate-950 font-bold">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-tight">
                            AI Sheet Builder
                        </span>
                        <span className="text-[11px] text-slate-400">
                            Automate your job 📊
                        </span>
                    </div>
                </div>

                <nav className="mt-4 flex-1 px-3 space-y-1 text-sm">
                    <button
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 bg-slate-900 text-emerald-300 border border-emerald-500/40"
                        type="button"
                    >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 text-[10px]">
                            ●
                        </span>
                        Dashboard
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-900/70"
                    >
                        <span className="text-xs">↩</span>
                        <span>Back to landing</span>
                    </Link>

                    <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-900/70"
                    >
                        <span className="text-xs">📁</span>
                        <span>My Sheets</span>
                    </button>

                    <button
                        type="button"
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-slate-300 hover:bg-slate-900/70"
                    >
                        <span className="text-xs">⚙️</span>
                        <span>Settings</span>
                    </button>
                </nav>

                <div className="px-4 py-4 border-t border-slate-800 text-[11px] text-slate-400">
                    <p className="mb-1 font-medium text-slate-300">
                        Perfectly matching the clean Montee vibe — but legally original.
                    </p>
                    <p>Neon-green themed. Built for people who live in Google Sheets.</p>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Top bar */}
                <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 md:px-6 backdrop-blur">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-sm font-semibold text-slate-100">
                            Workspace
                        </h1>
                        <p className="text-xs text-slate-400">
                            Describe the sheet you need and preview the structure instantly.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="hidden sm:inline-flex items-center gap-1 rounded-full border border-slate-700 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-900">
                            Changelog
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.55)] hover:bg-emerald-300 transition">
                            <span>Upgrade</span>
                        </button>
                    </div>
                </header>

                {/* Tabs */}
                <div className="border-b border-slate-800 bg-slate-950/90 px-4 md:px-6">
                    <div className="flex gap-3 text-xs">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-2.5 py-2 capitalize ${activeTab === tab
                                        ? "text-emerald-300"
                                        : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <span className="absolute inset-x-0 -bottom-px mx-4 h-[2px] rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.9)]" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main workspace */}
                <main className="flex-1 px-4 py-4 md:px-6 md:py-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:gap-6">
                        {/* Prompt / controls panel */}
                        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5 shadow-[0_0_45px_rgba(15,23,42,0.9)]">
                            <h2 className="text-sm font-semibold text-slate-100 mb-2">
                                Prompt input
                            </h2>
                            <p className="text-xs text-slate-400 mb-3">
                                Tell the AI what kind of sheet you want. You can reference CRM
                                funnels, KPI dashboards, content calendars, or anything custom.
                            </p>

                            <div className="relative mb-3">
                                <textarea
                                    className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-3 text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-500/60 resize-none min-h-[110px]"
                                    placeholder="Example: Create a monthly marketing budget with channels, spend, CAC, and ROAS by campaign."
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                                <div className="pointer-events-none absolute bottom-2 right-3 text-[10px] text-slate-500">
                                    AI Sheet Builder · v1
                                </div>
                            </div>

                            <div className="mb-3 grid gap-2 text-[11px] text-slate-300 sm:grid-cols-3">
                                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 hover:border-emerald-500/60 hover:text-emerald-300 transition">
                                    CRM Funnel
                                </button>
                                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 hover:border-emerald-500/60 hover:text-emerald-300 transition">
                                    Income & Expense
                                </button>
                                <button className="rounded-full border border-slate-700 bg-slate-900/70 px-3 py-1.5 hover:border-emerald-500/60 hover:text-emerald-300 transition">
                                    KPI Dashboard
                                </button>
                            </div>

                            <div className="mt-auto flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.8)] hover:bg-emerald-300 transition"
                                    >
                                        <span>Generate Sheet</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-100 hover:border-emerald-300/70 hover:text-emerald-200 transition"
                                    >
                                        Save as Schema
                                    </button>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-1 sm:mt-0">
                                    No data is written to Google Sheets until you confirm.
                                </p>
                            </div>
                        </section>

                        {/* Preview panel */}
                        <section className="flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 md:p-5 shadow-[0_0_45px_rgba(15,23,42,0.9)]">
                            <h2 className="text-sm font-semibold text-slate-100 mb-2">
                                Generated Sheet Preview
                            </h2>
                            <p className="text-xs text-slate-400 mb-4">
                                This is a visual preview of the structure the AI will generate
                                in Google Sheets: tabs, columns, and sample rows. No real data.
                            </p>

                            <div className="mb-4 rounded-xl border border-slate-800 bg-slate-900/70 overflow-hidden">
                                <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-3 py-2">
                                    <div className="flex items-center gap-2 text-[11px] text-slate-300">
                                        <span className="inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                        <span>sales_pipeline_v1</span>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
                                        Draft · not yet pushed
                                    </span>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse text-[11px]">
                                        <thead>
                                            <tr className="bg-slate-900">
                                                {[
                                                    "Stage",
                                                    "Deal Name",
                                                    "Owner",
                                                    "Value",
                                                    "Prob. %",
                                                    "Weighted",
                                                    "Close Date",
                                                ].map((header) => (
                                                    <th
                                                        key={header}
                                                        className="border-b border-slate-800 px-3 py-2 text-left font-medium text-slate-200"
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                [
                                                    "New Lead",
                                                    "Inbound – Website",
                                                    "Alex",
                                                    "$5,000",
                                                    "20%",
                                                    "$1,000",
                                                    "2025-01-12",
                                                ],
                                                [
                                                    "Qualified",
                                                    "Referral – Agency",
                                                    "Mia",
                                                    "$12,000",
                                                    "45%",
                                                    "$5,400",
                                                    "2025-01-20",
                                                ],
                                                [
                                                    "Proposal Sent",
                                                    "Expansion – Existing",
                                                    "Jordan",
                                                    "$18,500",
                                                    "60%",
                                                    "$11,100",
                                                    "2025-01-28",
                                                ],
                                            ].map((row, idx) => (
                                                <tr
                                                    key={idx}
                                                    className={
                                                        idx % 2 === 0
                                                            ? "bg-slate-900/70"
                                                            : "bg-slate-900/40"
                                                    }
                                                >
                                                    {row.map((cell, cIdx) => (
                                                        <td
                                                            key={cIdx}
                                                            className="border-b border-slate-800 px-3 py-1.5 text-slate-100"
                                                        >
                                                            {cell}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="mt-auto grid gap-3 text-[11px] text-slate-300 sm:grid-cols-3">
                                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-slate-400">Last generated</p>
                                    <p className="mt-1 font-semibold text-slate-100">
                                        2 mins ago
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-slate-400">Template</p>
                                    <p className="mt-1 font-semibold text-slate-100">
                                        CRM Funnel · v1.0
                                    </p>
                                </div>
                                <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                                    <p className="text-slate-400">Next actions</p>
                                    <p className="mt-1 text-slate-100">
                                        "Push to Google Sheets" (coming soon)
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
