import Link from "next/link";

const SheetIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h7v7H3V3zM14 3h7v4h-7V3zM14 10h7v11h-7V10zM3 11h7v7H3v-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-5 w-5"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 14l3-3 3 3 4-4" />
  </svg>
);

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    className="h-5 w-5"
    aria-hidden
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
    <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TOOL_DETAILS = [
  {
    slug: "ai-sheet-builder",
    name: "AI Sheet Builder",
    description:
      "Generate production-ready Google Sheets with formulas, formatting, and validations pre-built for your use case.",
    icon: <SheetIcon />,
  },
  {
    slug: "template-library",
    name: "Template Library",
    description:
      "Curated templates for finance, CRM, KPIs, and content so you can skip setup and start tracking immediately.",
    icon: <ChartIcon />,
  },
  {
    slug: "schema-playground",
    name: "Schema Playground",
    description:
      "Design JSON schemas that map cleanly to Sheets columns, data types, and constraints before you generate.",
    icon: <PlusIcon />,
  },
];

const TEMPLATE_CARDS = [
  {
    slug: "income-expense",
    title: "Income & Expense Tracker",
    description: "Track cash flow across accounts with monthly summaries and burn-rate insights.",
    icon: <SheetIcon />,
  },
  {
    slug: "sales-tracker",
    title: "Sales Tracker",
    description: "Monitor pipeline stages, deal sizes, and win rates with automated conversion formulas.",
    icon: <ChartIcon />,
  },
  {
    slug: "marketing-budget",
    title: "Marketing Budget",
    description: "Plan spend by channel, compare forecast vs. actuals, and keep campaigns within budget.",
    icon: <SheetIcon />,
  },
  {
    slug: "crm-funnel",
    title: "CRM Funnel",
    description: "Log leads, owners, and activities with weighted pipeline metrics and follow-up reminders.",
    icon: <PlusIcon />,
  },
  {
    slug: "project-tracker",
    title: "Project Tracker",
    description: "Organize tasks, owners, timelines, and status updates with simple Gantt-style views.",
    icon: <ChartIcon />,
  },
  {
    slug: "content-calendar",
    title: "Content Calendar",
    description: "Plan posts, due dates, and approvals across channels with reusable brief templates.",
    icon: <SheetIcon />,
  },
  {
    slug: "kpi-dashboard",
    title: "KPI Dashboard",
    description: "Roll up key metrics, visualize trends, and keep stakeholders aligned on performance.",
    icon: <PlusIcon />,
  },
];

export const metadata = {
  title: "Templates & Tools | AI Sheet Builder",
  description: "Explore ready-to-use spreadsheet templates and the tools that power them.",
};

export default function TemplatesPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-600">
            Templates &amp; Tools
          </p>
          <h1 className="text-3xl font-semibold text-gray-900">Templates &amp; Tools</h1>
          <p className="max-w-2xl text-sm text-gray-600">
            Explore the ready-made Google Sheets templates and the focused toolkit that helps you
            customize them for finance, sales, operations, and more.
          </p>
        </header>

        <section id="tools" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Tool deep dives</h2>
            <Link href="/" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
              Back to home
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {TOOL_DETAILS.map((tool) => (
              <div
                key={tool.slug}
                id={tool.slug}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  {tool.icon}
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">{tool.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{tool.description}</p>
                <div className="mt-4">
                  <span className="inline-flex items-center text-xs font-medium text-emerald-600">
                    Learn more soon
                    <span aria-hidden className="ml-1">
                      →
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4" id="templates">
          <h2 className="text-lg font-semibold text-gray-900">Template examples</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {TEMPLATE_CARDS.map((template) => (
              <div
                key={template.slug}
                id={template.slug}
                className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  {template.icon}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">{template.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-600">{template.description}</p>
                <button className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-gray-800">
                  View example
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
