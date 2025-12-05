import { notFound } from "next/navigation";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/components/dashboard/templates/SheetTemplateLibrary";
import { logSheetEvent } from "@/lib/analytics/sheetEvents";

type PageProps = {
    // In Next 16, params is passed as a Promise in RSCs
    params: Promise<{ slug: string }>;
};

export default async function TemplatePreviewPage(props: PageProps) {
    const { slug } = await props.params;

    const template = (SHEET_TEMPLATE_LIST as SheetTemplate[]).find(
        (t) => t.slug === slug,
    );

    if (!template) {
        console.error(
            "[TemplatePreview] Template not found for slug:",
            slug,
            "available slugs:",
            (SHEET_TEMPLATE_LIST as SheetTemplate[]).map((t) => t.slug),
        );
        notFound();
    }

    // Fire-and-forget style logging (now a safe no-op in dev; see sheetEvents.ts)
    await logSheetEvent({
        templateSlug: template.slug,
        eventType: "sheet_opened",
        metadata: { source: "preview_page" },
    });

    const embedUrl = `https://docs.google.com/spreadsheets/d/${template.previewGoogleSheetId}/edit?usp=sharing&rm=embedded`;

    return (
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:py-12">
            {/* LEFT: Sheet preview */}
            <div className="flex-1 rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl">
                <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
                    TEMPLATE PREVIEW
                </p>
                <h1 className="mt-2 text-2xl font-semibold text-slate-50">
                    {template.name}
                </h1>
                <p className="mt-1 text-xs text-slate-400">
                    {template.category} · {template.level}
                </p>

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-black/40">
                    <iframe
                        src={embedUrl}
                        className="h-[520px] w-full"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* RIGHT: canonical prompt + actions */}
            <aside className="w-full max-w-sm rounded-3xl border border-slate-800 bg-slate-950/70 p-5 shadow-xl">
                <h2 className="text-xs font-semibold tracking-[0.2em] text-slate-400">
                    CANONICAL PROMPT
                </h2>
                <textarea
                    className="mt-3 h-32 w-full resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none"
                    defaultValue={template.canonicalPrompt}
                />

                <div className="mt-5 space-y-3">
                    {/* DIRECT copy to Google Sheets: no Next.js route, no 404 */}
                    <a
                        href={template.copySheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
                    >
                        Copy to Google Sheets
                    </a>

                    {/* Placeholder – we’ll later replace with the AI customization drawer */}
                    <button
                        type="button"
                        disabled
                        className="inline-flex w-full items-center justify-center rounded-full border border-slate-700 px-4 py-2.5 text-sm font-medium text-slate-300 opacity-60"
                    >
                        Customize this template (coming soon)
                    </button>
                </div>
            </aside>
        </div>
    );
}
