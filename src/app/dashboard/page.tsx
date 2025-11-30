"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabaseClient";

type TabId = "overview" | "schemas" | "history";

type PreviewRow = {
    stage: string;
    dealName: string;
    owner: string;
    value: string;
    prob: string;
    weighted: string;
    closeDate: string;
};

const SAMPLE_ROWS: PreviewRow[] = [
    {
        stage: "New Lead",
        dealName: "Inbound – Website form",
        owner: "Alex",
        value: "$5,000",
        prob: "20%",
        weighted: "$1,000",
        closeDate: "2025-01-12",
    },
    {
        stage: "Qualified",
        dealName: "Referral – Agency",
        owner: "Mia",
        value: "$12,000",
        prob: "45%",
        weighted: "$5,400",
        closeDate: "2025-01-20",
    },
    {
        stage: "Proposal Sent",
        dealName: "Expansion – Existing client",
        owner: "Jordan",
        value: "$18,500",
        prob: "60%",
        weighted: "$11,100",
        closeDate: "2025-01-28",
    },
];

const PROMPT_PRESETS = [
    "CRM funnel with stages, deal value, and probability.",
    "Income & expense tracker with monthly rollups.",
    "KPI dashboard for marketing and sales.",
];

export default function DashboardPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabId>("overview");
    const [prompt, setPrompt] = useState(
        "Create a sales pipeline tracker with stages, deal value, and probability."
    );
    const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(
        null
    );
    const [isGenerating, setIsGenerating] = useState(false);
    const [lastGeneratedAt, setLastGeneratedAt] = useState<string | null>(null);
    const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);

    // Light Supabase “connection” check – logs to console if configured
    useEffect(() => {
        const supabase = getSupabaseBrowserClient();
        if (!supabase) {
            setSupabaseStatus("Supabase not configured yet (using local demo data).");
            return;
        }

        const check = async () => {
            try {
                // Simple ping – list auth user (will be null in our fake login, but proves config works)
                const {
                    data: { user },
                    error,
                } = await supabase.auth.getUser();
                if (error) {
                    console.warn("[Supabase] auth.getUser error:", error.message);
                }
                console.log("[Supabase] Connected. Current user:", user?.id ?? "none");
                setSupabaseStatus("Supabase connected. Ready for real data later.");
            } catch (err: any) {
                console.error("[Supabase] Connection check failed:", err?.message);
                setSupabaseStatus("Supabase configured but connection check failed.");
            }
        };

        void check();
    }, []);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setSupabaseStatus((prev) => prev); // no-op, just keeps state

        // In the future, this is where we’d call the real AI backend & Supabase.
        // For now, we just simulate work and update “last generated” time.
        await new Promise((resolve) => setTimeout(resolve, 900));

        setLastGeneratedAt(new Date().toLocaleTimeString());
        setIsGenerating(false);
    };

    const handleLogout = () => {
        // Keep this simple: clear any local “login” state, then go back to home.
        try {
            if (typeof window !== "undefined") {
                window.localStorage.removeItem("sheetbuilder_login");
            }
        } catch {
            // ignore
        }
        router.push("/login");
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-50 flex">
            {/* Sidebar */}
            <aside className="hidden w-64 flex-col border-r border-slate-800 bg-slate-950/95 px-4 py-4 sm:flex">
                {/* Brand */}
                <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-slate-950">
                        A
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold text-slate-100">
                            AI Sheet Builder
                        </span>
                        <span className="text-[10px] text-slate-400">
                            Automate your job in Google Sheets
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex flex-1 flex-col gap-1 text-xs">
                    <SidebarLink href="/dashboard" label="Dashboard" active />
                    <SidebarLink href="/templates" label="My Sheets" />
                    <SidebarLink href="/settings/profile" label="Settings" />
                    <SidebarLink href="/" label="Back to landing" />

                    <div className="mt-4">
                        <Link
                            href="/pricing"
                            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-3 py-1.5 text-[11px] font-semibold text-slate-950 hover:bg-emerald-300 transition"
                        >
                            Upgrade workspace
                        </Link>
                    </div>
                </nav>

                {/* Footer – rotating Aristotle quote placeholder */}
                <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/70 p-3 text-[10px] text-slate-300">
                    <p className="font-semibold text-slate-100">Daily note</p>
                    <p className="mt-1 italic text-slate-300">
                        “We are what we repeatedly do. Excellence, then, is not an act but a
                        habit.”
                    </p>
                    <p className="mt-1 text-[9px] text-slate-500">– Aristotle</p>
                </div>
            </aside>

            {/* Main workspace */}
            <section className="flex-1">
                {/* Top bar (for mobile + actions) */}
                <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                        <div className="flex items-center gap-2 sm:hidden">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-slate-950">
                                A
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-100">
                                    AI Sheet Builder
                                </span>
                                <span className="text-[10px] text-slate-400">
                                    Workspace
                                </span>
                            </div>
                        </div>

                        <div className="mx-auto hidden flex-col sm:flex">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                                Workspace
                            </span>
                            <span className="text-xs text-slate-300">
                                Describe the sheet you need and preview the structure instantly.
                            </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs">
                            <Link
                                href="/pricing"
                                className="hidden rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200 transition sm:inline-flex"
                            >
                                Pricing
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="rounded-full border border-slate-700 px-3 py-1 text-slate-200 hover:border-red-500/70 hover:text-red-200 transition"
                            >
                                Log out
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6">
                    {/* Tabs */}
                    <div className="flex items-center gap-2 text-[11px]">
                        <TabButton
                            id="overview"
                            label="Overview"
                            active={activeTab === "overview"}
                            onClick={() => setActiveTab("overview")}
                        />
                        <TabButton
                            id="schemas"
                            label="Schemas"
                            active={activeTab === "schemas"}
                            onClick={() => setActiveTab("schemas")}
                        />
                        <TabButton
                            id="history"
                            label="History"
                            active={activeTab === "history"}
                            onClick={() => setActiveTab("history")}
                        />
                    </div>

                    {/* Supabase status banner (small) */}
                    {supabaseStatus && (
                        <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[10px] text-slate-300">
                            {supabaseStatus}
                        </div>
                    )}

                    {/* Overview content = Prompt + Preview */}
                    {activeTab === "overview" && (
                        <div className="grid gap-4 lg:grid-cols-2">
                            {/* Prompt input card */}
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h2 className="text-xs font-semibold text-slate-100">
                                            Prompt input
                                        </h2>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            Tell the builder what you want. You can reference funnels,
                                            dashboards, content calendars, or anything custom.
                                        </p>
                                    </div>
                                    <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[9px] text-slate-400">
                                        AI Sheet Builder · v1
                                    </span>
                                </div>

                                <div className="mt-4">
                                    <textarea
                                        value={prompt}
                                        onChange={(e) => {
                                            setPrompt(e.target.value);
                                            setSelectedPresetIndex(null);
                                        }}
                                        className="min-h-[140px] w-full resize-none rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-emerald-400/80 focus:outline-none focus:ring-0"
                                        placeholder="Describe the sheet you want to generate..."
                                    />
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                                    {PROMPT_PRESETS.map((label, idx) => (
                                        <button
                                            key={label}
                                            type="button"
                                            onClick={() => {
                                                setPrompt(`Create a sheet that is a ${label}`);
                                                setSelectedPresetIndex(idx);
                                            }}
                                            className={[
                                                "rounded-full border px-3 py-1 transition",
                                                selectedPresetIndex === idx
                                                    ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-200"
                                                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200",
                                            ].join(" ")}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px]">
                                    <button
                                        type="button"
                                        onClick={handleGenerate}
                                        disabled={isGenerating}
                                        className="inline-flex items-center rounded-full bg-emerald-400 px-4 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-300 transition disabled:opacity-60"
                                    >
                                        {isGenerating ? "Generating…" : "Generate sheet"}
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-emerald-400/70 hover:text-emerald-200 transition"
                                    >
                                        Save as schema
                                    </button>

                                    <span className="text-[10px] text-slate-500">
                                        No data is written to Google Sheets until you confirm.
                                    </span>
                                </div>
                            </div>

                            {/* Generated preview card */}
                            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <div>
                                        <h2 className="text-xs font-semibold text-slate-100">
                                            Generated Sheet Preview
                                        </h2>
                                        <p className="mt-1 text-[11px] text-slate-400">
                                            This is a visual preview of the structure the AI will
                                            generate in Google Sheets: tabs, columns, and sample rows.
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end text-[10px] text-slate-400">
                                        <span className="rounded-full border border-emerald-500/60 bg-emerald-500/10 px-2 py-0.5 text-[9px] text-emerald-300">
                                            Draft · not yet pushed
                                        </span>
                                        {lastGeneratedAt && (
                                            <span className="mt-1">
                                                Last generated: {lastGeneratedAt}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70">
                                    <div className="flex items-center justify-between border-b border-slate-800 px-3 py-2 text-[11px] text-slate-300">
                                        <div className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                            <span>sales_pipeline_v1</span>
                                        </div>
                                        <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[9px] text-slate-400">
                                            CRM Funnel · v1.0
                                        </span>
                                    </div>

                                    <div className="overflow-x-auto text-[11px]">
                                        <table className="min-w-full border-collapse">
                                            <thead className="bg-slate-900/80">
                                                <tr className="text-left text-slate-300">
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Stage
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Deal Name
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Owner
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Value
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Prob. %
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Weighted
                                                    </th>
                                                    <th className="px-3 py-2 border-b border-slate-800">
                                                        Close Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {SAMPLE_ROWS.map((row, idx) => (
                                                    <tr
                                                        key={idx}
                                                        className={
                                                            idx % 2 === 0
                                                                ? "bg-slate-950"
                                                                : "bg-slate-950/80"
                                                        }
                                                    >
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.stage}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.dealName}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.owner}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.value}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.prob}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.weighted}
                                                        </td>
                                                        <td className="px-3 py-2 border-b border-slate-900">
                                                            {row.closeDate}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800 px-3 py-2 text-[10px] text-slate-400">
                                        <span>Template: CRM Funnel · v1.0</span>
                                        <span>Next action: Push to Google Sheets (coming soon)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Placeholder content for Schemas & History tabs – simple, brand-consistent */}
                    {activeTab === "schemas" && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Saved schemas
                            </h2>
                            <p className="mt-1 text-[11px] text-slate-400">
                                This is where your favorite prompts and sheet structures will live.
                                We&apos;ll wire this up to Supabase once your backend is ready.
                            </p>
                            <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center text-[11px] text-slate-500">
                                No schemas saved yet. Generate a sheet you like and click{" "}
                                <span className="font-semibold text-slate-200">
                                    Save as schema
                                </span>{" "}
                                to pin it here.
                            </div>
                        </div>
                    )}

                    {activeTab === "history" && (
                        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-300">
                            <h2 className="text-sm font-semibold text-slate-100">
                                Generation history
                            </h2>
                            <p className="mt-1 text-[11px] text-slate-400">
                                A lightweight log of your recent runs. Perfect for retracing
                                prompts that worked well.
                            </p>
                            <div className="mt-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center text-[11px] text-slate-500">
                                History tracking will go here. For now, keep experimenting with
                                prompts — we&apos;ll start logging once the full backend is plugged
                                in.
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

type SidebarLinkProps = {
    href: string;
    label: string;
    active?: boolean;
};

function SidebarLink({ href, label, active }: SidebarLinkProps) {
    return (
        <Link
            href={href}
            className={[
                "flex items-center justify-between rounded-xl border px-3 py-2 text-xs transition",
                active
                    ? "border-emerald-400/80 bg-slate-900 text-emerald-200"
                    : "border-slate-800 text-slate-300 hover:border-emerald-400/70 hover:text-emerald-200 hover:bg-slate-900/80",
            ].join(" ")}
        >
            <span>{label}</span>
        </Link>
    );
}

type TabButtonProps = {
    id: TabId;
    label: string;
    active: boolean;
    onClick: () => void;
};

function TabButton({ label, active, onClick }: TabButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "rounded-full border px-3 py-1 transition",
                active
                    ? "border-emerald-400/80 bg-emerald-500/10 text-emerald-200"
                    : "border-slate-700 bg-slate-900 text-slate-200 hover:border-emerald-400/60 hover:text-emerald-200",
            ].join(" ")}
        >
            {label}
        </button>
    );
}
