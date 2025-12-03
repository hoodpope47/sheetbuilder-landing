"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

interface TemplateDef {
    id: string;
    title: string;
    niche: string;
    difficulty: Difficulty;
    description: string;
    recommendedFor: string;
    canonicalPrompt: string;
    plan: "free" | "starter" | "pro" | "enterprise";
}

const curatedTemplates: TemplateDef[] = [
    {
        id: "sales-pipeline-crm",
        title: "Sales Pipeline CRM",
        niche: "Sales / CRM",
        difficulty: "Intermediate",
        description:
            "Track leads from first touch to closed won, with stages, owners, deal value, and expected close dates.",
        recommendedFor: "Founders, sales reps, solo operators",
        canonicalPrompt:
            "Design a sales pipeline CRM sheet with stages, deal owner, company, contact info, deal size, expected close date, and probability-weighted forecast.",
        plan: "starter",
    },
    {
        id: "monthly-revenue-expenses",
        title: "Monthly Revenue & Expenses",
        niche: "Finance",
        difficulty: "Beginner",
        description:
            "Simple P&L-style view of revenue and expenses by category, with monthly totals and net profit.",
        recommendedFor: "Freelancers, small business owners",
        canonicalPrompt:
            "Create a monthly revenue and expenses tracking sheet with categories, payment methods, and a summary of total revenue, total expenses, and net profit by month.",
        plan: "free",
    },
    {
        id: "content-calendar",
        title: "Content Calendar",
        niche: "Marketing",
        difficulty: "Beginner",
        description:
            "Plan content across channels with statuses, owners, due dates, and performance notes.",
        recommendedFor: "Creators, marketing teams",
        canonicalPrompt:
            "Build a content calendar sheet for social posts, emails, and blogs with columns for channel, asset title, status, publish date, owner, and performance notes.",
        plan: "free",
    },
    {
        id: "ops-daily-dashboard",
        title: "Ops Daily Dashboard",
        niche: "Operations",
        difficulty: "Advanced",
        description:
            "Daily operational metrics with SLAs, backlog, and team capacity overview.",
        recommendedFor: "Ops leads, service teams",
        canonicalPrompt:
            "Design an operations dashboard sheet that tracks daily tickets, backlog, SLAs met, team capacity, and key operational metrics with summary views by week and month.",
        plan: "pro",
    },
    {
        id: "hiring-pipeline",
        title: "Hiring Pipeline",
        niche: "People / Recruiting",
        difficulty: "Intermediate",
        description:
            "Track candidates across stages, interview feedback, and offers.",
        recommendedFor: "Hiring managers, recruiters",
        canonicalPrompt:
            "Create a hiring pipeline tracking sheet with candidate details, role, stage, interviewer feedback, offer details, and status (hired / rejected / on hold).",
        plan: "starter",
    },
    {
        id: "customer-support-inbox",
        title: "Customer Support Inbox",
        niche: "Support",
        difficulty: "Intermediate",
        description:
            "Centralize support tickets with priorities, channels, and response times.",
        recommendedFor: "Support leads, CX teams",
        canonicalPrompt:
            "Build a customer support tracking sheet for tickets with ticket ID, customer, channel, priority, assignee, SLA target, first response time, and resolution time.",
        plan: "starter",
    },
    {
        id: "saas-metrics-cohort",
        title: "SaaS Metrics & Cohorts",
        niche: "SaaS / Analytics",
        difficulty: "Advanced",
        description:
            "Cohort-based metrics for MRR, churn, expansion, and LTV by month.",
        recommendedFor: "SaaS founders, finance leads",
        canonicalPrompt:
            "Design a SaaS metrics sheet that tracks MRR, ARR, churn, expansion, and LTV by monthly cohorts, with summary KPIs on a dashboard tab.",
        plan: "pro",
    },
    {
        id: "personal-finance-control",
        title: "Personal Finance Control Center",
        niche: "Personal",
        difficulty: "Beginner",
        description:
            "Keep track of income, bills, savings, and goals in one place.",
        recommendedFor: "Individuals, solopreneurs",
        canonicalPrompt:
            "Create a personal finance tracking sheet with income sources, recurring bills, savings goals, and a monthly summary of cash flow and savings rate.",
        plan: "free",
    },
    {
        id: "project-roadmap",
        title: "Project Roadmap & Milestones",
        niche: "Product / Projects",
        difficulty: "Intermediate",
        description:
            "Plan projects with milestones, owners, status, and timeline.",
        recommendedFor: "PMs, founders, agencies",
        canonicalPrompt:
            "Generate a project roadmap sheet with initiatives, milestones, owners, status, start/end dates, and a summary tab grouping by quarter.",
        plan: "starter",
    },
    {
        id: "client-onboarding",
        title: "Client Onboarding Checklist",
        niche: "Agencies / Services",
        difficulty: "Beginner",
        description:
            "Standardized onboarding checklist per client with due dates and owners.",
        recommendedFor: "Agencies, consultants, service providers",
        canonicalPrompt:
            "Build a client onboarding checklist sheet that tracks each client, onboarding tasks, owners, due dates, and completion status, plus a summary of clients at risk.",
        plan: "starter",
    },
];

const ADMIN_EMAIL = "admin@sheetbuilder.ai";

function TemplatesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadUser = async () => {
            try {
                const { data } = await supabase.auth.getUser();
                if (!isMounted) return;

                const email = data?.user?.email ?? null;
                setUserEmail(email);
                setIsAdmin(email === ADMIN_EMAIL);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadUser();

        // Optional: if the URL already has fromTemplate, we might later pre-fill a generator.
        const fromTemplate = searchParams.get("fromTemplate");
        if (fromTemplate) {
            // In the future this can hydrate a generator UI.
            // For now, we simply ignore it here; /dashboard/sheets can read this query.
        }

        return () => {
            isMounted = false;
        };
    }, [searchParams]);

    const handleStartFromTemplate = (template: TemplateDef) => {
        const url = `/dashboard/sheets?fromTemplate=${encodeURIComponent(
            template.id
        )}`;
        router.push(url);
    };

    if (loading) {
        // This loading state is now handled by Suspense fallback
        return null;
    }

    if (!userEmail) {
        return (
            <div className="max-w-xl rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-4 text-sm text-amber-100">
                <p className="font-semibold mb-1">Sign in to view templates</p>
                <p className="text-[13px] text-amber-50/90">
                    You need to be signed in to access the template library. Please log in
                    again from the main workspace screen.
                </p>
            </div>
        );
    }

    if (!isAdmin) {
        return (
            <div className="max-w-xl rounded-2xl border border-slate-200/20 bg-slate-50 text-slate-900 px-5 py-5">
                <h1 className="text-base font-semibold mb-1.5">
                    Template library is coming to your plan
                </h1>
                <p className="text-[13px] text-slate-700 mb-3">
                    Right now, the full library of curated AI Sheet Builder templates is
                    only visible to the admin account. Your workspace will soon include:
                </p>
                <ul className="list-disc list-inside text-[13px] text-slate-700 space-y-1">
                    <li>Templates included with your plan (Free, Starter, Pro…)</li>
                    <li>Templates you personally create with the AI generator</li>
                    <li>Favorites saved by you and your team</li>
                </ul>
                <p className="mt-3 text-[12px] text-slate-500">
                    For now, you can still create new sheets from scratch in{" "}
                    <span className="font-medium">My Sheets</span>. As we roll out the
                    library, those sheets will appear here as reusable recipes.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-semibold text-slate-900">
                    Template Library
                </h1>
                <p className="text-sm text-slate-600 max-w-2xl">
                    Curated, production-ready spreadsheet “recipes” for common workflows.
                    Each template has a canonical AI prompt so you can generate a fresh
                    copy per client or project.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-[11px] text-emerald-700 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Admin-only preview · All templates visible
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {curatedTemplates.map((t) => (
                    <article
                        key={t.id}
                        className="flex flex-col rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-sm font-semibold text-slate-900">
                                    {t.title}
                                </h2>
                                <p className="mt-0.5 text-[12px] text-slate-600">{t.niche}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700">
                                    {t.difficulty}
                                </span>
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                                    {t.plan.charAt(0).toUpperCase() + t.plan.slice(1)} plan
                                </span>
                            </div>
                        </div>

                        <p className="mt-2 text-[13px] text-slate-700">{t.description}</p>

                        <p className="mt-1 text-[11px] text-slate-500">
                            Best for: <span className="font-medium">{t.recommendedFor}</span>
                        </p>

                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2">
                            <p className="text-[11px] font-medium text-slate-700 mb-1">
                                Canonical prompt
                            </p>
                            <p className="text-[11px] text-slate-600 leading-snug line-clamp-3">
                                {t.canonicalPrompt}
                            </p>
                        </div>

                        <div className="mt-3 flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => handleStartFromTemplate(t)}
                                className="inline-flex flex-1 items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-[12px] font-semibold text-white hover:bg-emerald-400 transition shadow-sm"
                            >
                                Start from template
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    navigator.clipboard
                                        .writeText(t.canonicalPrompt)
                                        .catch(() => { });
                                }}
                                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-slate-50 transition"
                            >
                                Copy prompt
                            </button>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default function TemplatesPage() {
    return (
        <Suspense
            fallback={
                <div className="space-y-4">
                    <div className="h-6 w-40 rounded bg-slate-200/10 animate-pulse" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="h-40 rounded-2xl bg-slate-200/10 animate-pulse" />
                        <div className="h-40 rounded-2xl bg-slate-200/10 animate-pulse" />
                        <div className="h-40 rounded-2xl bg-slate-200/10 animate-pulse" />
                    </div>
                </div>
            }
        >
            <TemplatesContent />
        </Suspense>
    );
}
