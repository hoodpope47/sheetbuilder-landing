"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type TemplatePlan = "free" | "starter" | "pro" | "enterprise" | "admin-only";

interface SheetTemplate {
    id: string;
    title: string;
    niche: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    description: string;
    canonicalPrompt: string;
    tags: string[];
    plans: TemplatePlan[];
}

const curatedTemplates: SheetTemplate[] = [
    {
        id: "sales-pipeline-crm",
        title: "Sales Pipeline CRM",
        niche: "Sales",
        difficulty: "Intermediate",
        description: "Track leads from first touch to closed-won with status, owner, and forecasted value.",
        canonicalPrompt:
            "Design a sales pipeline CRM sheet with stages, owners, forecasted value, and close dates.",
        tags: ["sales", "crm", "pipeline"],
        plans: ["admin-only"],
    },
    {
        id: "monthly-revenue-expenses",
        title: "Monthly Revenue & Expenses",
        niche: "Finance",
        difficulty: "Beginner",
        description: "Simple P&L-style sheet to track revenue, fixed costs, and variable expenses by month.",
        canonicalPrompt:
            "Create a monthly revenue and expenses tracker with totals and net profit.",
        tags: ["finance", "cashflow"],
        plans: ["admin-only"],
    },
    {
        id: "content-calendar",
        title: "Content Calendar",
        niche: "Marketing",
        difficulty: "Beginner",
        description:
            "Plan posts by channel, owner, status, and publish date for social, blog, and email.",
        canonicalPrompt:
            "Build a content calendar with channels, publish dates, status, and owner.",
        tags: ["marketing", "content"],
        plans: ["admin-only"],
    },
    {
        id: "airbnb-operations",
        title: "Airbnb Operations Tracker",
        niche: "Ops",
        difficulty: "Intermediate",
        description:
            "Track check-ins, cleaning, maintenance, and revenue for multiple listings.",
        canonicalPrompt:
            "Create a sheet to track Airbnb bookings, cleaning tasks, and monthly profit.",
        tags: ["operations", "real estate"],
        plans: ["admin-only"],
    },
    {
        id: "client-projects-kanban",
        title: "Client Projects Kanban",
        niche: "Agency",
        difficulty: "Intermediate",
        description:
            "Manage client projects by phase, owner, budget, and due date in a Kanban-style view.",
        canonicalPrompt:
            "Design a client projects tracker with phases, owners, budgets, and due dates.",
        tags: ["agency", "projects"],
        plans: ["admin-only"],
    },
    {
        id: "hiring-pipeline",
        title: "Hiring Pipeline",
        niche: "HR",
        difficulty: "Intermediate",
        description:
            "Track candidates, roles, interview stages, feedback, and offers.",
        canonicalPrompt:
            "Build a hiring pipeline sheet to track candidates through interview stages.",
        tags: ["hr", "recruiting"],
        plans: ["admin-only"],
    },
    {
        id: "saas-metrics-dashboard",
        title: "SaaS Metrics Dashboard",
        niche: "SaaS",
        difficulty: "Advanced",
        description:
            "Monitor MRR, churn, expansion, and cohorts, optimized for early-stage SaaS.",
        canonicalPrompt:
            "Create a SaaS metrics sheet with MRR, churn, expansion, and cohort summaries.",
        tags: ["saas", "metrics"],
        plans: ["admin-only"],
    },
    {
        id: "cashflow-forecast",
        title: "90-Day Cashflow Forecast",
        niche: "Finance",
        difficulty: "Intermediate",
        description:
            "Visualize incoming and outgoing cash over 90 days with alerts for low balances.",
        canonicalPrompt:
            "Design a 90-day cashflow forecast with starting balance, inflows, outflows, and ending balance.",
        tags: ["finance", "forecast"],
        plans: ["admin-only"],
    },
    {
        id: "ops-daily-checklist",
        title: "Ops Daily Checklist",
        niche: "Operations",
        difficulty: "Beginner",
        description:
            "Daily checklist for recurring ops tasks, owners, and completion status.",
        canonicalPrompt:
            "Create an operations daily checklist with tasks, owners, and completion status.",
        tags: ["operations", "checklist"],
        plans: ["admin-only"],
    },
    {
        id: "personal-budget",
        title: "Personal Budget & Savings",
        niche: "Personal",
        difficulty: "Beginner",
        description:
            "Track income, expenses, and savings goals with monthly and yearly views.",
        canonicalPrompt:
            "Build a personal budget sheet with income, expense categories, and savings goals.",
        tags: ["personal", "budget"],
        plans: ["admin-only"],
    },
];

export function TemplatesClient() {
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const { data } = await supabase.auth.getUser();
                if (!isMounted) return;
                setUserEmail(data.user?.email ?? null);
            } catch (error) {
                // Silent fail; userEmail stays null
            } finally {
                if (isMounted) setLoadingUser(false);
            }
        }

        loadUser();

        return () => {
            isMounted = false;
        };
    }, []);

    const isAdmin = userEmail === "admin@sheetbuilder.ai";

    const visibleTemplates = isAdmin
        ? curatedTemplates
        : curatedTemplates.filter((t) => t.plans.includes("free")); // currently none for normal users

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h1 className="text-base font-semibold text-slate-900">
                    Sheet template library
                </h1>
                <p className="text-xs text-slate-500">
                    Start from a proven template or save your own sheet designs as reusable recipes.
                </p>
                {loadingUser ? (
                    <span className="text-[11px] text-slate-400">Checking your workspace access…</span>
                ) : (
                    <span className="text-[11px] text-slate-400">
                        Signed in as{" "}
                        <span className="font-medium text-slate-700">
                            {userEmail ?? "anonymous user"}
                        </span>
                        .
                    </span>
                )}
            </div>

            {isAdmin ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleTemplates.map((tpl) => (
                        <div
                            key={tpl.id}
                            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <div>
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        {tpl.title}
                                    </h2>
                                    <p className="text-[11px] text-slate-500">
                                        {tpl.niche} · {tpl.difficulty}
                                    </p>
                                </div>
                                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                    Admin
                                </span>
                            </div>
                            <p className="text-xs text-slate-600">{tpl.description}</p>
                            <div className="mt-3 flex flex-wrap gap-1">
                                {tpl.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            <div className="mt-3 flex flex-col gap-1">
                                <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                                    Canonical prompt
                                </p>
                                <p className="rounded-lg bg-slate-50 px-2 py-1 text-[11px] text-slate-600">
                                    {tpl.canonicalPrompt}
                                </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                                <button
                                    type="button"
                                    className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition hover:bg-emerald-400"
                                >
                                    Start from template
                                </button>
                                <button
                                    type="button"
                                    className="text-[11px] text-slate-500 hover:text-slate-700"
                                >
                                    View spec
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                    <p className="font-medium text-slate-800">Templates coming soon</p>
                    <p className="mt-1">
                        Your account will show templates tied to your plan and any custom
                        sheet designs you save. For now, only the{" "}
                        <span className="font-semibold">admin workspace</span> can see the
                        internal template library.
                    </p>
                    <p className="mt-2 text-[11px] text-slate-500">
                        If you think you should have access here, contact support to upgrade
                        your workspace.
                    </p>
                </div>
            )}
        </div>
    );
}
