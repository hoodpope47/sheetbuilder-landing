"use client";

import React from "react";
import Link from "next/link";

export type Plan = "free" | "starter" | "pro" | "enterprise" | "admin";

export type SheetTemplate = {
  slug: string;
  title: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  canonicalPrompt: string;
  adminOnly?: boolean;
  plan: Plan;
  previewSheetId?: string;
  copySheetId?: string;
};

const DEFAULT_SHEET_ID =
  process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_SHEET_ID ??
  "1Ov_jEqt9gG5A1v3QR21kBIvi0cxsTGgHD-JFTNDd19E";

const SHEET_TEMPLATES: SheetTemplate[] = [
  {
    slug: "monthly-revenue-expenses",
    title: "Monthly Revenue & Expenses",
    category: "Finance",
    level: "Beginner",
    tags: ["finance", "cashflow"],
    canonicalPrompt:
      "Create a monthly revenue and expenses tracker with income categories, expense categories, and a monthly net profit summary.",
    plan: "free",
    adminOnly: false,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "content-calendar",
    title: "Content Calendar",
    category: "Marketing",
    level: "Beginner",
    tags: ["marketing", "content"],
    canonicalPrompt:
      "Build a content calendar with channels, publish dates, owner, status, and post links for social, blog, and email.",
    plan: "free",
    adminOnly: false,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "ops-daily-checklist",
    title: "Ops Daily Checklist",
    category: "Operations",
    level: "Beginner",
    tags: ["operations", "checklist"],
    canonicalPrompt:
      "Create an operations daily checklist with tasks, owners, due dates, completion status, and a simple score for the day.",
    plan: "free",
    adminOnly: false,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "personal-budget-savings",
    title: "Personal Budget & Savings",
    category: "Personal",
    level: "Beginner",
    tags: ["personal", "budget"],
    canonicalPrompt:
      "Build a personal budget sheet with income, expense categories, savings goals, and monthly/yearly views.",
    plan: "free",
    adminOnly: false,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "sales-pipeline-crm",
    title: "Sales Pipeline CRM",
    category: "Sales",
    level: "Intermediate",
    tags: ["sales", "crm", "pipeline"],
    canonicalPrompt:
      "Design a sales pipeline CRM sheet with stages, owners, forecasted value, close dates, and win reasons.",
    plan: "starter",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "airbnb-ops-tracker",
    title: "Airbnb Operations Tracker",
    category: "Ops",
    level: "Intermediate",
    tags: ["operations", "real estate"],
    canonicalPrompt:
      "Track Airbnb check-ins, cleaning tasks, revenue, and monthly profit across multiple listings.",
    plan: "starter",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "client-projects-kanban",
    title: "Client Projects Kanban",
    category: "Agency",
    level: "Intermediate",
    tags: ["agency", "projects"],
    canonicalPrompt:
      "Manage client projects by phase, owner, budget, and due date in a Kanban-style view.",
    plan: "starter",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "saas-metrics-dashboard",
    title: "SaaS Metrics Dashboard",
    category: "SaaS",
    level: "Advanced",
    tags: ["saas", "metrics"],
    canonicalPrompt:
      "Create a SaaS metrics sheet with MRR, churn, expansion, cohorts, and runway in a clean, founder-friendly view.",
    plan: "pro",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "cashflow-forecast-90-day",
    title: "90-Day Cashflow Forecast",
    category: "Finance",
    level: "Intermediate",
    tags: ["finance", "forecast"],
    canonicalPrompt:
      "Design a 90-day cashflow forecast with starting balance, inflows, outflows, and alerts for low cash.",
    plan: "starter",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
  {
    slug: "hiring-pipeline",
    title: "Hiring Pipeline",
    category: "HR",
    level: "Intermediate",
    tags: ["hr", "recruiting"],
    canonicalPrompt:
      "Track candidates, roles, interview stages, feedback, offers, and start dates in one place.",
    plan: "starter",
    adminOnly: true,
    previewSheetId: DEFAULT_SHEET_ID,
    copySheetId: DEFAULT_SHEET_ID,
  },
];

export const SHEET_TEMPLATE_LIST: SheetTemplate[] = SHEET_TEMPLATES;

export function SheetTemplateLibrary(props: {
  userEmail?: string | null;
  userPlan?: Plan;
}) {
  const { userEmail, userPlan = "free" } = props;
  const isAdmin = userEmail === "admin@sheetbuilder.ai";

  const planOrder: Plan[] = ["free", "starter", "pro", "enterprise", "admin"];

  const visibleTemplates = SHEET_TEMPLATE_LIST.filter((tpl) => {
    if (tpl.adminOnly && !isAdmin) return false;

    const currentIndex = planOrder.indexOf(userPlan);
    const minIndex = planOrder.indexOf(tpl.plan);
    if (currentIndex === -1 || minIndex === -1) return false;

    return currentIndex >= minIndex;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Sheet template library
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Start from a proven template or save your own sheet designs as
            reusable recipes.
          </p>
          {!isAdmin && (
            <p className="mt-1 text-xs text-slate-500">
              You&apos;ll see templates that are available on your current
              plan. More advanced templates unlock as you upgrade.
            </p>
          )}
          {isAdmin && (
            <p className="mt-1 text-xs text-emerald-700">
              Signed in as admin@sheetbuilder.ai · Admin templates are visible.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleTemplates.map((tpl) => (
          <article
            key={tpl.slug}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  {tpl.category} · {tpl.level}
                </div>
                <h2 className="mt-1 text-sm font-semibold text-slate-900">
                  {tpl.title}
                </h2>
              </div>
              {tpl.adminOnly && (
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                  Admin
                </span>
              )}
            </div>

            <p className="mt-2 line-clamp-4 text-sm text-slate-600">
              {tpl.canonicalPrompt}
            </p>

            <div className="mt-2 flex flex-wrap gap-1">
              {tpl.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <Link
                href={`/templates/copy/${tpl.slug}`}
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-600"
              >
                Start from template
              </Link>

              <Link
                href={`/templates/preview/${tpl.slug}`}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 underline underline-offset-2"
              >
                Preview
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
