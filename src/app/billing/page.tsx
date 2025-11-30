import Link from "next/link";

const PLANS = [
    {
        name: "Starter",
        price: "$0",
        badge: "Try it out",
        description: "For experimenting and simple one-off sheets.",
        features: [
            "Up to 5 AI-generated sheets / month",
            "Access to core templates",
            "Email support",
        ],
        highlight: false,
        cta: "Use for free",
        checkoutUrl: "#", // no payment, just informational
    },
    {
        name: "Pro",
        price: "$19",
        badge: "Most popular",
        description: "For operators who live in Google Sheets every day.",
        features: [
            "Unlimited AI-generated sheets",
            "Advanced templates (CRM, KPI, content calendar)",
            "Priority email support",
            "Early access to new tools",
        ],
        highlight: true,
        cta: "Upgrade with Stripe",
        checkoutUrl: "https://example.com/checkout/pro", // replace with real checkout
    },
    {
        name: "Team",
        price: "$49",
        badge: "Teams",
        description: "For teams that collaborate in shared workspaces.",
        features: [
            "Up to 10 seats included",
            "Shared template library",
            "Admin controls & roles",
            "Onboarding call with our team",
        ],
        highlight: false,
        cta: "Talk to sales",
        checkoutUrl: "mailto:hello@example.com?subject=Team%20plan%20inquiry",
    },
];

export default function BillingPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
                <header className="mb-10 flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-400">
                            Billing & plans
                        </p>
                        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
                            Upgrade when automation actually saves you time.
                        </h1>
                        <p className="mt-2 text-sm text-slate-400 max-w-xl">
                            Start on the free tier, then move to Pro or Team when your
                            spreadsheets become the operating system of your work.
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="rounded-full border border-slate-700 px-4 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-900"
                    >
                        ← Back to dashboard
                    </Link>
                </header>

                <div className="grid gap-6 md:grid-cols-3">
                    {PLANS.map((plan) => (
                        <div
                            key={plan.name}
                            className={`flex flex-col rounded-3xl border bg-slate-900/60 p-6 shadow-sm ${plan.highlight
                                    ? "border-emerald-500/80 shadow-emerald-500/20 shadow-lg"
                                    : "border-slate-800"
                                }`}
                        >
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <h2 className="text-sm font-semibold">{plan.name}</h2>
                                {plan.badge && (
                                    <span
                                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${plan.highlight
                                                ? "bg-emerald-500 text-slate-950"
                                                : "bg-slate-800 text-slate-200"
                                            }`}
                                    >
                                        {plan.badge}
                                    </span>
                                )}
                            </div>

                            <p className="text-xs text-slate-400 mb-3">{plan.description}</p>

                            <div className="flex items-baseline gap-1 mb-4">
                                <span className="text-2xl font-semibold">{plan.price}</span>
                                {plan.price !== "$0" && (
                                    <span className="text-[11px] text-slate-400">/month</span>
                                )}
                            </div>

                            <ul className="flex-1 space-y-2 text-xs text-slate-300 mb-4">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-2">
                                        <span className="mt-[3px] inline-block h-3 w-3 rounded-full bg-emerald-500/80" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={plan.checkoutUrl}
                                className={`mt-auto inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${plan.highlight
                                        ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400"
                                        : "border border-slate-700 text-slate-100 hover:bg-slate-800"
                                    }`}
                            >
                                {plan.cta}
                            </Link>
                        </div>
                    ))}
                </div>

                <p className="mt-6 text-[11px] text-slate-500">
                    Payments are handled by your checkout provider (e.g. Stripe,
                    LemonSqueezy). This page only shows the UI and links; no card
                    information is processed by this app.
                </p>
            </div>
        </main>
    );
}
