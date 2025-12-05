import { notFound } from "next/navigation";
import { SHEET_TEMPLATE_LIST } from "@/components/dashboard/templates/SheetTemplateLibrary";
import { TemplateCustomizeWizard } from "@/components/dashboard/templates/TemplateCustomizeWizard";
import { supabaseServer } from "@/lib/supabaseServer";
import { getDashboardUser } from "@/lib/userClient";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export default async function CustomizeTemplatePage({ params }: PageProps) {
    const resolvedParams = await params;

    // Resolve templates list safely (handles both array and object map shapes).
    const list = Array.isArray(SHEET_TEMPLATE_LIST)
        ? SHEET_TEMPLATE_LIST
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : Object.values(SHEET_TEMPLATE_LIST as any);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const template = (list.find(
        (t: any) => t && t.slug && t.slug === resolvedParams.slug
    ) ?? null) as any;

    if (!template) {
        notFound();
    }

    // Server action: save spec into sheet_specs
    async function saveSpec(formData: FormData) {
        "use server";

        const templateSlug = (formData.get("template_slug") || "") as string;
        const title = (formData.get("title") || "") as string;
        const description = (formData.get("description") || "") as string;
        const rawSpec = (formData.get("spec_json") || "") as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let specJson: any = null;
        try {
            specJson = rawSpec ? JSON.parse(rawSpec) : null;
        } catch (err) {
            console.error("[CustomizeTemplate] Failed to parse spec_json", {
                err,
                rawSpec,
            });
            // Even if parsing fails, do not crash the request.
            return;
        }

        // Optional: get current user for user_id; falls back to null if not found.
        let userId: string | null = null;
        try {
            const user = await getDashboardUser();
            if (user && (user as any)?.id) {
                userId = (user as any)?.id;
            }
        } catch (err) {
            console.error("[CustomizeTemplate] Failed to load dashboard user", {
                err,
            });
        }

        try {
            const { error } = await supabaseServer.from("sheet_specs").insert({
                user_id: userId,
                template_slug: templateSlug || resolvedParams.slug,
                title: title || template.name || "Custom sheet",
                description: description || null,
                spec_json: specJson,
                model_version: null,
            });

            if (error) {
                console.error("[CustomizeTemplate] Failed to insert sheet_specs row", {
                    error,
                });
            }
        } catch (err) {
            console.error("[CustomizeTemplate] Unexpected error inserting sheet_specs", {
                err,
            });
        }

        // No redirect yet; the client UI already shows this as "Generate (save only)".
        // Later we can redirect to a "spec created" page or the user's Sheets list.
    }

    return (
        <TemplateCustomizeWizard
            templateSlug={template.slug}
            templateName={template.name}
            templateCategory={template.category || "General"}
            saveAction={saveSpec}
        />
    );
}
