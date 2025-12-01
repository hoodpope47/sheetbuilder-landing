"use client";

import { useRouter } from "next/navigation";

export default function BillingPage() {
    const router = useRouter();

    const currentPlan = "Free plan";
    const renewsOn = "Dec 15, 2025";

    return (
        <div className="space-y-4">
            <div>
                <h1 className="text-lg font-semibold tracking-tight">Billing</h1>
                <p className="mt-1 text-sm text-slate-600">
                    Review your current plan and payment details.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-500">
                        Current plan
                    </p>
                    <p className="mt-2 text-lg font-semibold text-emerald-600">
                        {currentPlan}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Your account is currently on the free tier. Upgrades are handled
                        via Stripe.
                    </p>
                    <p className="mt-2 text-[11px] text-slate-500">
                        Next renewal: {renewsOn} (demo value)
                    </p>
                    <button
                        className="mt-3 rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-400"
                        onClick={() => router.push("/pricing")}
                    >
                        View plans & upgrade
                    </button>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                    <p className="text-xs font-semibold text-slate-500">
                        Payment method
                    </p>
                    <p className="mt-2 text-sm text-slate-700">
                        No payment method on file.
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        Once your Stripe account is fully live, this section will show the
                        card used for your subscription.
                    </p>
                    <button className="mt-3 rounded-full border border-slate-200 px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                        Add payment method (soon)
                    </button>
                </div>
            </div>
        </div>
    );
}
