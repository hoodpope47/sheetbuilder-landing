import type { Metadata } from "next";
import { SHEET_TEMPLATE_LIST, type SheetTemplate } from "@/components/dashboard/templates/SheetTemplateLibrary";
import { TemplateCustomizeWizard } from "@/components/dashboard/templates/TemplateCustomizeWizard";

type PageProps = {
    params: { slug: string };
};

export const metadata: Metadata = {
    title: "Customize template | AI Sheet Builder",
};

function getTemplateBySlug(slug: string): SheetTemplate | null {
    try {
        const list: SheetTemplate[] = Array.isArray(SHEET_TEMPLATE_LIST)
            ? SHEET_TEMPLATE_LIST
            : Object.values(SHEET_TEMPLATE_LIST as unknown as Record<string, SheetTemplate>);

        return list.find((t) => t.slug === slug) ?? null;
    } catch (err) {
        console.error("[CustomizeTemplatePage] Failed to read SHEET_TEMPLATE_LIST", err);
        return null;
    }
}

export default async function CustomizeTemplatePage({ params }: PageProps) {
    const { slug } = await params;

    // Debug log so we can see in the dev terminal that this route is hit
    console.log("[CustomizeTemplatePage] rendering for slug:", slug);

    const template = getTemplateBySlug(slug);

    const templateTitle: string =
        template?.name ??
        slug
            .split("-")
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ");

    const templateCategory: string | null =
        template?.category ?? null;

    return (
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-10">
            <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                    Customize template
                </p>
                <h1 className="text-2xl font-semibold text-slate-50">
                    {templateTitle}
                </h1>

                {templateCategory && (
                    <p className="text-xs font-medium text-slate-400">
                        Category: {templateCategory}
                    </p>
                )}

                {!template && (
                    <p className="text-xs text-amber-400">
                        We couldn&apos;t find this template in the library, but you can still
                        describe what you want and we&apos;ll save it as a custom spec.
                    </p>
                )}

                <p className="text-sm text-slate-400">
                    Answer a few quick questions so the AI knows how to tailor this sheet
                    to your workflow. We&apos;ll save your answers as a design spec so
                    generation can happen directly in your own Google Drive later.
                </p>
            </div>

            <TemplateCustomizeWizard
                templateSlug={slug}
                templateTitle={templateTitle}
                templateCategory={templateCategory}
            />
        </div>
    );
}
