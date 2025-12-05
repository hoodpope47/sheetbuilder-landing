"use client";

import { useMemo, useState } from "react";

type TemplateCustomizeDrawerProps = {
    template: {
        slug: string;
        name: string;
        canonicalPrompt?: string | null;
        // These may or may not exist on your type; they are optional.
        categoryLabel?: string | null;
        difficultyLabel?: string | null;
    };
};

export default function TemplateCustomizeDrawer({
    template,
}: TemplateCustomizeDrawerProps) {
    const [isOpen, setIsOpen] = useState(false);

    const [whatToTrack, setWhatToTrack] = useState("");
    const [timeRange, setTimeRange] = useState("");
    const [colorPalette, setColorPalette] = useState("");
    const [chartsAndTables, setChartsAndTables] = useState("");

    const basePrompt = useMemo(() => {
        if (template.canonicalPrompt && template.canonicalPrompt.trim().length > 0) {
            return template.canonicalPrompt.trim();
        }
        return `Design a professional Google Sheet called "${template.name}" with clear tabs, readable formatting, and formulas where helpful.`;
    }, [template.canonicalPrompt, template.name]);

    const promptPreview = useMemo(() => {
        const parts: string[] = [basePrompt];

        if (whatToTrack.trim()) {
            parts.push(
                `The user wants to track: ${whatToTrack.trim()}.`
            );
        }

        if (timeRange.trim()) {
            parts.push(
                `Use a time range / row structure based on: ${timeRange.trim()}.`
            );
        }

        if (colorPalette.trim()) {
            parts.push(
                `Use this color palette / visual style: ${colorPalette.trim()}.`
            );
        }

        if (chartsAndTables.trim()) {
            parts.push(
                `Include these charts / tables: ${chartsAndTables.trim()}.`
            );
        }

        parts.push(
            "Use clear tab names, freeze header rows, and keep formulas readable."
        );

        return parts.join(" ");
    }, [basePrompt, whatToTrack, timeRange, colorPalette, chartsAndTables]);

    return (
        <>
            {/* Trigger button shown on the preview page */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-300 transition"
            >
                Customize this template
            </button>

            <p className="mt-2 text-[11px] text-slate-400">
                You&apos;ll be able to describe what you want to track, colors, and
                charts before generating or copying a sheet.
            </p>

            {/* Drawer overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-40 flex items-stretch justify-end bg-slate-950/70 backdrop-blur-sm">
                    {/* Clickable background to close */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close customization drawer"
                        className="absolute inset-0 cursor-default"
                    />

                    {/* Drawer panel */}
                    <div className="relative z-50 flex h-full w-full max-w-md flex-col bg-slate-950 shadow-xl border-l border-slate-800">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                                    Customize template
                                </p>
                                <h2 className="truncate text-sm font-semibold text-white">
                                    {template.name}
                                </h2>
                                {(template.categoryLabel || template.difficultyLabel) && (
                                    <p className="mt-0.5 text-[11px] text-slate-400">
                                        {[template.categoryLabel, template.difficultyLabel]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs text-slate-100">
                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    What do you want to track?
                                </label>
                                <textarea
                                    rows={2}
                                    value={whatToTrack}
                                    onChange={(e) => setWhatToTrack(e.target.value)}
                                    placeholder='Examples: "MRR by plan (Basic / Pro / Enterprise)", "lead sources and win rate", "expenses by category".'
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Time range / rows
                                </label>
                                <input
                                    type="text"
                                    value={timeRange}
                                    onChange={(e) => setTimeRange(e.target.value)}
                                    placeholder='Examples: "monthly for 24 months", "weekly for 12 weeks", "per deal line items".'
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Color palette / style
                                </label>
                                <input
                                    type="text"
                                    value={colorPalette}
                                    onChange={(e) => setColorPalette(e.target.value)}
                                    placeholder='Examples: "dark background, emerald highlights", "light gray with blue accent", "match my brand: black / white / neon green".'
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    Charts & tables
                                </label>
                                <textarea
                                    rows={2}
                                    value={chartsAndTables}
                                    onChange={(e) => setChartsAndTables(e.target.value)}
                                    placeholder='Examples: "MRR by month line chart, churn pie chart, table of customers with status", "stacked bar by channel".'
                                    className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    AI prompt preview
                                </label>
                                <textarea
                                    readOnly
                                    value={promptPreview}
                                    className="w-full rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-100"
                                    rows={6}
                                />
                                <p className="mt-1 text-[10px] text-slate-500">
                                    This is the prompt your AI sheet builder will use behind the
                                    scenes. In the next version, you&apos;ll be able to generate a
                                    sheet directly from this.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-slate-800 px-5 py-4 space-y-2">
                            <button
                                type="button"
                                disabled
                                className="flex w-full items-center justify-center rounded-full bg-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-950 opacity-60 cursor-not-allowed"
                            >
                                Generate sheet (coming soon)
                            </button>
                            <p className="text-[10px] text-slate-500">
                                For now, you can still make a plain copy of the base template
                                and then apply these ideas manually.
                            </p>
                            <a
                                href={`/templates/copy/${template.slug}`}
                                className="block text-center text-[11px] font-medium text-slate-300 underline-offset-2 hover:underline"
                            >
                                Skip customization and make a copy now →
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
