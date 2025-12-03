"use client";

import React from "react";

export type PlanId = "free" | "starter" | "pro" | "enterprise";

type SheetTemplate = {
  id: string;
  title: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  canonicalPrompt: string;
  adminOnly?: boolean;
  minPlan: PlanId;
};

type SheetTemplateLibraryProps = {
  currentUserEmail?: string | null;
  currentPlan: PlanId;
  isAdmin: boolean;
};

const PLAN_ORDER: PlanId[] = ["free", "starter", "pro", "enterprise"];

function planRank(plan: PlanId): number {
  return PLAN_ORDER.indexOf(plan);
}

function formatPlanLabel(plan: PlanId): string {
  if (plan === "free") return "Free";
  if (plan === "starter") return "Starter";
  if (plan === "pro") return "Pro";
  return "Enterprise";
}

// Curated template set; adminOnly + minPlan control visibility
const SHEET_TEMPLATES: SheetTemplate[] = [
  {
    id: "sales-pipeline-crm",
    title: "Sales Pipeline CRM",
    category: "Sales",
    difficulty: "Intermediate",
    tags: ["sales", "crm", "pipeline"],
    canonicalPrompt:
      "Design a sales pipeline CRM sheet with stages, owners, forecasted value, and close dates. Include views for current pipeline, won deals, and lost deals.",
    adminOnly: false,
    minPlan: "starter",
  },
  {
    id: "monthly-revenue-expenses",
    title: "Monthly Revenue & Expenses",
    category: "Finance",
    difficulty: "Beginner",
    tags: ["finance", "cashflow"],
    canonicalPrompt:
      "Create a monthly revenue and expenses tracker with income categories, expense categories, and a monthly net profit summary.",
    adminOnly: false,
    minPlan: "free",
  },
  {
    id: "content-calendar",
    title: "Content Calendar",
    category: "Marketing",
    difficulty: "Beginner",
    tags: ["marketing", "content"],
    canonicalPrompt:
      "Build a content calendar sheet with channels, publish dates, status, owner, and post links for social, blog, and email.",
    adminOnly: false,
    minPlan: "free",
  },
  {
    id: "airbnb-operations-tracker",
    title: "Airbnb Operations Tracker",
    category: "Ops",
    difficulty: "Intermediate",
    tags: ["operations", "real estate"],
    canonicalPrompt:
      "Track Airbnb or short-term rental check-ins, cleaning tasks, maintenance, nightly rates, and monthly profit per property.",
    adminOnly: false,
    minPlan: "starter",
  },
  {
    id: "client-projects-kanban",
    title: "Client Projects Kanban",
    category: "Agency",
    difficulty: "Intermediate",
    tags: ["agency", "projects"],
    canonicalPrompt:
      "Design a client projects tracker with phases, owners, budgets, due dates, and a Kanban-style board view.",
    adminOnly: false,
    minPlan: "starter",
  },
  {
    id: "hiring-pipeline",
    title: "Hiring Pipeline",
    category: "HR",
    difficulty: "Intermediate",
    tags: ["hr", "recruiting"],
    canonicalPrompt:
      "Track candidates through interview stages with job role, stage, owner, feedback, and offer details.",
    adminOnly: false,
    minPlan: "starter",
  },
  {
    id: "saas-metrics-dashboard",
    title: "SaaS Metrics Dashboard",
    category: "SaaS",
    difficulty: "Advanced",
    tags: ["saas", "metrics"],
    canonicalPrompt:
      "Create a SaaS metrics dashboard with MRR, churn, expansion, cohorts, and simple charts for leadership reviews.",
    adminOnly: true,
    minPlan: "pro",
  },
  {
    id: "cashflow-90-day",
    title: "90-Day Cashflow Forecast",
    category: "Finance",
    difficulty: "Intermediate",
    tags: ["finance", "forecast"],
    canonicalPrompt:
      "Design a 90-day cashflow forecast with starting balance, inflows, outflows, alerts for low cash, and scenario toggles.",
    adminOnly: true,
    minPlan: "pro",
  },
  {
    id: "ops-daily-checklist",
    title: "Ops Daily Checklist",
    category: "Operations",
    difficulty: "Beginner",
    tags: ["operations", "checklist"],
    canonicalPrompt:
      "Create an operations daily checklist with tasks, owners, due times, completion status, and a simple score for the day.",
    adminOnly: false,
    minPlan: "free",
  },
  {
    id: "personal-budget-savings",
    title: "Personal Budget & Savings",
    category: "Personal",
    difficulty: "Beginner",
    tags: ["personal", "budget"],
    canonicalPrompt:
      "Build a personal budget sheet with income, expense categories, savings goals, and a simple monthly summary view.",
    adminOnly: false,
    minPlan: "free",
  },
];

export function SheetTemplateLibrary({
  currentUserEmail,
  currentPlan,
  isAdmin,
}: SheetTemplateLibraryProps) {
  const effectivePlan: PlanId = currentPlan ?? "free";

  const visibleTemplates = SHEET_TEMPLATES.filter((template) => {
    if (isAdmin) return true;
    if (template.adminOnly) return false;
    return planRank(effectivePlan) >= planRank(template.minPlan);
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-slate-900">
              Sheet template library
            </h1>
            <p className="text-sm text-slate-500">
              Start from a proven template or save your own sheet designs as
              reusable recipes.
            </p>
          </div>

          {currentUserEmail && (
            <div className="hidden flex-col items-end text-right text-xs text-slate-500 sm:flex">
              <span className="font-medium text-slate-700">
                Signed in as {currentUserEmail}
              </span>
              <span>
                Plan:{" "}
                <span className="font-medium">
                  {formatPlanLabel(effectivePlan)}
                </span>
                {isAdmin && (
                  <span className="ml-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    Admin
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {!isAdmin && (
          <p className="text-xs text-slate-500">
            You'll see templates that are available on your current plan. More
            advanced templates unlock as you upgrade.
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleTemplates.map((template) => {
          const lockedByPlan =
            !isAdmin &&
            planRank(effectivePlan) < planRank(template.minPlan) &&
            !template.adminOnly;

          const showPlanBadge = template.minPlan !== "free";

          return (
            <article
              key={template.id}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <h2 className="text-sm font-semibold text-slate-900">
                    {template.title}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {template.category} · {template.difficulty}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {template.adminOnly && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Admin
                    </span>
                  )}
                  {showPlanBadge && (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                      {formatPlanLabel(template.minPlan)} plan
                    </span>
                  )}
                </div>
              </div>

              <p className="mb-3 line-clamp-3 text-xs leading-relaxed text-slate-600">
                {template.canonicalPrompt}
              </p>

              <div className="mb-3 flex flex-wrap gap-1">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  disabled={lockedByPlan && !isAdmin}
                  className={[
                    "inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 text-xs font-semibold transition",
                    lockedByPlan && !isAdmin
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-emerald-500 text-white hover:bg-emerald-600",
                  ].join(" ")}
                >
                  {lockedByPlan && !isAdmin
                    ? "Upgrade to use"
                    : "Start from template"}
                </button>
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-full px-2.5 py-1 text-[11px] font-medium text-slate-500 hover:bg-slate-50"
                >
                  View spec
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {!visibleTemplates.length && (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
          No templates available yet for your plan. As you upgrade, more
          templates will unlock here.
        </div>
      )}
    </div>
  );
}
