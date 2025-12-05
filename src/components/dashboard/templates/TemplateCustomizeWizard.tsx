"use client";

import React, { useMemo, useState } from "react";

type CustomizeWizardProps = {
    templateSlug: string;
    templateName: string;
    templateCategory: string;
    saveAction: (formData: FormData) => void | Promise<void>;
};

type TimeHorizonPreset = "3m" | "6m" | "12m" | "custom";

type StyleTone =
    | "clean_minimal"
    | "colorful_bold"
    | "corporate"
    | "dark_dashboard";

type Density = "spacious" | "normal" | "compact";

export function TemplateCustomizeWizard(props: CustomizeWizardProps) {
    const { templateSlug, templateName, templateCategory, saveAction } = props;

    // STEP 1 — What are we building?
    const [goal, setGoal] = useState(
        `Use this "${templateName}" sheet for my business.`
    );
    const [category, setCategory] = useState(templateCategory || "Other");
    const [audience, setAudience] = useState("Just me");

    // STEP 2 — Time & scale
    const [timePreset, setTimePreset] = useState<TimeHorizonPreset>("12m");
    const [customLength, setCustomLength] = useState("12");
    const [customUnit, setCustomUnit] = useState("months");
    const [timeGrain, setTimeGrain] = useState("monthly");
    const [expectedVolume, setExpectedVolume] = useState("");

    // STEP 3 — Columns, KPIs, views
    const [inputsText, setInputsText] = useState("");
    const [kpisText, setKpisText] = useState("");
    const [summaryTab, setSummaryTab] = useState(true);
    const [detailTab, setDetailTab] = useState(true);
    const [timeTrendChart, setTimeTrendChart] = useState(true);
    const [breakdownChart, setBreakdownChart] = useState(true);
    const [checklistView, setChecklistView] = useState(false);
    const [viewsNotes, setViewsNotes] = useState("");

    // STEP 4 — Style
    const [styleTone, setStyleTone] = useState<StyleTone>("clean_minimal");
    const [brandColors, setBrandColors] = useState("");
    const [density, setDensity] = useState<Density>("normal");
    const [extras, setExtras] = useState("freeze header row");

    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 4;

    // Build structured spec object
    const specJson = useMemo(() => {
        const horizon = (() => {
            if (timePreset === "3m") return { length: 3, unit: "months" };
            if (timePreset === "6m") return { length: 6, unit: "months" };
            if (timePreset === "12m") return { length: 12, unit: "months" };
            const parsed = parseInt(customLength || "12", 10);
            return {
                length: Number.isNaN(parsed) ? 12 : parsed,
                unit: customUnit || "months",
            };
        })();

        const splitToList = (text: string) =>
            text
                .split(/[,\n]/)
                .map((s) => s.trim())
                .filter(Boolean);

        return {
            goal,
            category,
            audience,
            time_horizon: horizon,
            time_grain: timeGrain,
            expected_volume: expectedVolume || null,
            inputs: splitToList(inputsText),
            kpis: splitToList(kpisText),
            views: {
                summary_tab: summaryTab,
                detail_tab: detailTab,
                time_trend_chart: timeTrendChart,
                breakdown_chart: breakdownChart,
                checklist_view: checklistView,
                notes: viewsNotes || null,
            },
            style: {
                tone: styleTone,
                brand_colors: splitToList(brandColors),
                density,
                extras: splitToList(extras),
            },
        };
    }, [
        goal,
        category,
        audience,
        timePreset,
        customLength,
        customUnit,
        timeGrain,
        expectedVolume,
        inputsText,
        kpisText,
        summaryTab,
        detailTab,
        timeTrendChart,
        breakdownChart,
        checklistView,
        viewsNotes,
        styleTone,
        brandColors,
        density,
        extras,
    ]);

    // Build prompt preview for display
    const promptPreview = useMemo(() => {
        const horizon = specJson.time_horizon;
        const inputs = specJson.inputs || [];
        const kpis = specJson.kpis || [];
        const views = specJson.views || {};
        const style = specJson.style || {};

        const bullets = (items?: string[]) =>
            items && items.length
                ? items.map((i) => `- ${i}`).join("\n")
                : "- (none specified)";

        return [
            `You are an expert spreadsheet designer.`,
            `Create a Google Sheet structure (tabs, columns, formulas, and charts) for the following request:`,
            ``,
            `Template: ${templateName} (${templateCategory || "General"})`,
            `Goal: ${goal || "(no goal provided)"}`,
            `Category: ${category || "(none)"}`,
            `Audience: ${audience || "(none)"}`,
            ``,
            `Time horizon: ${horizon.length} ${horizon.unit}`,
            `Time grain: ${specJson.time_grain}`,
            `Expected volume: ${specJson.expected_volume || "(not specified)"}`,
            ``,
            `Inputs (columns):`,
            bullets(inputs),
            ``,
            `KPIs:`,
            bullets(kpis),
            ``,
            `Views:`,
            `- Summary tab: ${views.summary_tab ? "yes" : "no"}`,
            `- Detail tab: ${views.detail_tab ? "yes" : "no"}`,
            `- Time trend chart: ${views.time_trend_chart ? "yes" : "no"}`,
            `- Breakdown chart: ${views.breakdown_chart ? "yes" : "no"}`,
            `- Checklist view: ${views.checklist_view ? "yes" : "no"}`,
            views.notes ? `Additional view notes: ${views.notes}` : ``,
            ``,
            `Style:`,
            `- Tone: ${style.tone || "(none)"}`,
            `- Brand colors: ${style.brand_colors && style.brand_colors.length
                ? style.brand_colors.join(", ")
                : "(none)"
            }`,
            `- Density: ${style.density || "(normal)"}`,
            style.extras && style.extras.length
                ? `- Extras: ${style.extras.join(", ")}`
                : ``,
            ``,
            `Return a JSON spec describing:`,
            `- Tabs and their names`,
            `- Columns per tab`,
            `- Calculated fields with formulas`,
            `- Chart definitions (type, data range, series)`,
        ]
            .filter(Boolean)
            .join("\n");
    }, [specJson, templateName, templateCategory, goal, category, audience]);

    const canGoNext = () => {
        if (currentStep === 1) {
            return goal.trim().length > 0 && category.trim().length > 0;
        }
        if (currentStep === 2) {
            return timeGrain.trim().length > 0;
        }
        if (currentStep === 3) {
            return true;
        }
        return true;
    };

    const handleNext = () => {
        if (!canGoNext()) return;
        setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const titleForStep = () => {
        if (currentStep === 1) return "What do you want this sheet to help you with?";
        if (currentStep === 2) return "How often do you want to track things?";
        if (currentStep === 3) return "When you open this sheet, what do you want to see first?";
        return "How should this sheet feel?";
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="space-y-2">
                    <h1 className="text-xl font-semibold text-slate-900">
                        Customize this template
                    </h1>
                    <p className="text-sm text-slate-600">{templateName}</p>
                    <p className="text-xs text-slate-500">
                        We&apos;ll use your answers to generate a tailored sheet for your
                        workflow.
                    </p>
                </div>

                <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between text-xs">
                        <p className="font-medium text-slate-700">
                            Step {currentStep} of {totalSteps}
                        </p>
                        <p className="text-slate-500">
                            Template category: {templateCategory || "General"}
                        </p>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1 w-full rounded-full bg-slate-100">
                        <div
                            className="h-1 rounded-full bg-emerald-500 transition-all"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>

                    {/* Wizard body */}
                    <form
                        className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
                        action={saveAction}
                    >
                        {/* LEFT: steps */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-semibold text-slate-900">
                                {titleForStep()}
                            </h2>

                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Describe this in 1–2 sentences
                                        </label>
                                        <textarea
                                            className="min-h-[80px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={goal}
                                            onChange={(e) => setGoal(e.target.value)}
                                            placeholder='Example: Track my monthly revenue and expenses for my small business'
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            What is this sheet about?
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                "Revenue & sales",
                                                "Marketing & content",
                                                "Operations & checklists",
                                                "Finance & budgeting",
                                                "Projects & tasks",
                                                "Other",
                                            ].map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setCategory(opt)}
                                                    className={`rounded-full px-3 py-1 text-[11px] ${category === opt
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Who will primarily use this sheet?
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {["Just me", "My small team", "Management / execs", "Clients / external"].map(
                                                (opt) => (
                                                    <button
                                                        key={opt}
                                                        type="button"
                                                        onClick={() => setAudience(opt)}
                                                        className={`rounded-full px-3 py-1 text-[11px] ${audience === opt
                                                            ? "bg-slate-900 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                            }`}
                                                    >
                                                        {opt}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Pick how often this sheet should update or be reviewed
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: "3m", label: "3 months" },
                                                { id: "6m", label: "6 months" },
                                                { id: "12m", label: "12 months" },
                                                { id: "custom", label: "Custom" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setTimePreset(opt.id as TimeHorizonPreset)
                                                    }
                                                    className={`rounded-full px-3 py-1 text-[11px] ${timePreset === opt.id
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        {timePreset === "custom" && (
                                            <div className="mt-2 flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    className="h-8 w-16 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:ring"
                                                    value={customLength}
                                                    onChange={(e) => setCustomLength(e.target.value)}
                                                />
                                                <select
                                                    className="h-8 rounded-lg border border-slate-200 bg-white px-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:ring"
                                                    value={customUnit}
                                                    onChange={(e) => setCustomUnit(e.target.value)}
                                                >
                                                    <option value="days">days</option>
                                                    <option value="weeks">weeks</option>
                                                    <option value="months">months</option>
                                                    <option value="years">years</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Custom timing
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: "daily", label: "Daily – I care about day-by-day details" },
                                                { id: "weekly", label: "Weekly – I want a weekly snapshot" },
                                                { id: "monthly", label: "Monthly – Big picture month-to-month view" },
                                                { id: "custom", label: "Custom" },
                                            ].map(
                                                (opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setTimeGrain(opt.id)}
                                                        className={`rounded-full px-3 py-1 text-[11px] ${timeGrain === opt.id
                                                            ? "bg-slate-900 text-white"
                                                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                            }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Write what you have in mind
                                        </label>
                                        <input
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={expectedVolume}
                                            onChange={(e) => setExpectedVolume(e.target.value)}
                                            placeholder='Example: every quarter, or per project'
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Choose the main views or sections you want this sheet to have
                                        </label>
                                        <textarea
                                            className="min-h-[70px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={inputsText}
                                            onChange={(e) => setInputsText(e.target.value)}
                                            placeholder="Example: customer name, plan, monthly price, start date, churn date, payment status"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            What are the most important numbers?
                                        </label>
                                        <p className="text-[11px] text-slate-500">
                                            List 3–5 examples. You can keep this really simple.
                                        </p>
                                        <textarea
                                            className="min-h-[70px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={kpisText}
                                            onChange={(e) => setKpisText(e.target.value)}
                                            placeholder="Total revenue, total expenses, profit&#10;Leads this month, leads last month, conversion rate&#10;Clients active, clients churned, average project value"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Select the views you want
                                        </label>
                                        <div className="flex flex-col gap-2 text-xs text-slate-700">
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                                                    checked={summaryTab}
                                                    onChange={(e) => setSummaryTab(e.target.checked)}
                                                />
                                                <span>A simple summary at the top (totals and key numbers)</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                                                    checked={detailTab}
                                                    onChange={(e) => setDetailTab(e.target.checked)}
                                                />
                                                <span>A detailed table of all my rows</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                                                    checked={timeTrendChart}
                                                    onChange={(e) => setTimeTrendChart(e.target.checked)}
                                                />
                                                <span>A few charts that show trends over time</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                                                    checked={breakdownChart}
                                                    onChange={(e) => setBreakdownChart(e.target.checked)}
                                                />
                                                <span>A section that warns me if something is off (red flags)</span>
                                            </label>
                                            <label className="inline-flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600"
                                                    checked={checklistView}
                                                    onChange={(e) => setChecklistView(e.target.checked)}
                                                />
                                                <span>A checklist or task tracking view</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Anything special you want this sheet to do?
                                        </label>
                                        <p className="text-[11px] text-slate-500">
                                            Optional. Mention extra tabs, special rules, or anything unique to your workflow.
                                        </p>
                                        <textarea
                                            className="min-h-[60px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={viewsNotes}
                                            onChange={(e) => setViewsNotes(e.target.value)}
                                            placeholder="I want a separate tab for each ad platform (Facebook and Google).&#10;Please include a simple &quot;instructions&quot; tab.&#10;Warn me if expenses grow faster than revenue."
                                        />
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Tell us how you like the look and feel
                                        </label>
                                        <p className="text-[11px] text-slate-500">
                                            We'll keep it clean by default.
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: "clean_minimal", label: "Super clean and minimal" },
                                                { id: "colorful_bold", label: "Colorful but not crazy" },
                                                { id: "corporate", label: "Bold and high-contrast" },
                                                { id: "dark_dashboard", label: "Dark dashboard" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setStyleTone(opt.id as StyleTone)}
                                                    className={`rounded-full px-3 py-1 text-[11px] ${styleTone === opt.id
                                                        ? "bg-emerald-600 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Brand color (optional)
                                        </label>
                                        <p className="text-[11px] text-slate-500">
                                            If you have a main color, tell us the name or hex.
                                        </p>
                                        <input
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={brandColors}
                                            onChange={(e) => setBrandColors(e.target.value)}
                                            placeholder='Example: emerald green, #10B981, or just "blue"'
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            How dense should the sheet feel?
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {[
                                                { id: "spacious", label: "Spacious" },
                                                { id: "normal", label: "Normal" },
                                                { id: "compact", label: "Compact" },
                                            ].map((opt) => (
                                                <button
                                                    key={opt.id}
                                                    type="button"
                                                    onClick={() => setDensity(opt.id as Density)}
                                                    className={`rounded-full px-3 py-1 text-[11px] ${density === opt.id
                                                        ? "bg-slate-900 text-white"
                                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                        }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-slate-700">
                                            Formatting preferences
                                        </label>
                                        <textarea
                                            className="min-h-[60px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 outline-none ring-emerald-500/10 focus:bg-white focus:ring"
                                            value={extras}
                                            onChange={(e) => setExtras(e.target.value)}
                                            placeholder="Highlight important numbers in green or red&#10;Use light shading to separate sections&#10;Keep fonts and colors very calm"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Navigation buttons */}
                            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 disabled:opacity-40"
                                >
                                    Back
                                </button>

                                <div className="flex items-center gap-3">
                                    {currentStep < totalSteps && (
                                        <button
                                            type="button"
                                            onClick={handleNext}
                                            disabled={!canGoNext()}
                                            className="rounded-full bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 disabled:opacity-40"
                                        >
                                            Next
                                        </button>
                                    )}

                                    {currentStep === totalSteps && (
                                        <button
                                            type="submit"
                                            className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700"
                                        >
                                            Save setup
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: prompt preview + hidden fields */}
                        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                                AI prompt preview
                            </p>
                            <p className="text-[11px] text-slate-500">
                                This is what the AI will see when it creates your sheet.
                            </p>
                            <pre className="mt-2 max-h-[260px] overflow-auto rounded-xl bg-slate-900 px-3 py-2 text-[10px] leading-snug text-slate-50">
                                {promptPreview}
                            </pre>

                            {/* Hidden fields for server action */}
                            <input type="hidden" name="template_slug" value={templateSlug} />
                            <input type="hidden" name="title" value={templateName} />
                            <input type="hidden" name="description" value={goal} />
                            <input
                                type="hidden"
                                name="spec_json"
                                value={JSON.stringify(specJson)}
                            />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
