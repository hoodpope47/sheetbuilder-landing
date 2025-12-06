import React from "react";
import Link from "next/link";

export type PlanId = "free" | "starter" | "pro" | "enterprise";

// --- Template types and data used by dashboard + preview ---

export type SheetTemplate = {
  slug: string;
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  tags: string[];

  // New fields for preview + copy behavior
  previewGoogleSheetId: string; // used in the iframe
  copySheetUrl: string;         // direct /copy URL for Google Sheets
  canonicalPrompt: string;

  // Plan-based access control
  minPlan: PlanId;              // minimum plan required
  adminOnly?: boolean;          // templates only visible to admin
};

// Central source of truth for all templates shown in the UI.
// Ordered to match the current dashboard cards.
export const SHEET_TEMPLATE_LIST: SheetTemplate[] = [
  {
    slug: "monthly-revenue-expenses",
    name: "Monthly Revenue & Expenses",
    category: "Finance",
    level: "Beginner",
    description:
      "Create a monthly revenue and expenses tracker with income categories, expense categories, and a monthly net profit summary.",
    tags: ["finance", "cashflow"],
    previewGoogleSheetId: "19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s",
    copySheetUrl:
      "https://docs.google.com/spreadsheets/d/19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s/copy",
    canonicalPrompt:
      'Design a professional Google Sheet based on "Monthly Revenue & Expenses" for my business.',
    minPlan: "starter",
    adminOnly: false,
  },
  {
    slug: "content-calendar",
    name: "Content Calendar",
    category: "Marketing",
    level: "Beginner",
    description:
      "Build a content calendar sheet with channels, publish dates, status, owner, and post links for social, blog, and email.",
    tags: ["marketing", "content"],
    previewGoogleSheetId: "1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c",
    copySheetUrl:
      "https://docs.google.com/spreadsheets/d/1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c/copy",
    canonicalPrompt:
      'Design a professional Google Sheet based on "Content Calendar" for my business.',
    minPlan: "starter",
    adminOnly: false,
  },
  {
    slug: "ops-daily-checklist",
    name: "Ops Daily Checklist",
    category: "Operations",
    level: "Beginner",
    description:
      "Create an operations daily checklist with tasks, owners, due times, completion status, and a simple score for the day.",
    tags: ["operations", "checklist"],
    previewGoogleSheetId: "11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM",
    copySheetUrl:
      "https://docs.google.com/spreadsheets/d/11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM/copy",
    canonicalPrompt:
      'Design a professional Google Sheet based on "Ops Daily Checklist" for my business.',
    minPlan: "pro",
    adminOnly: false,
  },
  {
    slug: "personal-budget-savings",
    name: "Personal Budget & Savings",
    category: "Personal",
    level: "Beginner",
    description:
      "Build a personal budget sheet with income, expense categories, savings goals, and monthly/yearly views.",
    tags: ["personal", "budget"],
    previewGoogleSheetId: "1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc",
    copySheetUrl:
      "https://docs.google.com/spreadsheets/d/1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc/copy",
    canonicalPrompt:
      'Design a professional Google Sheet based on "Personal Budget & Savings" for my finances.',
    minPlan: "free",
    adminOnly: false,
  },
];

function canUseTemplate(opts: {
  template: SheetTemplate;
  plan: PlanId;
  isAdmin: boolean;
}): boolean {
  const { template, plan, isAdmin } = opts;

  if (isAdmin) return true;
  if (template.adminOnly) return false;

  const order: PlanId[] = ["free", "starter", "pro", "enterprise"];
  const planIndex = order.indexOf(plan);
  const minIndex = order.indexOf(template.minPlan);

  if (planIndex === -1 || minIndex === -1) {
    // Fallback: if something is weird, be safe and require upgrade
    return false;
  }

  return planIndex >= minIndex;
}

export function SheetTemplateLibrary(props: { plan: PlanId; isAdmin: boolean }) {
  const { plan, isAdmin } = props;

  const visibleTemplates = SHEET_TEMPLATE_LIST.filter((t) =>
    canUseTemplate({ template: t, plan, isAdmin })
  );

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
                  {tpl.name}
                </h2>
              </div>
            </div>

            <p className="mt-2 line-clamp-4 text-sm text-slate-600">
              {tpl.description}
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

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <a
                href={`/templates/preview/${tpl.slug}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                Preview
              </a>

              <a
                href={tpl.copySheetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600"
              >
                Copy to Google Sheets
              </a>

              {/* Customize with AI always available for now; you can gate by plan/admin later */}
              <button
                disabled
                className="inline-flex items-center justify-center rounded-full border border-emerald-500 bg-white px-3 py-1.5 text-xs font-medium text-emerald-600 opacity-50 cursor-not-allowed"
              >
                Customize (soon)
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
