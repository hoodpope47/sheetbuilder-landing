"use client";

import { useMemo, useState, useTransition } from "react";
import { customizeTemplateAction } from "@/app/actions/sheets/customizeTemplate";

type TemplateCustomizeWizardProps = {
    templateSlug: string;
    templateTitle: string;
    templateCategory?: string | null;
};

export function TemplateCustomizeWizard(props: TemplateCustomizeWizardProps) {
    const { templateSlug, templateTitle, templateCategory } = props;

    const [tracking, setTracking] = useState("");
    const [timeHorizon, setTimeHorizon] = useState("");
    const [views, setViews] = useState("");
    const [palette, setPalette] = useState("Light / neutral");
    const [extraNotes, setExtraNotes] = useState("");

    const [isPending, startTransition] = useTransition();
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [statusError, setStatusError] = useState<string | null>(null);

    const promptPreview = useMemo(() => {
        const lines: string[] = [];

        lines.push(
            `Design a professional Google Sheet based on "${templateTitle}" for my business.`
        );

        if (templateCategory) {
            lines.push(`This template is in the "${templateCategory}" category.`);
        }

        if (tracking) {
            lines.push(`I want to track: ${tracking}.`);
        }

        if (timeHorizon) {
            lines.push(`Time horizon / number of rows: ${timeHorizon}.`);
        }

        if (views) {
            lines.push(`Desired views/tabs: ${views}.`);
        }

        if (palette) {
            lines.push(`Use a color palette that feels: ${palette}.`);
        }

        if (extraNotes) {
            lines.push(`Extra notes: ${extraNotes}.`);
        }

        lines.push(
            "Use clear tab names, clean formatting, and include formulas or charts where appropriate."
        );

        return lines.join(" ");
    }, [templateTitle, templateCategory, tracking, timeHorizon, views, palette, extraNotes]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatusMessage(null);
        setStatusError(null);

        startTransition(async () => {
            const result = await customizeTemplateAction({
                templateSlug,
                templateTitle,
                templateCategory: templateCategory ?? null,
                tracking,
                timeHorizon,
                views,
                palette,
                extraNotes,
                promptPreview,
            });

            if (result.ok) {
                setStatusMessage("Customization saved. Sheet generation is coming soon 🚀");
            } else {
                setStatusError(result.error || "Something went wrong.");
            }
        });
    }

    return (
        <div className="flex flex-col gap-8">
            {/* Step 1: Questions */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-6 shadow-xl shadow-black/40"
            >
                <h2 className="text-lg font-semibold text-slate-50 mb-2">
                    Customize this template
                </h2>
                <p className="text-sm text-slate-400 mb-4">
                    Answer a few quick questions so the AI knows how to tailor this sheet
                    to your workflow.
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                            What are you tracking?
                        </label>
                        <input
                            type="text"
                            value={tracking}
                            onChange={(e) => setTracking(e.target.value)}
                            placeholder="e.g. monthly MRR, churn, new signups"
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                Time horizon / rows
                            </label>
                            <input
                                type="text"
                                value={timeHorizon}
                                onChange={(e) => setTimeHorizon(e.target.value)}
                                placeholder="e.g. 12 months, 52 weeks, 90 days"
                                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                                Preferred color palette
                            </label>
                            <input
                                type="text"
                                value={palette}
                                onChange={(e) => setPalette(e.target.value)}
                                placeholder="e.g. dark mode, soft pastels, brand colors"
                                className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                            What views / tabs do you want?
                        </label>
                        <input
                            type="text"
                            value={views}
                            onChange={(e) => setViews(e.target.value)}
                            placeholder="e.g. input form, summary dashboard, raw data, charts"
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-400">
                            Any extra notes?
                        </label>
                        <textarea
                            value={extraNotes}
                            onChange={(e) => setExtraNotes(e.target.value)}
                            rows={3}
                            placeholder="Optional: constraints, formulas you care about, integrations, etc."
                            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 outline-none ring-0 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3">
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isPending ? "Saving..." : "Generate sheet (coming soon)"}
                    </button>

                    <span className="text-xs text-slate-500">
                        We’ll save this design as a spec so the AI can generate it later.
                    </span>
                </div>

                {statusMessage && (
                    <p className="mt-3 text-xs text-emerald-400">{statusMessage}</p>
                )}
                {statusError && (
                    <p className="mt-3 text-xs text-rose-400">{statusError}</p>
                )}
            </form>

            {/* Step 2: Prompt preview */}
            <div className="rounded-2xl border border-slate-800/60 bg-slate-950/30 p-4 text-sm text-slate-200">
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Prompt preview
                    </span>
                    <span className="text-[10px] rounded-full bg-slate-800 px-2 py-1 text-slate-400">
                        This is what we&apos;ll send to the AI
                    </span>
                </div>
                <p className="whitespace-pre-wrap leading-relaxed">{promptPreview}</p>
            </div>
        </div>
    );
}
