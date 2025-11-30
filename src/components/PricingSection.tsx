"use client";

import { useState } from "react";

type PlanId = "free" | "starter" | "pro" | "enterprise";

const PLAN_PRICE_IDS: Partial<Record<PlanId, string | undefined>> = {
    free: process.env.NEXT_PUBLIC_STRIPE_FREE_PRICE_ID,
    starter: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
    pro: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    // enterprise is “Contact sales” only for now; no direct checkout
};

const PRICING_PLANS: {
    id: PlanId;
    name: string;
    price: string;
    cadence: string;
    badge?: string;
    description: string;
    ctaLabel: string;
    popular?: boolean;
    features: string[];
    stripePriceEnvKey?: keyof typeof PLAN_PRICE_IDS;
}[] = [
        {
            id: "free",
            name: "Free",
            price: "$0",
            cadence: "Forever",
            description: "Perfect for trying things out and building your first few sheets.",
            ctaLabel: "Get started free",
            features: [
                "Up to 5 AI-generated sheets / month",
                "Core templates (CRM, KPI, content)",
                "Basic email support",
                "Single workspace",
            ],
        },
        {
            id: "starter",
            name: "Starter",
            price: "$19",
            cadence: "per month",
            badge: "Best for solo builders",
            description: "For operators who live in Google Sheets and want automation on tap.",
            ctaLabel: "Upgrade to Starter",
            popular: true,
            features: [
                "Up to 30 AI-generated sheets / month",
                "All Free features",
                "Saved prompts & presets",
                "Priority support response",
                "Early access to new templates",
            ],
            stripePriceEnvKey: "starter",
        },
        {
            id: "pro",
            name: "Pro",
            price: "$39",
            cadence: "per month",
            description: "For consultants and small teams shipping dashboards every week.",
            ctaLabel: "Upgrade to Pro",
            features: [
                "Unlimited AI-generated sheets*",
                "Advanced templates (ops, finance, CRM, KPI, content)",
                "Multi-workspace support",
                "Team access (up to 5 seats)",
                "Export & backup history",
            ],
            stripePriceEnvKey: "pro",
        },
        {
            id: "enterprise",
            name: "Enterprise",
            price: "Custom",
            cadence: "billed annually",
            badge: "Talk to us",
            description: "For larger teams that need SSO, security reviews, and training.",
            ctaLabel: "Contact sales",
            features: [
                "Unlimited seats & workspaces",
                "Custom security & legal review",
                "SSO / SAML & advanced controls",
                "Dedicated implementation support",
                "Custom onboarding & training",
            ],
        },
    ];

export function PricingSection() {
    const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
    const [error, setError] = useState<string | null>(null);

    async function handleCheckout(plan: (typeof PRICING_PLANS)[number]) {
        setError(null);

        if (plan.id === "free") {
            window.location.href = "/login";
            return;
        }

        if (plan.id === "enterprise") {
            window.location.href =
                "mailto:sales@sheetbuilder.ai?subject=Enterprise%20plan%20inquiry&body=Hi%2C%20I%27d%20like%20to%20chat%20about%20the%20Enterprise%20plan.%0A%0ACompany%3A%0ATeam%20size%3A%0AUse%20case%3A";
            return;
        }

        const priceKey = plan.stripePriceEnvKey;
        const priceId = priceKey ? PLAN_PRICE_IDS[priceKey] : undefined;

        if (!priceId) {
            setError("Stripe price ID is not configured yet for this plan.");
            return;
        }

        try {
            setLoadingPlan(plan.id);
            const res = await fetch("/api/stripe/create-checkout-session", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId, planId: plan.id }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Unable to start checkout");
            }

            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("No checkout URL returned");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong starting checkout.");
            setLoadingPlan(null);
        }
    }

    return (
        <section id="pricing" className="bg-slate-950/95 text-slate-50 border-t border-slate-800">
            <div className="mx-auto max-w-6xl px-4 py-16 lg:py-20">
                <div className="mb-10 text-center max-w-2xl mx-auto">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
                        Pricing
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Start free. Scale when automations save you time.
                    </h2>
                    <p className="mt-3 text-sm text-slate-300">
                        Plans built for people who actually live in Google Sheets — from solo operators to full ops teams.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                        {error}
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {PRICING_PLANS.map((plan) => {
                        const isPopular = plan.popular;
                        const isEnterprise = plan.id === "enterprise";
                        const isFree = plan.id === "free";

                        return (
                            <div
                                key={plan.id}
                                className={[
                                    "flex flex-col rounded-2xl border bg-slate-900/60 px-4 py-5 shadow-sm backdrop-blur",
                                    "border-slate-700/70 hover:border-emerald-400/70 hover:shadow-[0_0_0_1px_rgba(45,212,191,0.6)] transition-all duration-200",
                                    isPopular ? "border-emerald-400/70 shadow-emerald-500/30" : "",
                                ]
                                    .filter(Boolean)
                                    .join(" ")}
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h3 className="text-sm font-semibold tracking-tight text-slate-50">
                                            {plan.name}
                                        </h3>
                                        <p className="mt-1 text-[11px] text-slate-300">{plan.description}</p>
                                    </div>
                                    {plan.badge && (
                                        <span className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                            {plan.badge}
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 flex items-baseline gap-1">
                                    <span className="text-xl font-semibold text-slate-50">
                                        {plan.price}
                                    </span>
                                    <span className="text-[11px] text-slate-400">{plan.cadence}</span>
                                </div>

                                <ul className="mt-4 space-y-2 text-[11px] text-slate-200">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2">
                                            <span className="mt-[2px] inline-flex h-3 w-3 flex-shrink-0 items-center justify-center rounded-full bg-emerald-400/90 text-[9px] text-slate-950">
                                                ✓
                                            </span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => handleCheckout(plan)}
                                    disabled={loadingPlan === plan.id}
                                    className={[
                                        "mt-5 inline-flex items-center justify-center rounded-full px-3 py-1.5 text-[11px] font-semibold transition",
                                        isPopular || !isFree
                                            ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                                            : "border border-slate-600 text-slate-50 hover:border-emerald-400/80 hover:text-emerald-200",
                                        loadingPlan === plan.id ? "opacity-70 cursor-wait" : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                >
                                    {loadingPlan === plan.id ? "Redirecting…" : plan.ctaLabel}
                                </button>

                                {isFree && (
                                    <p className="mt-2 text-[10px] text-slate-400">
                                        No credit card required. Upgrade any time from inside your workspace.
                                    </p>
                                )}
                                {isEnterprise && (
                                    <p className="mt-2 text-[10px] text-slate-400">
                                        Tell us how your team uses Sheets today and we’ll design a rollout around your workflows.
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
