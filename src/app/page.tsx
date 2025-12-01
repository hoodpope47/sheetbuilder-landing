// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { PricingSection } from "@/components/PricingSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Automate Your Job – AI Sheet Builder",
  description:
    "Industrial-grade Google Sheets templates and AI tools to automate repetitive work.",
};

// Logo assets note:
// The PNG files in /public/logos should follow these guidelines:
// - Transparent background
// - Square canvas: 400 x 400 px
// - Logo centered in the canvas
// - Aspect ratio preserved (no stretching)
// - Filenames:
//   - /public/logos/google.png
//   - /public/logos/stripe.png
//   - /public/logos/notion.png
//   - /public/logos/shopify.png
//   - /public/logos/airtable.png
const TRUSTED_LOGOS = [
  { name: "Google", src: "/logos/google.png" },
  { name: "Stripe", src: "/logos/stripe.png" },
  { name: "Notion", src: "/logos/notion.png" },
  { name: "Shopify", src: "/logos/shopify.png" },
  { name: "Airtable", src: "/logos/airtable.png" },
];

const getLogoScale = (name: string): string => {
  switch (name) {
    case "Google":
      // Make Google ~2x relative to base
      return "scale-[2]";
    case "Shopify":
      // Make Shopify ~1.5x relative to base
      return "scale-[1.5]";
    default:
      // All other logos stay at normal scale
      return "scale-[1]";
  }
};

const TOOLS = [
  {
    slug: "ai-sheet-builder",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h7v7H3V3zM14 3h7v4h-7V3zM14 10h7v11h-7V10zM3 11h7v7H3v-7z"
        />
      </svg>
    ),
    name: "AI Sheet Builder",
    description:
      "Generate industrial-grade Google Sheets templates in seconds with built-in formulas and formatting.",
  },
  {
    slug: "template-library",
    icon: (
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
    ),
    name: "Template Library",
    description:
      "Pre-built finance, CRM, and project templates you can drop into Sheets and customize.",
  },
  {
    slug: "schema-playground",
    icon: (
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
        <circle
          cx="12"
          cy="12"
          r="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    name: "Schema Playground",
    description:
      "Design JSON schemas that map to Sheets and generate columns, types, and validations.",
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
  return (
    <main className="min-h-screen bg-white text-slate-900 flex flex-col">
      {/* Top nav */}
      <header className="w-full border-b border-slate-200">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neon text-slate-900 font-bold shadow-soft-card">
              A
            </div>
            <span className="text-sm font-semibold tracking-tight">
              AI Sheet Builder
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link href="#tools" className="text-slate-600 hover:text-slate-900">
              Tools
            </Link>
            <Link href="#pricing" className="text-slate-600 hover:text-slate-900">
              Pricing
            </Link>
            <Link
              href="/login"
              className="rounded-full border border-slate-200 px-4 py-1.5 text-xs font-medium hover:bg-slate-50"
            >
              Log in
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="border-b border-slate-100">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-20 text-center sm:pb-20 sm:pt-24">
          <p className="mb-4 rounded-full border border-neon/30 bg-neon-soft px-4 py-1 text-xs font-medium text-neon-dark">
            AI tools for people who live in Google Sheets
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Turn Google Sheets into your smartest coworker.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Describe the workflow once and get a clean, production-ready Sheet with formulas, checks, and views already wired up.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/templates"
              className="inline-flex items-center justify-center rounded-full bg-neon px-7 py-2.5 text-sm font-semibold text-slate-900 shadow-soft-card hover:bg-neon-dark hover:text-white transition"
            >
              Start automating with AI
            </Link>
            <Link
              href="/templates"
              className="text-xs text-slate-500 hover:text-neon-dark"
            >
              View example templates →
            </Link>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            <span className="mr-1">❤️</span> Trusted by thousands of operators, founders, and analysts.
          </p>

          <p className="mt-3 text-[11px] text-slate-500 max-w-md mx-auto">
            Build smarter, automate faster, and ship spreadsheets like a pro.
          </p>
        </div>
      </section>



      {/* TRUST LOGOS SECTION */}
      <section className="border-b border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12">
          <p className="text-center text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
            Trusted by people at the following institutions
          </p>

          <div className="mt-6">
            <div className="relative mx-auto max-w-4xl overflow-hidden">
              <div className="flex animate-logo-marquee items-center gap-6 group-hover:[animation-play-state:paused]">
                {[...TRUSTED_LOGOS, ...TRUSTED_LOGOS].map((logo, index) => (
                  <div
                    key={`${logo.name}-${index}`}
                    className="flex h-16 w-40 items-center justify-center rounded-xl border border-slate-200 bg-white/90 shadow-sm flex-shrink-0"
                  >
                    <Image
                      src={logo.src}
                      alt={logo.name}
                      width={160}
                      height={64}
                      className={`h-10 w-auto object-contain ${getLogoScale(logo.name)}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OUR TOOLS SECTION */}
      <section id="tools" className="border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-8 flex flex-col gap-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              Our Tools
            </h2>
            <p className="text-sm text-slate-600">
              A focused toolkit that turns vague ideas into structured spreadsheets you can ship the same day.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TOOLS.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-soft-card hover:shadow-lg transition"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-neon-soft text-neon-dark">
                  {tool.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {tool.name}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {tool.description}
                </p>
                <Link
                  href={`/templates#${tool.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-neon-dark hover:text-neon"
                >
                  Learn more
                  <span aria-hidden>→</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <PricingSection />

      <footer className="border-t border-slate-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-6 text-[11px] text-slate-500">
          <span>
            © {new Date().getFullYear()} AI Sheet Builder. All rights reserved.
          </span>
          <div className="flex gap-4">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}