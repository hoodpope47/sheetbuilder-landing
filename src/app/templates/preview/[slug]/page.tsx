import { notFound } from "next/navigation";
import Link from "next/link";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/components/dashboard/templates/SheetTemplateLibrary";

type PageProps = {
    params: { slug: string };
};

export default function TemplatePreviewPage({ params }: PageProps) {
    const list: SheetTemplate[] = Array.isArray(SHEET_TEMPLATE_LIST)
        ? SHEET_TEMPLATE_LIST
        : (Object.values(SHEET_TEMPLATE_LIST as any) as SheetTemplate[]);

    const template = list.find((t) => t.slug === params.slug);

    if (!template) {
        return notFound();
    }

    const sheetId =
        template.previewSheetId ||
        process.env.NEXT_PUBLIC_DEFAULT_TEMPLATE_SHEET_ID ||
        "1Ov_jEqt9gG5A1v3QR21kBIvi0cxsTGgHD-JFTNDd19E";

    const embedUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/preview`;

    return (
        <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
            <div className="mx-auto flex max-w-5xl flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400">
                            Template preview
                        </p>
                        <h1 className="mt-1 text-xl font-semibold">{template.title}</h1>
                        <p className="mt-1 text-xs text-slate-400">
                            {template.category} · {template.level}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={`/templates/copy/${template.slug}`}
                            className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-900 hover:bg-emerald-400"
                        >
                            Start from template
                        </Link>
                        <Link
                            href="/dashboard/templates"
                            className="inline-flex items-center justify-center rounded-full border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-slate-800"
                        >
                            Back to templates
                        </Link>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                    <iframe
                        src={embedUrl}
                        className="h-[70vh] w-full border-0 bg-white"
                        loading="lazy"
                    />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                    This preview is powered by a shared master sheet. When you click
                    <span className="font-semibold text-slate-200"> Start from template</span>, you’ll get your own copy in Google Sheets.
                </p>
            </div>
        </main>
    );
}
