import { notFound } from "next/navigation";
import {
    SHEET_TEMPLATE_LIST,
    type SheetTemplate,
} from "@/lib/templates/sheetTemplates";

type PageProps = {
    params: { slug: string };
};

export default function CustomizeTemplatePage({ params }: PageProps) {
    const list: SheetTemplate[] = SHEET_TEMPLATE_LIST;
    const template = list.find((t) => t.slug === params.slug);

    if (!template) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
            <div className="mx-auto max-w-3xl space-y-4">
                <h1 className="text-2xl font-semibold">
                    Customize: {template.name}
                </h1>
                <p className="text-sm text-slate-400">
                    This is a placeholder for the future customization flow. Here we&apos;ll
                    ask for things like rows, colors, charts, and extra fields, then
                    generate a tailored Sheet for the user&apos;s own Google account.
                </p>
            </div>
        </div>
    );
}
