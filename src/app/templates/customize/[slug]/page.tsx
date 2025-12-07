import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

import { SHEET_TEMPLATE_LIST } from "@/components/dashboard/templates/SheetTemplateLibrary";
import { TemplateCustomizeWizard } from "@/components/dashboard/templates/TemplateCustomizeWizard";
import { SavedSpecsList } from "@/components/dashboard/templates/SavedSpecsList";

export const metadata: Metadata = {
    title: "Customize template | AI Sheet Builder",
};

type CustomizeTemplatePageProps = {
    params: Promise<{
        slug: string;
    }>;
};

type TemplateDef = (typeof SHEET_TEMPLATE_LIST)[number];

type SavedSpecRow = {
    id: string;
    title: string | null;
    description: string | null;
    created_at: string | null;
};

export default async function CustomizeTemplatePage({
    params,
}: CustomizeTemplatePageProps) {
    const resolvedParams = await params;

    // 🔎 Look up the template definition by slug
    const template = SHEET_TEMPLATE_LIST.find(
        (t) => t.slug === resolvedParams.slug,
    ) as TemplateDef | undefined;

    if (!template) {
        notFound();
    }

    // 📊 Load recent saved setups for this template
    // Note: we are NOT filtering by user yet, to match your existing data
    // where user_id is NULL in sheet_specs.
    const { data: savedSpecsRaw, error: savedSpecsError } = await supabaseServer
        .from("sheet_specs")
        .select("id, title, description, created_at")
        .eq("template_slug", resolvedParams.slug)
        .order("created_at", { ascending: false })
        .limit(5);

    if (savedSpecsError) {
        console.error("[CustomizeTemplatePage] Failed to load saved specs", {
            error: savedSpecsError.message,
        });
    }

    const savedSpecs: SavedSpecRow[] = (savedSpecsRaw ?? []) as SavedSpecRow[];

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
            <div className="mx-auto flex max-w-6xl flex-col gap-8">
                {/* Page header */}
                <header className="space-y-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-500">
                        Customize template
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {template.name}
                    </h1>
                    <p className="max-w-2xl text-sm text-slate-600">
                        Answer a few simple questions and we'll save this as a reusable
                        setup for your AI-generated Google Sheets.
                    </p>
                </header>

                {/* Main content: wizard + right column */}
                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.25fr)]">
                    {/* Wizard card */}
                    <section className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm">
                        <TemplateCustomizeWizard
                            templateSlug={template.slug}
                            templateName={template.name}
                            templateCategory={template.category}
                        />
                    </section>

                    {/* Sidebar: explainer + saved setups list */}
                    <aside className="space-y-4">
                        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3">
                            <p className="text-xs font-semibold text-emerald-800">
                                Your saved setups
                            </p>
                            <p className="mt-1 text-xs text-emerald-900/80">
                                Every time you click{" "}
                                <span className="font-semibold">Save setup</span>, we
                                capture your answers as a setup for this template. Soon
                                you&rsquo;ll be able to reuse a setup in one click when the
                                full AI generator goes live.
                            </p>
                        </div>

                        <SavedSpecsList specs={savedSpecs} />
                    </aside>
                </div>
            </div>
        </div>
    );
}
