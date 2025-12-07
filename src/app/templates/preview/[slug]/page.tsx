import { notFound } from "next/navigation";
import Link from "next/link";
import { getDashboardUser } from "@/lib/userClient";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/components/dashboard/templates/SheetTemplateLibrary";
import { logSheetEvent } from "@/lib/brain/logSheetEvent";
import { cardClasses, textStyles } from "@/design-system/theme";

type PageProps = {
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

    // Get current user for event logging
    const user = await getDashboardUser();

    // Log preview_opened event
    await logSheetEvent({
        userId: user?.id ?? null,
        templateSlug: template.slug,
        sheetSpecId: null,
        eventType: "preview_opened",
        metadata: { source: "templates-preview" },
    });

    const embedUrl = `https://docs.google.com/spreadsheets/d/${template.previewGoogleSheetId}/edit?usp=sharing&rm=embedded`;

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
                {/* LEFT: Sheet preview */}
                <div className={`flex-1 ${cardClasses.primary}`}>
                    <div className="mb-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-500">
                            Template Preview
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold text-slate-900">
                            {template.name}
                        </h1>
                        <p className="mt-1 text-sm text-slate-600">
                            {template.category} · {template.level}
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                        <iframe
                            src={embedUrl}
                            className="h-[520px] w-full"
                            loading="lazy"
                            title={`${template.name} preview`}
                        />
                    </div>
                </div>

                {/* RIGHT: canonical prompt + actions */}
                <aside className={`w-full lg:max-w-sm ${cardClasses.primary} space-y-4`}>
                    <div>
                        <h2 className={textStyles.cardLabel}>
                            Canonical Prompt
                        </h2>
                        <p className="mt-1 text-xs text-slate-500">
                            This is what the AI would use to generate this sheet
                        </p>
                    </div>

                    <textarea
                        className="h-32 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-300"
                        defaultValue={template.canonicalPrompt}
                        readOnly
                    />

                    <div className="space-y-3 pt-2">
                        {/* Direct copy to Google Sheets */}
                        <a
                            href={template.copySheetUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex w-full items-center justify-center rounded-full bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-600"
                        >
                            Copy to Google Sheets
                        </a>

                        {/* Customize link */}
                        <Link
                            href={`/templates/customize/${template.slug}`}
                            className="inline-flex w-full items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Customize this template
                        </Link>
                    </div>

                    <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2.5">
                        <p className="text-xs font-medium text-emerald-900">
                            💡 Try the AI wizard
                        </p>
                        <p className="mt-1 text-xs text-emerald-800">
                            Click &quot;Customize&quot; to let AI prefill this template based on your needs.
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
}
