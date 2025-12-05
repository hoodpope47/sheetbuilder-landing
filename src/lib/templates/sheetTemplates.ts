export type Plan = "free" | "starter" | "pro" | "enterprise" | "admin";

export type SheetTemplate = {
    slug: string;
    name: string;
    description: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
    category: string;
    plan: Plan;
    canonicalPrompt: string;
    tags: string[];
    adminOnly?: boolean;
    previewUrl?: string;
    copyUrl?: string;
    previewSheetId?: string;
    previewSheetUrl?: string;
    copySheetUrl?: string;
    // Aliases for compatibility if needed, based on user request structure
    level?: string;
};

export const SHEET_TEMPLATE_LIST: SheetTemplate[] = [
    {
        slug: "monthly-revenue-expenses",
        name: "Monthly Revenue & Expenses",
        description: "Track monthly income, expenses, and net profit in one place.",
        difficulty: "Beginner",
        category: "Finance",
        plan: "free",
        canonicalPrompt:
            "Create a monthly revenue and expenses tracker with income categories, expense categories, and a monthly net profit summary.",
        tags: ["finance", "cashflow"],
        adminOnly: false,
        previewSheetId: "19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/19MtunOekO0WALbelH_PYEKEmAAPi3nt-Jusc5dt0p2s/copy",
    },
    {
        slug: "content-calendar",
        name: "Content Calendar",
        description: "Plan upcoming content by channel, status, and owner.",
        difficulty: "Beginner",
        category: "Marketing",
        plan: "free",
        canonicalPrompt:
            "Build a content calendar with channels, publish dates, owner, status, and post links for social, blog, and email.",
        tags: ["marketing", "content"],
        adminOnly: false,
        previewSheetId: "1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1QbC0B3AkwFo4O9ztQEdJ5WmI72pEQ37SVHNrut32B5c/copy",
    },
    {
        slug: "ops-daily-checklist",
        name: "Ops Daily Checklist",
        description: "Track daily operational tasks and completion status.",
        difficulty: "Beginner",
        category: "Operations",
        plan: "free",
        canonicalPrompt:
            "Create an operations daily checklist with tasks, owners, due dates, completion status, and a simple score for the day.",
        tags: ["operations", "checklist"],
        adminOnly: false,
        previewSheetId: "11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/11tlKQVvkCxMKlwdKslXmdyjurCySJu-1TVKOxyxk3cM/copy",
    },
    {
        slug: "personal-budget-savings",
        name: "Personal Budget & Savings",
        description: "Manage personal finances, savings goals, and monthly budgets.",
        difficulty: "Beginner",
        category: "Personal",
        plan: "free",
        canonicalPrompt:
            "Build a personal budget sheet with income, expense categories, savings goals, and monthly/yearly views.",
        tags: ["personal", "budget"],
        adminOnly: false,
        previewSheetId: "1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1t7igFex-gmqnuiltPHITsAqXHfMwtKFgOBTElWbAyWc/copy",
    },
    {
        slug: "sales-pipeline-crm",
        name: "Sales Pipeline CRM",
        description: "Track sales opportunities, stages, and forecasted value.",
        difficulty: "Intermediate",
        category: "Sales",
        plan: "starter",
        canonicalPrompt:
            "Design a sales pipeline CRM sheet with stages, owners, forecasted value, close dates, and win reasons.",
        tags: ["sales", "crm", "pipeline"],
        adminOnly: true,
        previewSheetId: "1qIwrS3breAOvZ5YK3Wb-Tv1rIkR-JoohMGpj2aEWEg0",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1qIwrS3breAOvZ5YK3Wb-Tv1rIkR-JoohMGpj2aEWEg0/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1qIwrS3breAOvZ5YK3Wb-Tv1rIkR-JoohMGpj2aEWEg0/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1qIwrS3breAOvZ5YK3Wb-Tv1rIkR-JoohMGpj2aEWEg0/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1qIwrS3breAOvZ5YK3Wb-Tv1rIkR-JoohMGpj2aEWEg0/copy",
    },
    {
        slug: "hiring-pipeline",
        name: "Hiring Pipeline",
        description: "Track job candidates through the hiring process.",
        difficulty: "Intermediate",
        category: "HR",
        plan: "starter",
        canonicalPrompt:
            "Track candidates, roles, interview stages, feedback, offers, and start dates in one place.",
        tags: ["hr", "recruiting"],
        adminOnly: true,
        previewSheetId: "1QALbvNZDEZr3MvxBVdoRSrHsiiCWLbfm_kEt15-JkhM",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1QALbvNZDEZr3MvxBVdoRSrHsiiCWLbfm_kEt15-JkhM/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1QALbvNZDEZr3MvxBVdoRSrHsiiCWLbfm_kEt15-JkhM/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1QALbvNZDEZr3MvxBVdoRSrHsiiCWLbfm_kEt15-JkhM/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1QALbvNZDEZr3MvxBVdoRSrHsiiCWLbfm_kEt15-JkhM/copy",
    },
    {
        slug: "saas-metrics-dashboard",
        name: "SaaS Metrics Dashboard",
        description: "Track key SaaS metrics like MRR, churn, and LTV.",
        difficulty: "Advanced",
        category: "SaaS",
        plan: "pro",
        canonicalPrompt:
            "Create a SaaS metrics sheet with MRR, churn, expansion, cohorts, and runway in a clean, founder-friendly view.",
        tags: ["saas", "metrics"],
        adminOnly: true,
        previewSheetId: "1JSFeHGxEAeGCqu61aE5_WxGT2FL-VyTCY38tAwmOQCU",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1JSFeHGxEAeGCqu61aE5_WxGT2FL-VyTCY38tAwmOQCU/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1JSFeHGxEAeGCqu61aE5_WxGT2FL-VyTCY38tAwmOQCU/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1JSFeHGxEAeGCqu61aE5_WxGT2FL-VyTCY38tAwmOQCU/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1JSFeHGxEAeGCqu61aE5_WxGT2FL-VyTCY38tAwmOQCU/copy",
    },
    {
        slug: "cashflow-forecast-90-day",
        name: "90-Day Cashflow Forecast",
        description: "Forecast cash flow over the next quarter.",
        difficulty: "Intermediate",
        category: "Finance",
        plan: "starter",
        canonicalPrompt:
            "Design a 90-day cashflow forecast with starting balance, inflows, outflows, and alerts for low cash.",
        tags: ["finance", "forecast"],
        adminOnly: true,
        previewSheetId: "1bHAzUIzYG-23JM2fdt3soTi20L8UqXgPkWzhGXpP4CQ",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1bHAzUIzYG-23JM2fdt3soTi20L8UqXgPkWzhGXpP4CQ/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1bHAzUIzYG-23JM2fdt3soTi20L8UqXgPkWzhGXpP4CQ/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1bHAzUIzYG-23JM2fdt3soTi20L8UqXgPkWzhGXpP4CQ/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1bHAzUIzYG-23JM2fdt3soTi20L8UqXgPkWzhGXpP4CQ/copy",
    },
    {
        slug: "airbnb-ops-tracker",
        name: "Airbnb Operations Tracker",
        description: "Manage Airbnb bookings, cleaning, and revenue.",
        difficulty: "Intermediate",
        category: "Ops",
        plan: "starter",
        canonicalPrompt:
            "Track Airbnb check-ins, cleaning tasks, revenue, and monthly profit across multiple listings.",
        tags: ["operations", "real estate"],
        adminOnly: true,
        previewSheetId: "1HWFwlQgZKyLTe99AixRK7QQLw4g63fSfCxe938RFO5Y",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1HWFwlQgZKyLTe99AixRK7QQLw4g63fSfCxe938RFO5Y/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1HWFwlQgZKyLTe99AixRK7QQLw4g63fSfCxe938RFO5Y/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1HWFwlQgZKyLTe99AixRK7QQLw4g63fSfCxe938RFO5Y/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1HWFwlQgZKyLTe99AixRK7QQLw4g63fSfCxe938RFO5Y/copy",
    },
    {
        slug: "client-projects-kanban",
        name: "Client Projects Kanban",
        description: "Visualize client projects and progress in a Kanban board.",
        difficulty: "Intermediate",
        category: "Agency",
        plan: "starter",
        canonicalPrompt:
            "Manage client projects by phase, owner, budget, and due date in a Kanban-style view.",
        tags: ["agency", "projects"],
        adminOnly: true,
        previewSheetId: "1AZM7HR_7j33bEmMRSE3OT8T5Ls99Gp9kbYCVTjEkx2k",
        previewSheetUrl:
            "https://docs.google.com/spreadsheets/d/1AZM7HR_7j33bEmMRSE3OT8T5Ls99Gp9kbYCVTjEkx2k/edit?gid=0#gid=0",
        copySheetUrl:
            "https://docs.google.com/spreadsheets/d/1AZM7HR_7j33bEmMRSE3OT8T5Ls99Gp9kbYCVTjEkx2k/copy",
        previewUrl:
            "https://docs.google.com/spreadsheets/d/1AZM7HR_7j33bEmMRSE3OT8T5Ls99Gp9kbYCVTjEkx2k/edit?gid=0#gid=0",
        copyUrl:
            "https://docs.google.com/spreadsheets/d/1AZM7HR_7j33bEmMRSE3OT8T5Ls99Gp9kbYCVTjEkx2k/copy",
    },
];
