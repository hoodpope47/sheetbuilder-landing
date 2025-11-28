// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automate Your Job – AI Sheet Builder",
  description:
    "Industrial-grade Google Sheets templates and AI tools to automate repetitive work.",
};

const TRUSTED_LOGOS = [
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Stripe" },
  { name: "Notion" },
  { name: "Shopify" },
  { name: "Airtable" },
];

const TOOLS = [
  {
    slug: "ai-sheet-builder",
    label: "AI Sheet Builder",
    description:
      "Generate industrial-grade Google Sheets templates in seconds with built-in formulas and formatting.",
    icon: "📊",
  },
  {
    slug: "template-library",
    label: "Template Library",
    description:
      "Pre-built finance, CRM, and project templates you can drop into Sheets and customize.",
    icon: "📚",
  },
  {
    slug: "schema-playground",
    label: "Schema Playground",
    description:
      "Design JSON schemas that map to Sheets and generate columns, types, and validations.",
    icon: "🧩",
  },
];

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    tagline: "Perfect for trying things out",
    features: [
      "Up to 5 AI-generated sheets / month",
      "Access to core templates",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$19",
    tagline: "For solo operators & freelancers",
    features: [
      "Unlimited AI-generated sheets",
      "Advanced templates (CRM, KPI, content calendar)",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Team",
    price: "$49",
    tagline: "For teams that live in sheets",
    features: [
      "Up to 10 team members",
      "Shared template library",
      "Custom onboarding session",
    ],
    highlight: false,
  },
];

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* TOP NAV */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-sm font-bold">
              SB
            </div>
            <span className="text-sm font-semibold tracking-tight">
              SheetBuilder AI
            </span>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="#tools" className="text-slate-600 hover:text-slate-900">
              Tools
            </Link>
            <Link
              href="#pricing"
              className="text-slate-600 hover:text-slate-900"
            >
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-50"
            >
              Log in
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-20 pt-16 text-center sm:pb-24 sm:pt-24">
          <span className="mb-5 inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-4 py-1 text-[11px] font-medium text-emerald-700">
            Productivity tools for builders
          </span>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Automate Your Job
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            SheetBuilder AI is a suite of productivity tools that help you get
            your work done more quickly and make your work life easier.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-orange-600"
            >
              Start Automating Your Job
            </Link>
            <Link
              href="/templates"
              className="text-xs text-slate-600 hover:text-slate-900"
            >
              View example templates →
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            <span className="mr-1">❤️</span> Loved by 4,000+ working
            professionals.
          </p>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Trusted by people at the following institutions
          </p>

          {/* infinite marquee style row */}
          <div className="mt-6 overflow-hidden">
            <div className="group relative">
              <div className="flex animate-[marquee_22s_linear_infinite] group-hover:[animation-play-state:paused]">
                {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, index) => (
                  <div
                    key={`${logo.name}-${index}`}
                    className="mx-3 flex h-14 w-32 flex-shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white/80 text-xs font-medium text-slate-500 shadow-sm opacity-70 hover:opacity-100"
                  >
                    {logo.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TOOLS */}
      <section id="tools" className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Our Tools
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A focused toolkit to help you ship better spreadsheets, faster.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <article
                key={tool.slug}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-lg">
                  <span aria-hidden>{tool.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {tool.label}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {tool.description}
                </p>
                <Link
                  href={`/templates#${tool.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  Learn more
                  <span aria-hidden>→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Pricing
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Start free, then upgrade only when automation actually saves you
              time.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-2xl border bg-white p-6 shadow-sm ${
                  plan.highlight
                    ? "border-orange-500 shadow-md"
                    : "border-slate-200"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {plan.name}
                  </h3>
                  {plan.highlight && (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-medium text-orange-700">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{plan.tagline}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-slate-900">
                    {plan.price}
                  </span>
                  {plan.price !== "$0" && (
                    <span className="text-[11px] text-slate-500">/month</span>
                  )}
                </div>

                <ul className="mt-4 flex-1 space-y-2 text-xs text-slate-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-[3px] h-3 w-3 flex-shrink-0 rounded-full bg-emerald-500/80" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`mt-6 w-full rounded-full px-4 py-2 text-xs font-semibold transition ${
                    plan.highlight
                      ? "bg-orange-500 text-white hover:bg-orange-600"
                      : "border border-slate-200 text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {plan.price === "$0" ? "Get started for free" : "Choose plan"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-[11px] text-slate-500 sm:flex-row">
          <span>© {year} SheetBuilder AI. All rights reserved.</span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}